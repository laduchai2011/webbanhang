import React, { memo } from 'react';
import './styles.css';

import { AiOutlineSend } from 'react-icons/ai';

import Message from './Message';


const MessageContainer = () => {

    const LoadMessage = [1,2,3,4].map((data, index) => {
        return (
            <div key={index}>
                <Message />
            </div>
        )
    })

    return (
        <div className="webChat-MessageContainer">
            <div className='webChat-MessageContainer-Message'>
                {LoadMessage}
            </div>

            <div className='webChat-MessageContainer-Input'>
                <textarea rows={2}/>
                <div className='webChat-MessageContainer-Input-SendIcon'>
                    <div>
                        <AiOutlineSend size={30} color='blue' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(MessageContainer);