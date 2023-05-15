import React, { memo } from 'react';
import './styles.css';

const UserObj = ({onData}) => {
    return (
        <div className="UserObj">
            <img src='https://i1.sndcdn.com/avatars-000338281488-2kmgtx-t500x500.jpg' alt='avatar'/>
            <div>
                <div>name</div>
            </div>
        </div>
    )
}

export default memo(UserObj);