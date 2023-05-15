import React, { memo } from 'react';
import './styles.css';


const Message = () => {
    const bool = false;
    return (
        <div className="webChat-Message">
            {
                bool ? 
                <div className="webChat-Message-left">
                    Messagesdfsdnfkihsdfjhgksjdhfgijkhsdjkghsdjkghjksdbjkgbsdjkgbjhsdbghjsdbhjhgfhsdjhghjksdhgfjkshgdhjghsdhjghsdbhjghsjdghjsdfhjgsdbhfkjhsbdjkf
                </div>:
                <div className="webChat-Message-right">
                    <div>
                        Messagesdfsdnfkihsdfjhgksjdhfgijkhsdjkghsdjkghjksdbjkgbsdjkgbjhsdbghjsdbhjhgfhsdjhghjksdhgfjkshgdhjghsdhjghsdbhjghsjdghjsdfhjgsdbhfkjhsbdjkf
                    </div>
                </div>
            }
        </div>
    )
}

export default memo(Message);