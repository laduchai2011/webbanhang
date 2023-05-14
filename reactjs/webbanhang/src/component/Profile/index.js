import React from 'react';
import './styles.css';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { id } = useParams();

    console.log(id)
    return (
        <div className="Profile">
            Profile
        </div>
    )
}

export default Profile;