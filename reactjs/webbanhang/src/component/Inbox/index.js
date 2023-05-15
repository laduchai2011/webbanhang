import React from 'react';
import './styles.css';
import { useParams } from 'react-router-dom';

const Inbox = () => {
    const { id } = useParams();

    console.log(id)
    return (
        <div className="Inbox">
            Inbox
        </div>
    )
}

export default Inbox;