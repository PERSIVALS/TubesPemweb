    // frontend/src/api/axiosClient.js
    import axios from 'axios';
    import { jwtDecode } from 'jwt-decode';

    const axiosClient = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: {
            // Biarkan Axios secara otomatis mengatur Content-Type untuk FormData
        },
    });

    axiosClient.interceptors.request.use(config => {
        const token = localStorage.getItem('token');

        console.log('--- AXIOS INTERCEPTOR REQUEST ---');
        console.log('Token from localStorage:', token ? 'ADA' : 'TIDAK ADA');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.warn('Token KEDALUWARSA. Menghapus token dan membatalkan request.');
                    localStorage.removeItem('token');
                    // Tambahkan navigasi ke halaman login di sini jika Anda ingin langsung mengarahkan user
                    // window.location.href = '/login'; // Hanya contoh, AuthContext Anda sudah menangani logout
                    return Promise.reject(new Error('Token kedaluwarsa. Mohon login kembali.'));
                }
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Header Authorization berhasil ditambahkan.');
            } catch (error) {
                console.error('Gagal mendekode atau token tidak valid:', error);
                localStorage.removeItem('token');
                // window.location.href = '/login'; // Contoh: Arahkan ke login jika token rusak
                return Promise.reject(new Error('Token tidak valid. Mohon login kembali.'));
            }
        } else {
            console.log('Tidak ada token di localStorage, header Authorization TIDAK ditambahkan.');
        }
        // console.log('Final Request Config:', config); // Hati-hati, ini bisa panjang
        return config;
    }, error => {
        return Promise.reject(error);
    });

    axiosClient.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                console.error('Request tidak terotorisasi (401). Token mungkin tidak valid/hilang. Melakukan logout otomatis.');
                localStorage.removeItem('token');
                // AuthContext Anda akan menangani navigasi ke halaman login
            }
            return Promise.reject(error);
        }
    );

    export default axiosClient;
    