// src/App.tsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { fetchUsers, fetchPostsByUserId } from './services/api';
import UserProfile from './components/UserProfile';
import UserActivities from './components/UserActivities';
import SearchBar from './components/SearchBar';
import { User, Post } from './types';
import './App.css';

const UserDetail: React.FC<{ users: User[] }> = ({ users }) => {
    const { id } = useParams<{ id: string }>();

    const userId = id ? parseInt(id) : NaN; 
    const user = users.find(user => user.id === userId);

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                if (!isNaN(userId)) {
                    const postsData = await fetchPostsByUserId(userId);
                    setPosts(postsData);
                }
            } catch (err) {
                setError('Failed to fetch posts');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadPosts();
        }
    }, [userId, user]);

    if (!user) return <p>User not found</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <UserProfile user={user} />
            <UserActivities posts={posts} />
            <Link to="/">Back to Users</Link>
        </div>
    );
};

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Router>
            <h1>User Profiles</h1>
            <Routes>
                <Route path="/users/:id" element={<UserDetail users={users} />} />
                <Route 
                    path="/" 
                    element={
                        <div>
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            {filteredUsers.map(user => (
                                <Link key={user.id} to={`/users/${user.id}`} className="user-profile">
                                    <UserProfile user={user} />
                                </Link>
                            ))}
                        </div>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
