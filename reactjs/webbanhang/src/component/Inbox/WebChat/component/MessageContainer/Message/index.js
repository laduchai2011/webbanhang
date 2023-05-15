import React, { memo } from 'react';
import './styles.css';

import { USERINFOR } from '../../../../../../utils/Constant';

const Message = ({onData}) => {
    // console.log('Message', onData)
    return (
        <div className="webChat-Message">
            {
                onData.Messages_User_Id !== USERINFOR.User_Id ? 
                <div className="webChat-Message-left">
                    <div>
                        {onData.Messages_Message}
                    </div>
                </div>:
                <div className="webChat-Message-right">
                    <div>
                        <div>
                            {onData.Messages_Message}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default memo(Message);