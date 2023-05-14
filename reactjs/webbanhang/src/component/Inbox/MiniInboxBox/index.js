import React, { memo, useMemo, useState, useEffect, useRef, useLayoutEffect } from 'react';
import './styles.css';

import { io } from 'socket.io-client';
import axios from 'axios';

import { SERVERADDRESS, SERVERSOCKET, TOKENENCODESTRING, TOKEN, USERINFOR } from '../../../utils/Constant';
import { reduxStore } from '../../../utils/redux';
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

const MiniInboxBox = () => {
    const [text_name, setText_Name] = useState('');
    const [message, setMessage] = useState([]);
    const messageQueue = useRef([]);
    const chatRoom = useRef('');
    const pageIndex = useRef(1);
    const loadMessage = useRef(false);
    const accept_chatInvitation = useRef(false);
    const receiverOnline = useRef(false);
    

    const pageSize = 24;
    const dataLen = useRef(pageSize);

    if ((TOKEN !== null) && (USERINFOR === null)) {
        window.location.reload();
    }

    const socket = USERINFOR && io(SERVERSOCKET, {
        auth: {
            token: `${TOKENENCODESTRING} ${TOKEN}`
        },
        query: {
            userId: USERINFOR && USERINFOR.User_Id, 
            firstName: USERINFOR && USERINFOR.First_Name,
            lastName: USERINFOR && USERINFOR.Last_Name
        }
    });

    const getChatRoom = (chatRoomsOptions) => {
        return new Promise((resolve, reject) => {
            axios({ 
                method: 'get',
                url: `${SERVERADDRESS}/chat?type=getChatRoom&userId1=${chatRoomsOptions.ChatRooms_User1_Id}&userId2=${chatRoomsOptions.ChatRooms_User2_Id}`,
                headers: {
                    Authorization: `${TOKENENCODESTRING} ${TOKEN}`
                }
            }).then(function (res) {
                resolve(res.data);
                // console.log(res.data.data.recordset[0]);
            }).catch(err => {
                reject(err);
            });
        })
    }

    const addChatRoom = (chatRoomsOptions) => {
        return new Promise((resolve, reject) => {
            axios({ 
                method: 'get',
                url: `${SERVERADDRESS}/chat?type=addChatRoom&userId1=${chatRoomsOptions.ChatRooms_User1_Id}&userId2=${chatRoomsOptions.ChatRooms_User2_Id}`,
                headers: {
                    Authorization: `${TOKENENCODESTRING} ${TOKEN}`
                }
            }).then(function (res) {
                resolve(res.data.data.ChatRomms_Id)
            }).catch(err => {
                reject(err);
            });
        })
    }

    const setupChat = () => {
        return new Promise((resolve, reject) => {
            resolve();
        })
    }


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
    

    // require inbox
    reduxStore.subscribe(() => {
        if (reduxStore.getState().type === 'requireInbox') {
            USERINFOR ? (() => {
                let chatRoomsOptions = {
                    chatRomms_Id: '',
                    ChatRooms_User1_Id: USERINFOR.User_Id,
                    ChatRooms_User2_Id: reduxStore.getState().data.User_Id
                }
                setText_Name(reduxStore.getState().data.Company_Name);
                setupChat().then(() => {
                    console.log('setupChat')
                    return getChatRoom(chatRoomsOptions);
                }).then((res) => {
                    // console.log('setupChat', res.data.rowsAffected[0])
                    if (res.state) {
                        if (res.data.rowsAffected[0] > 0) {
                            return res.data.recordset[0].ChatRomms_Id;
                        } else {
                            return addChatRoom(chatRoomsOptions);
                        }
                    }
                }).then(chatRomms_Id => {
                    chatRoom.current = chatRomms_Id;
                    getMessages(chatRomms_Id);
                    socket.emit('client-server-chatInvitation', {ChatRomms_Id: chatRomms_Id, Invite_User_Id: reduxStore.getState().data.User_Id})
                }).catch(err => console.error(err))
            })() : alert('Bạn chưa đăng nhập');
        }
        
        
    })

    useEffect(() => {
        let textateaArr = ['textarea-message']
        for (let i = 0; i < textateaArr.length; i++) {
            let textarea = document.getElementById(textateaArr[i]);
            let textarea_box = document.getElementById('MiniInboxBox-bottom');
            let body = document.getElementById('MiniInboxBox-body');
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
        
        return () => {
            // a offline notification to receiver or sender (chatRoom.current is a RoomId (in database))
            socket.emit('client-server-UserOffline', chatRoom.current);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        //scroll height to bottom of the page
        const element = document.getElementById("MiniInboxBox-body");
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
    }, [message])

    useMemo(() => {
        USERINFOR && socket.on('connect', () => {
            // console.log('socket.id', socket.id)
            // console.log(socket.connected);
            socket.on('server-client-message', data => {
                // setText(data);
            })

            // on receiver with room is a socket.id
            socket.on('server-client-chatInvitation', roomId_inDatabase => {
                // console.log('client-client-requireConnect', chatRomms_Id)
                document.getElementById('MiniInboxBox').style.display = 'flex';
                // socket.emit('client-server-auto_acceptInvitation', chatRomms_Id);
                socket.emit('client-server-notifi-receiverOnline', roomId_inDatabase);

                // sender(is receiver here) is online
                receiverOnline.current = true;
                chatRoom.current = roomId_inDatabase;
            })

            // on sender: sender receive notification that receiver online and receiver join a RoomId (in database)
            socket.on('server-client-notifi-receiverOnline', (roomId_inDatabase) => {
                receiverOnline.current = true;
                chatRoom.current = roomId_inDatabase;
            })

            // on receiver and sender
            socket.on('client-server-UserOffline', () => {
                receiverOnline.current = false;
            })

            socket.on('server-client-sendMessage', messageOptions_1 => {
                if (accept_chatInvitation.current) {
                    setMessage(pre => {
                        return [...pre, messageOptions_1];
                    })
                } else {
                    // save message to queue
                    messageQueue.current = [...messageQueue.current, messageOptions_1];
                    console.log('messageQueue', messageQueue.current)
                }
            })

            socket.io.on("error", (error) => {
                console.error(error);
            })

            socket.on("disconnect", () => {
                console.log('socket disconnect')
            })
        })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const deleteMiniBox = () => {
        // document.getElementById('MiniInboxBox-body').style.display = 'none';
        // document.getElementById('MiniInboxBox-bottom').style.display = 'none';
        document.getElementById('MiniInboxBox').style.display = 'none';
    }

    const hanleDisplay = () => {
        document.getElementById('MiniInboxBox-body').style.display = 'block';
        document.getElementById('MiniInboxBox-bottom').style.display = 'flex';
    }

    const messageScroll = (e) => {
        // console.log(e.target.scrollTop, pageIndex.current)
        if (e.target.scrollTop < 50) {
            if (!loadMessage.current) {
                loadMessage.current = true;
                pageIndex.current = pageIndex.current + 1;
                getMessages(chatRoom.current);
            }
        }
    }

    const handleMessageInput = (e) => {
        let message = e.target.value;
        let messages_State;
        if (receiverOnline.current) {
            messages_State = 'received'
        } else {
            messages_State = 'sent'
        }
        const messageOptions = {
            Messages_Id: '',
            Messages_ChatRoom_Id: chatRoom.current,
            Messages_Message: message.slice(0, message.length),
            Messages_User_Id: USERINFOR.User_Id,
            Messages_Type: 'text', 
            Messages_State: messages_State
        }
        
        if (e.key === 'Enter') {  
            socket.emit('client-server-sendMessage', messageOptions);
            let textarea = document.getElementById('textarea-message');
            let textarea_box = document.getElementById('MiniInboxBox-bottom');
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
            <dib className='MiniInboxBox-inbox'>
                <div>
                    <div className='MiniInboxBox-top'>
                        <div>
                            <div className='MiniInboxBox-top-name' onClick={() => hanleDisplay()}>
                                {text_name}
                            </div>
                            <div className='MiniInboxBox-top-delete' onClick={() => deleteMiniBox()}>
                                <div>X</div>
                            </div>
                        </div>
                    </div>
                    <div className='MiniInboxBox-body' id='MiniInboxBox-body' onScroll={(e) => messageScroll(e)}>
                        <div>
                            {LoadMessage}
                        </div>
                    </div>
                    <div className='MiniInboxBox-bottom' id='MiniInboxBox-bottom'>
                        <textarea id='textarea-message' type="text" maxLength={250} onKeyPress={(e) => handleMessageInput(e)}/>
                    </div>
                </div>
            </dib>
        </div>
    )
}

export default memo(MiniInboxBox);