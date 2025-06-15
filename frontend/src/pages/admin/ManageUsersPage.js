// frontend/src/pages/admin/ManageUsersPage.js
import React, { useState, useEffect, useCallback } from 'react';
import UserList from '../../components/admin/UserList';
import AddUserForm from '../../components/admin/AddUserForm';
import EditUserForm from '../../components/admin/EditUserForm';
import axios from '../../utils/axiosConfig';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filterUsers = useCallback(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [filterUsers]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleAddUser = async (userData) => {
        try {
            const response = await axios.post('/api/users', userData);
            setUsers([...users, response.data]);
            setIsAddModalOpen(false);
        } catch (err) {
            setError('Failed to add user');
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            const response = await axios.put(`/api/users/${userData.userId}`, userData);
            setUsers(users.map(user => 
                user.userId === userData.userId ? response.data : user
            ));
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${userId}`);
                setUsers(users.filter(user => user.userId !== userId));
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add New User
                </button>
            </div>

            <UserList
                users={filteredUsers}
                onEdit={(user) => {
                    setSelectedUser(user);
                    setIsEditModalOpen(true);
                }}
                onDelete={handleDeleteUser}
            />

            {isAddModalOpen && (
                <AddUserForm
                    onAdd={handleAddUser}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}

            {isEditModalOpen && selectedUser && (
                <EditUserForm
                    user={selectedUser}
                    onUpdate={handleUpdateUser}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
};

export default ManageUsersPage;