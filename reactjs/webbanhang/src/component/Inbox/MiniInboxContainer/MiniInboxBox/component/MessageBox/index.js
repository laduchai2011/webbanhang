import React, { memo } from 'react';
import './styles.css';

import { USERINFOR } from '../../../../../../utils/Constant';


const MessageBox = ({onData}) => {
    return (
        <div className="MessageBox">
            {
                onData.Messages_User_Id !== USERINFOR.User_Id ? 
                <div className='MessageBox-left'>
                    <div>
                        {onData.Messages_Message}
                    </div>
                </div>:
                <div className='MessageBox-right'>
                    <div>
                        {onData.Messages_Message}
                    </div>
                </div>
            }
        </div>
    )
}

export default memo(MessageBox);