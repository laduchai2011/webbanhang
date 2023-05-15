import React, { memo, useContext } from 'react';
import './styles.css';

import { ThemeContext } from '../../Context';
import UserObj from './UserObj';

const List = () => {
    const theme = useContext(ThemeContext);
    console.log(theme)
    
    // get all rooms
    const getRooms = (callback) => {
        let err;
        let data;
        axios({ 
            method: 'get',
            url: `${SERVERADDRESS}/chat?type=getChatRooms&userId=${USERINFOR.User_Id}`,
            headers: {
                Authorization: `${TOKENENCODESTRING} ${TOKEN}`
            }
        }).then(function (res) {
            if (res.data.data) {
                data = res.data.data.recordset;
            }
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    const ListUser = [1,2,3,4,5,6].map((data, index) => {
        return (
            <div key={index}>
                <UserObj onData={data} />
            </div>
        )
    })
    return (
        <div className="webChat-List">
            { ListUser }
        </div>
    )
}

export default memo(List);