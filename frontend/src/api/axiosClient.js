// frontend/src/api/axiosClient.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Perbaikan: import { jwtDecode } dari jwt-decode

// Buat instance Axios dengan base URL dari environment variable
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan token ke setiap request yang memerlukan otorisasi
axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    if (token) {
        // Cek apakah token sudah expired sebelum mengirim request
        try {
            const decoded = jwtDecode(token); // Perbaikan: gunakan jwtDecode
            if (decoded.exp * 1000 < Date.now()) {
                // Token expired, hapus dari localStorage dan jangan sertakan
                localStorage.removeItem('token');
                // Di sini Anda bisa memicu logout atau refresh otomatis jika ada
                console.warn('Token expired, user will be logged out.');
                return Promise.reject(new Error('Token expired. Please login again.'));
            }
        } catch (error) {
            console.error('Failed to decode token or token is invalid:', error);
            localStorage.removeItem('token');
            return Promise.reject(new Error('Invalid token. Please login again.'));
        }
        config.headers.Authorization = `Bearer ${token}`; // Tambahkan header Authorization
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor untuk menangani respons error dari API
axiosClient.interceptors.response.use(
    response => response,
    error => {
        // Jika respons 401 Unauthorized, mungkin token tidak valid di backend
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized request. Token might be invalid or missing.');
            localStorage.removeItem('token'); // Hapus token
            // Arahkan user ke halaman login (AuthContext akan menangani ini)
            // Ini akan dipicu oleh AuthContext yang mendeteksi perubahan `user` menjadi null
        }
        return Promise.reject(error);
    }
);

export default axiosClient;