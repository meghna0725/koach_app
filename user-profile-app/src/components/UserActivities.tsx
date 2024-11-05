import React from 'react';
import { Post } from '../types';

interface UserActivitiesProps {
    posts: Post[];
}

const UserActivities: React.FC<UserActivitiesProps> = ({ posts }) => {
    return (
        <div className="user-activities">
            <h3>User Activities</h3>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <h4>{post.title}</h4>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserActivities;
