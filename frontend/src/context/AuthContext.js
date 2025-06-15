// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Perbaikan: import { jwtDecode }
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Efek untuk memeriksa status autentikasi saat aplikasi dimuat
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Perbaikan: gunakan jwtDecode
                // Cek apakah token sudah kadaluarsa
                if (decoded.exp * 1000 < Date.now()) {
                    console.log('Token has expired, logging out.');
                    logout();
                } else {
                    // Jika tidak kadaluarsa, ambil profil user dari backend untuk memastikan data terbaru
                    fetchUser();
                }
            } catch (error) {
                console.error("Invalid token found in localStorage:", error);
                logout(); // Jika token rusak atau tidak valid, logout
            }
        } else {
            setLoading(false); // Tidak ada token, tidak perlu fetch, selesai loading
        }
    }, []);

    // Fungsi untuk mengambil detail user dari backend
    const fetchUser = async () => {
        try {
            const { data } = await axiosClient.get('/auth/me');
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user profile:", error.response?.data?.message || error.message);
            logout(); // Gagal fetch, mungkin token tidak valid di backend atau masalah jaringan
        } finally {
            setLoading(false);
        }
    };

    // Fungsi login
    const login = async (username, password) => {
        try {
            const { data } = await axiosClient.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token); // Simpan token di localStorage
            setUser(data); // Set user state dengan data dari respons login
            // Redirect berdasarkan role
            if (data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error; // Lempar error agar bisa ditangkap di komponen LoginForm
        }
    };

    // Fungsi register
    const register = async (userData) => {
        try {
            const { data } = await axiosClient.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            setUser(data); // Set user state dengan data dari respons register
            navigate('/user/dashboard'); // Arahkan ke dashboard user setelah register
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    // Fungsi logout
    const logout = () => {
        localStorage.removeItem('token'); // Hapus token dari localStorage
        setUser(null); // Kosongkan user state
        navigate('/login'); // Arahkan ke halaman login
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk memudahkan penggunaan AuthContext di komponen lain
export const useAuth = () => useContext(AuthContext);