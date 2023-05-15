import React, { memo, useState, useMemo, useContext } from 'react';
import './styles.css';

import axios from 'axios';

import { ThemeContext } from '../../../Context';
import { SERVERADDRESS, TOKEN, TOKENENCODESTRING, USERINFOR } from '../../../../../../utils/Constant';

const UserObj = ({onData}) => {
    const {setRoomId} = useContext(ThemeContext);
    // console.log('onData', onData);
    const [name, setName] = useState({
        First_Name: '',
        Last_Name: ''
    });
    const { ChatRooms_User1_Id, ChatRooms_User2_Id, ChatRomms_Id } = onData;

    const getUser = (id) => {
        axios({
            method: 'get',
            url: `${SERVERADDRESS}/userName?userId=${id}`,
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
    }

    useMemo(() => {
        let userId;
        if (USERINFOR.User_Id === ChatRooms_User1_Id) {
            userId = ChatRooms_User2_Id;
        } else {
            userId = ChatRooms_User1_Id;
        }
        getUser(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChat = () => {
        setRoomId(ChatRomms_Id);
    }

    return (
        <div className="UserObj" onClick={() => handleChat()}>
            <img src='https://i1.sndcdn.com/avatars-000338281488-2kmgtx-t500x500.jpg' alt='avatar'/>
            <div>
                <div>{`${name.First_Name} ${name.Last_Name}`}</div>
            </div>
        </div>
    )
}

export default memo(UserObj);