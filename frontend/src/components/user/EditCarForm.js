// frontend/src/components/user/EditCarForm.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../common/LoadingSpinner';

const EditCarForm = ({ carToEdit, onSuccess, onClose }) => {
    // Inisialisasi state dengan data mobil yang akan diedit
    const [make, setMake] = useState(carToEdit?.make || '');
    const [model, setModel] = useState(carToEdit?.model || '');
    const [year, setYear] = useState(carToEdit?.year || '');
    const [licensePlate, setLicensePlate] = useState(carToEdit?.licensePlate || '');
    const [color, setColor] = useState(carToEdit?.color || '');
    const [carImage, setCarImage] = useState(null); // State untuk file gambar baru
    const [imagePreview, setImagePreview] = useState(carToEdit?.imageUrl || null); // State untuk preview gambar
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mengisi form dengan data mobil yang akan diedit saat carToEdit berubah
    useEffect(() => {
        setMake(carToEdit?.make || '');
        setModel(carToEdit?.model || '');
        setYear(carToEdit?.year || '');
        setLicensePlate(carToEdit?.licensePlate || '');
        setColor(carToEdit?.color || '');
        setImagePreview(carToEdit?.imageUrl || null); // Tampilkan gambar yang sudah ada
        setCarImage(null); // Reset file yang dipilih saat beralih mobil edit
        setError(''); // Reset error
    }, [carToEdit]);

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
            // Buat preview gambar baru
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(''); // Hapus error jika ada
        } else {
            setCarImage(null);
            // Jika user menghapus pilihan file (misal klik "x" di input file),
            // kita tidak mereset imagePreview di sini agar gambar lama tetap terlihat.
            // Untuk menghapus gambar sepenuhnya, user perlu fitur "Hapus Gambar" terpisah.
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
        formData.append('year', parsedYear || '');
        formData.append('licensePlate', licensePlate);
        formData.append('color', color || '');
        
        if (carImage) { // Hanya tambahkan file jika ada yang dipilih
            formData.append('carImage', carImage);
        } else if (carToEdit?.imageUrl && imagePreview === null) {
            // Ini adalah skenario di mana user mungkin ingin menghapus gambar lama
            // Anda perlu menambahkan flag khusus ke backend untuk mengindikasikan penghapusan gambar
            // Contoh: formData.append('deleteImage', 'true');
            // Untuk saat ini, jika tidak ada gambar baru, backend akan mempertahankan yang lama.
            // Untuk benar-benar menghapus gambar, perlu tombol khusus di UI.
        }

        try {
            // Kirim PUT request ke endpoint update dengan FormData
            await axiosClient.put(`/cars/${carToEdit.carId}`, formData);
            onSuccess(); // Panggil callback sukses dari parent
        } catch (err) {
            console.error('Gagal memperbarui mobil:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Gagal memperbarui mobil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {loading && <LoadingSpinner message="Memperbarui mobil..." />}
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
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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

export default EditCarForm;
