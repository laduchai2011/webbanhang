import React, { useState } from 'react';
import './styles.css';

// import { useParams, useLocation } from 'react-router-dom';
import { ThemeContext } from './Context';

import List from './component/List';
import MessageContainer from './component/MessageContainer';

const WebChat = () => {
    // const { id } = useParams();
    // const { state } = useLocation();
    // const { data } = state || {};

    const [roomId, setRoomId] = useState();

    // console.log(id, data)


    return (
        <ThemeContext.Provider value={{roomId, setRoomId}}>
            <div className="WebChat">
                <div>
                    <div className='webChat-Left'>
                        <div className='webChat-Header-top'>
                            <div>Danh sách</div>
                        </div>
                        <div className='webChat-Left-List'>
                            <div>
                                <List />
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
        </ThemeContext.Provider>
    )
}

export default WebChat;