import React from 'react';
import './styles.css';

import { useParams, useLocation } from 'react-router-dom';

import UserObj from './component/List/UserObj';
import MessageContainer from './component/MessageContainer';

const WebChat = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const { data } = state || {};

    console.log(id, data)

    const ListUser = [1,2,3,4,5,6].map((data, index) => {
        return (
            <div key={index}>
                <UserObj onData={data} />
            </div>
        )
    })

    return (
        <div className="WebChat">
            <div>
                <div className='webChat-Left'>
                    <div className='webChat-Header-top'>
                        <div>Danh sách</div>
                    </div>
                    <div className='webChat-Left-List'>
                        <div>
                            { ListUser }
                        </div>
                    </div>
                </div>
                <div className='webChat-Center'>
                    <div className='webChat-Header-top'>
                        <div>Tin nhắn</div>
                    </div>
                    <div className='webChat-Center-Message'>
                        <MessageContainer />
                    </div>
                </div>
                <div className='webChat-Right'>
                    <div className='webChat-Header-top'>
                        <div>Thông tin</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WebChat;