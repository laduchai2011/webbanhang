import React, { memo, useEffect, useState, useContext } from 'react';
import './styles.css';

import axios from 'axios';

import { SERVERADDRESS, TOKEN, TOKENENCODESTRING, USERINFOR } from '../../../Constant';
import { reduxStore } from '../../../redux';
import { ThemeContext } from '../../Context';

const MessageBoxHeader = ({onData}) => { 
    const [name, setName] = useState({
        First_Name: '',
        Last_Name: ''
    });
    const [messageLength, setMessageLength] = useState(onData.data.length);

    const setProps = useContext(ThemeContext);

    const handleInbox = () => {
        reduxStore.dispatch({ type: 'joinInbox', data: {chatRooms_Id_inDatabase: onData.ChatRoom_Id}});
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/chat?type=updateMessageState&userId=${USERINFOR.User_Id}&chatRoomId=${onData.ChatRoom_Id}`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${TOKEN}`
            }
        }).then(res => {
            if (res.data.state) {
                setMessageLength(0);
                setProps(pre => {
                    return {...pre, message: pre.message - messageLength}
                })
            }
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/userName?userId=${onData.Messages_User_Id}`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${TOKEN}`
            }
        }).then(res => {
            if (res.data.state) {
                let name_1 = {
                    First_Name: res.data.data.recordset[0].First_Name,                    
                    Last_Name: res.data.data.recordset[0].Last_Name
                }
                setName(name_1);
            }
        }).catch(err => {
            console.error(err);
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="MessageBoxHeader" onClick={() => handleInbox()}>
            <p className='MessageBoxHeader-text'>{`${name.First_Name} ${name.Last_Name}`}</p>
            <div>
                <div className='MessageBoxHeader-text'>Tin nhắn mới</div>
                {
                    messageLength > 0 ?
                    <div className='MessageBoxHeader-number'>
                        <div>{messageLength}</div>
                    </div>:<></>
                }
            </div>
        </div>
    )
}

export default memo(MessageBoxHeader);