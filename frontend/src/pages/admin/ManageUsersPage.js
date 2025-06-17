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
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [userStats, setUserStats] = useState({
        total: 0,
        admin: 0,
        user: 0
    });

    const filterUsers = useCallback(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const calculateUserStats = useCallback(() => {
        const stats = {
            total: users.length,
            admin: users.filter(user => user.role === 'admin').length,
            user: users.filter(user => user.role === 'user').length
        };
        setUserStats(stats);
    }, [users]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
        calculateUserStats();
    }, [filterUsers, calculateUserStats]);

    const fetchUsers = async () => {
        try {
            setIsRefreshing(true);
            const response = await axios.get('/api/users');
            setUsers(response.data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleAddUser = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users', userData);
            setUsers([...users, response.data]);
            setIsAddModalOpen(false);
            setError(null);
        } catch (err) {
            setError('Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/users/${userData.userId}`, userData);
            setUsers(users.map(user => 
                user.userId === userData.userId ? response.data : user
            ));
            setIsEditModalOpen(false);
            setError(null);
        } catch (err) {
            setError('Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setLoading(true);
                await axios.delete(`/api/users/${userId}`);
                setUsers(users.filter(user => user.userId !== userId));
                setError(null);
            } catch (err) {
                setError('Failed to delete user');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with animation */}
                <div className="relative mb-8">
                    <h1 className="text-4xl font-extrabold text-black mb-2 transition-all duration-300 ease-in-out transform hover:scale-105">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                            Manage Users
                        </span>
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded"></div>
                </div>

                {/* Error notification */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md flex items-center">
                        <svg className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-black">{error}</p>
                        <button 
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
                        <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Users</p>
                            <p className="text-3xl font-bold text-black">{userStats.total}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Regular Users</p>
                            <p className="text-3xl font-bold text-black">{userStats.user}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Administrators</p>
                            <p className="text-3xl font-bold text-black">{userStats.admin}</p>
                        </div>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
                    <div className="relative md:w-1/3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={fetchUsers}
                            disabled={isRefreshing}
                            className={`flex items-center px-4 py-2.5 text-black bg-gray-100 border border-gray-200 rounded-lg transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm ${isRefreshing ? 'opacity-75' : ''}`}
                        >
                            <svg 
                                className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New User
                        </button>
                    </div>
                </div>

                {/* User List */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-black flex items-center">
                                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                User List
                            </h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                            </span>
                        </div>
                    </div>

                    {loading && users.length === 0 ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-xl font-medium text-black">No users found</h3>
                            <p className="mt-1 text-gray-500">Try adjusting your search criteria or add a new user.</p>
                        </div>
                    ) : (
                        <UserList
                            users={filteredUsers}
                            onEdit={(user) => {
                                setSelectedUser(user);
                                setIsEditModalOpen(true);
                            }}
                            onDelete={handleDeleteUser}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
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