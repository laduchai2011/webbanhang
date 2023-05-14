import React, { memo } from 'react';
import './styles.css';


import MessageBoxHeader from './MessageBoxHeader';


const MessageContainerHeader = ({onData}) => {

    const handleAllMessages = () => {
        alert('Tính năng sắp ra mắt');
    }

    const load_MessageBoxHeader = onData && onData.map((data, index) => {
        return (
            <div key={index}>
                <MessageBoxHeader onData={data} />
            </div>
        )
    })
    return (
        <div className="MessageContainer_Header">
            <div>
                {load_MessageBoxHeader}
            </div>
            <div className='MessageContainer_Header-allMessages' onClick={() => handleAllMessages()}>
                Xem tất cả
            </div>
        </div>
    )
}

export default memo(MessageContainerHeader);