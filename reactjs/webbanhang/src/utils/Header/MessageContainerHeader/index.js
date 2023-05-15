import React, { memo } from 'react';
import './styles.css';

import { useNavigate } from 'react-router-dom';

import MessageBoxHeader from './MessageBoxHeader';
import { USERINFOR } from '../../Constant';


const MessageContainerHeader = ({onData}) => {

    const navigate = useNavigate();

    const handleAllMessages = () => {
        // navigate(`/webChat`, { state: {data: 'webchat123456'}});
        navigate(`/webChat/${USERINFOR.User_Id}`, { state: {data: 'webchat123456'}});
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