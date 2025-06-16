// frontend/src/components/user/AddCarForm.js
import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient'; // Pastikan path ini benar
import LoadingSpinner from '../common/LoadingSpinner'; // Pastikan path ini benar

const AddCarForm = ({ onSuccess, onClose }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [color, setColor] = useState('');
    const [carImage, setCarImage] = useState(null); // State untuk file gambar
    const [imagePreview, setImagePreview] = useState(null); // State untuk preview gambar
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handler ketika file dipilih
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi tipe file (opsional, tapi disarankan)
            const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!acceptedImageTypes.includes(file.type)) {
                setError('Hanya file gambar JPG, PNG, atau GIF yang diizinkan.');
                setCarImage(null);
                setImagePreview(null);
                return;
            }
            // Validasi ukuran file (opsional, tapi disarankan)
            if (file.size > 5 * 1024 * 1024) { // 5 MB
                setError('Ukuran file gambar maksimal 5MB.');
                setCarImage(null);
                setImagePreview(null);
                return;
            }

            setCarImage(file);
            // Buat preview gambar
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(''); // Hapus error jika ada
        } else {
            setCarImage(null);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const parsedYear = year ? parseInt(year, 10) : null;
        if (year && isNaN(parsedYear)) {
            setError('Tahun harus berupa angka yang valid.');
            setLoading(false);
            return;
        }

        // Gunakan FormData untuk mengirim data teks dan file
        const formData = new FormData();
        formData.append('make', make);
        formData.append('model', model);
        formData.append('year', parsedYear || ''); // Kirim null atau string kosong jika tidak ada
        formData.append('licensePlate', licensePlate);
        formData.append('color', color || ''); // Kirim string kosong jika tidak ada
        if (carImage) {
            formData.append('carImage', carImage); // Tambahkan file gambar ke FormData
        }

        try {
            // axiosClient secara otomatis mengatur Content-Type menjadi multipart/form-data
            await axiosClient.post('/cars', formData);
            onSuccess(); // Panggil callback sukses dari parent
        } catch (err) {
            console.error('Gagal menambahkan mobil:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Gagal menambahkan mobil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {loading && <LoadingSpinner message="Menambahkan mobil..." />}
            {error && (
                <div className="notification is-danger is-light mb-4">
                    {error}
                </div>
            )}
            <div className="field">
                <label className="label has-text-light">Merk:</label>
                <div className="control">
                    <input className="input is-dark" type="text" value={make} onChange={(e) => setMake(e.target.value)} required placeholder="Merk mobil (e.g., Toyota)" />
                </div>
            </div>
            <div className="field">
                <label className="label has-text-light">Model:</label>
                <div className="control">
                    <input className="input is-dark" type="text" value={model} onChange={(e) => setModel(e.target.value)} required placeholder="Model mobil (e.g., Camry)" />
                </div>
            </div>
            <div className="field">
                <label className="label has-text-light">Tahun:</label>
                <div className="control">
                    <input className="input is-dark" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Tahun produksi (e.g., 2020)" />
                </div>
            </div>
            <div className="field">
                <label className="label has-text-light">Plat Nomor:</label>
                <div className="control">
                    <input className="input is-dark" type="text" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} required placeholder="Plat nomor (e.g., B 1234 ABC)" />
                </div>
            </div>
            <div className="field">
                <label className="label has-text-light">Warna:</label>
                <div className="control">
                    <input className="input is-dark" type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Warna mobil (e.g., Hitam)" />
                </div>
            </div>
            <div className="field">
                <label className="label has-text-light">Gambar Mobil (Opsional, Max 5MB, JPG/PNG/GIF):</label>
                <div className="control">
                    <input className="input is-dark" type="file" accept="image/jpeg, image/png, image/gif" onChange={handleImageChange} />
                </div>
                {imagePreview && (
                    <figure className="image is-96x96 mt-3">
                        <img src={imagePreview} alt="Preview" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                    </figure>
                )}
            </div>
            <div className="field is-grouped mt-5">
                <div className="control">
                    <button type="submit" className="button is-primary" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Tambah Mobil'}
                    </button>
                </div>
                <div className="control">
                    <button type="button" className="button is-light" onClick={onClose} disabled={loading}>
                        Batal
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddCarForm;
