import React, { memo, useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import './styles.css';

import axios from 'axios';
import { io } from 'socket.io-client';

import { SERVERADDRESS, TOKEN, TOKENENCODESTRING, USERINFOR, SERVERSOCKET } from '../../../../utils/Constant';
import MessageBox from './component/MessageBox';


/**
*@typedef {
*ChatRomms_Id?: string,
*ChatRooms_User1_Id: string,
*ChatRooms_User2_Id: string
*} ChatRoomsOptions
*/

/**
*@typedef {
*Messages_Id: string,
*Messages_ChatRoom_Id: string,
*Messages_Message: string,
*Messages_User_Id: string,
*Messages_Type: string,  
**Messages_State: string,  
*} MessageOptions 
*/

// main work: join roomId (in database) to chat
// other work: get message from database, get information ....
const MiniInboxBox = ({index, onChatRoomId}) => {
    const [message, setMessage] = useState([]);
    const pageIndex = useRef(1);
    const loadMessage = useRef(false);
    const receiverOnline = useRef(false);


    const pageSize = 24;
    const dataLen = useRef(pageSize);
    

    // this socket use in chatting
    const socket = io(SERVERSOCKET, {
        path: '/chatSocketIo',
        transports: ['websocket'],
        secure: true,
        auth: {
            token: `${TOKENENCODESTRING} ${TOKEN}`
        },
        query: {
            userId: USERINFOR.User_Id,
            socketParam: 'socketParam123'
        }
    });

    const getMessages = (roomId) => {
        if (dataLen.current === pageSize) {
            axios({
                method: 'get',
                url: `${SERVERADDRESS}/chat?type=getMessagePages&pageIndex=${pageIndex.current}&pageSize=${pageSize}&chatRomms_Id=${roomId}`,
                headers: {
                    Authorization: `${TOKENENCODESTRING} ${TOKEN}`
                }
            }).then(res => {
                // console.log(res.data)
                if (res.data.state) {
                    document.getElementById('MiniInboxBox').style.display = 'flex';
                    // setMessage(res.data.data.recordset);
                    let arr = [];
                    const data = res.data.data.recordset;
                    dataLen.current = data.length;
                    for (let i = data.length; i > 0; i--) {
                        arr.push(data[i-1]);
                    }
                    setMessage(pre => {
                        return arr.concat(pre);
                    })
                }
            }).catch(err => console.error(err));
        }
    }

    const custom_miniInbox = () => {
        let textarea = document.getElementById(`textarea-message-${index}`);
        let textarea_box = document.getElementById(`MiniInboxBox-bottom-${index}`);
        let body = document.getElementById(`MiniInboxBox-body-${index}`);
        let limit = 150; //height limit
        let preHeight_textarea_box = 40;
        let preHeight_body = 300;
        textarea.oninput = function() {
            textarea.style.height = "";
            textarea.style.height = Math.min(textarea.scrollHeight, limit) + "px";
            textarea_box.style.height = "";
            textarea_box.style.height = Math.min(textarea_box.scrollHeight, limit) + "px";
            if (preHeight_textarea_box !== Math.min(textarea_box.scrollHeight)) {
                body.style.height = "";
                body.style.height = (preHeight_body - (Math.min(textarea_box.scrollHeight) - preHeight_textarea_box)) + "px";
                preHeight_body = preHeight_body - (Math.min(textarea_box.scrollHeight) - preHeight_textarea_box);
                preHeight_textarea_box = Math.min(textarea_box.scrollHeight);
            }
        };
    }

    useMemo(() => {
        socket.on('connect', () => {
            // the first, user join a common rom chat wit roomid (in database)
            // onChatRoomId (in database) is received from parent component
            socket.emit('user-join-roomId-inDatabase', onChatRoomId)

            // check roommate to onlene or ofline by send event to roommate via server socket
            socket.emit('check-inboxUser-online-offline', {
                senderId: USERINFOR.User_Id,
                chatRooms_Id_inDatabase: onChatRoomId
            })

            // event check (check-inboxUser-online-offline)
            // this event listen on all user. We only need to handle in the receiver role,
            // so use senderId to responsevi on reciver
            socket.on('check-inboxUser-online-offline', ({senderId, chatRooms_Id_inDatabase}) => {
                if (senderId !== USERINFOR.User_Id) {
                    socket.emit('responsive-check-inboxUser-online-offline', {
                        senderId: USERINFOR.User_Id,
                        chatRooms_Id_inDatabase: chatRooms_Id_inDatabase
                    })
                }
            })

            // responcsive to know receiver is online or offline
            // the main is target Messages_Type for message in database
            // this event listen on all user. We only need to handle in the sender role
            socket.on('responsive-check-inboxUser-online-offline', ({senderId, chatRooms_Id_inDatabase}) => {
                if (senderId !== USERINFOR.User_Id) {
                    receiverOnline.current = true
                }
            })

            // listen to messages
            socket.on('message-roomId-inDatabase', message_1 => {
                setMessage(pre => {
                    return pre.concat([message_1]);
                })
            })
        })

        getMessages(onChatRoomId);

        return () => {
            // disconect socket when exit room 
            socket.disconnect();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        custom_miniInbox();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        //scroll height to bottom of the page
        const element = document.getElementById(`MiniInboxBox-body-${index}`);
        // console.log(pageIndex.current)
        if (pageIndex.current <= 2) {
            element.scrollTop = element.scrollHeight;
        } else {
            if (loadMessage.current) {
                element.scrollTop = element.scrollHeight-(90/100)*element.scrollHeight;
            } else {
                element.scrollTop = element.scrollHeight;
            }
        }

        loadMessage.current = false;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])

    // common: message scroll
    const messageScroll = (e) => {
        // console.log(e.target.scrollTop, pageIndex.current, loadMessage.current)
        if (e.target.scrollTop < 50) {
            if (!loadMessage.current) {
                loadMessage.current = true;
                pageIndex.current = pageIndex.current + 1;
                getMessages(onChatRoomId);
            }
        }
    }

    const handleMessageInput = (e) => {
        let message = e.target.value;
        let messages_State = 'sent';
        if (receiverOnline.current) {
            messages_State = 'received'
        } else {
            messages_State = 'sent'
        }
        const messageOptions = {
            Messages_Id: '',
            Messages_ChatRoom_Id: onChatRoomId,
            Messages_Message: message.slice(0, message.length),
            Messages_User_Id: USERINFOR.User_Id,
            Messages_Type: 'text', 
            Messages_State: messages_State
        }
        
        if (e.key === 'Enter') {  
            // console.log('message-roomId-inDatabase', messageOptions)
            socket.emit('message-roomId-inDatabase', messageOptions);
            let textarea = document.getElementById(`textarea-message-${index}`);
            let textarea_box = document.getElementById(`MiniInboxBox-bottom-${index}`);
            textarea.focus();
            textarea.value = '';
            textarea_box.style.height = "";
            textarea.style.height = "";
            e.preventDefault();
        }
    }
   

    const LoadMessage = message.map((data, index) => {
        return (
            <div key={index}>   
                <MessageBox onData={data}/>
            </div>
        )
    })
    
    return (
        <div className="MiniInboxBox" id='MiniInboxBox'>
            <div className='MiniInboxBox-inbox'>
                <div>
                    <div className='MiniInboxBox-top'>
                        <div>
                            <div className='MiniInboxBox-top-name'>
                                {onChatRoomId}
                            </div>
                            <div className='MiniInboxBox-top-delete'>
                                <div>X</div>
                            </div>
                        </div>
                    </div>
                    <div className='MiniInboxBox-body' id={`MiniInboxBox-body-${index}`} onScroll={(e) => messageScroll(e)}>
                        {LoadMessage}
                    </div>
                    <div className='MiniInboxBox-bottom' id={`MiniInboxBox-bottom-${index}`}>
                        <textarea id={`textarea-message-${index}`} type="text" maxLength={250} onKeyPress={(e) => handleMessageInput(e)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(MiniInboxBox);