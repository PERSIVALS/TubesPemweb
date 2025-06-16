// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Efek untuk memeriksa status autentikasi saat aplikasi dimuat
    useEffect(() => {
        const token = localStorage.getItem('token'); // Mengambil 'token'
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.log('Token has expired, logging out.');
                    logout();
                } else {
                    // Jika tidak kadaluarsa, set user dari decoded token atau fetch profil user dari backend
                    // Lebih baik fetch user untuk mendapatkan data terbaru dan lengkap
                    fetchUser();
                }
            } catch (error) {
                console.error("Invalid token found in localStorage:", error);
                logout();
            }
        } else {
            setLoading(false);
        }
    }, []);

    // Fungsi untuk mengambil detail user dari backend
    const fetchUser = async () => {
        try {
            const { data } = await axiosClient.get('/auth/me');
            setUser(data); // Set user state dengan data lengkap dari /auth/me
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
            localStorage.setItem('token', data.token); // <--- SIMPAN HANYA TOKEN DENGAN KUNCI 'token'
            // Setelah menyimpan token, langsung panggil fetchUser untuk mengisi state 'user'
            // atau Anda bisa langsung set user dari data respons jika respons login sudah lengkap
            // Untuk konsistensi, saya rekomendasikan fetchUser agar data user selalu dari endpoint /auth/me
            await fetchUser(); // Pastikan fetchUser selesai sebelum navigasi
            
            // Redirect berdasarkan role yang sudah ada di state user (setelah fetchUser)
            if (user && user.role === 'admin') { // Gunakan user state yang sudah terisi
                navigate('/admin/dashboard');
            } else if (user && user.role === 'user') {
                navigate('/user/dashboard');
            } else {
                // Fallback jika role tidak terdeteksi (meskipun seharusnya tidak terjadi)
                navigate('/');
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    // Fungsi register
    const register = async (userData) => {
        try {
            const { data } = await axiosClient.post('/auth/register', userData);
            localStorage.setItem('token', data.token); // <--- SIMPAN HANYA TOKEN DENGAN KUNCI 'token'
            // Setelah menyimpan token, langsung panggil fetchUser untuk mengisi state 'user'
            await fetchUser(); // Pastikan fetchUser selesai sebelum navigasi
            
            // Redirect setelah register
            if (user && user.role === 'user') { // User yang baru register pasti role 'user'
                navigate('/user/dashboard');
            } else {
                navigate('/'); // Fallback
            }
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

export const useAuth = () => useContext(AuthContext);
