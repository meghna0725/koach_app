import axios from 'axios';
import { User, Post } from '../types';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_URL}/users`);
    return response.data;
};

export const fetchPostsByUserId = async (userId: number): Promise<Post[]> => {
    const response = await axios.get<Post[]>(`${API_URL}/posts?userId=${userId}`);
    return response.data;
};