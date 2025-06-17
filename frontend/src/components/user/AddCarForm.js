// filepath: d:\KULIAH INFORMATIKA\Semester 4\pemweb jut\Tubes\my-car-service-app\frontend\src\components\user\AddCarForm.js
import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';

const AddCarForm = ({ onSuccess, onClose }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [color, setColor] = useState('');
    const [carImage, setCarImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handler for file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!acceptedImageTypes.includes(file.type)) {
                setError('Hanya file gambar JPG, PNG, atau GIF yang diizinkan.');
                setCarImage(null);
                setImagePreview(null);
                return;
            }
            // Validate file size
            if (file.size > 5 * 1024 * 1024) { // 5 MB
                setError('Ukuran file gambar maksimal 5MB.');
                setCarImage(null);
                setImagePreview(null);
                return;
            }

            setCarImage(file);
            // Create image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
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

        // Use FormData to send text data and files
        const formData = new FormData();
        formData.append('make', make);
        formData.append('model', model);
        formData.append('year', parsedYear || '');
        formData.append('licensePlate', licensePlate);
        formData.append('color', color || '');
        if (carImage) {
            formData.append('carImage', carImage);
        }

        try {
            await axiosClient.post('/cars', formData);
            onSuccess();
        } catch (err) {
            console.error('Gagal menambahkan mobil:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Gagal menambahkan mobil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-black mb-1">Merk</label>
                    <input 
                        type="text" 
                        value={make} 
                        onChange={(e) => setMake(e.target.value)} 
                        required 
                        placeholder="Contoh: Toyota" 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black mb-1">Model</label>
                    <input 
                        type="text" 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)} 
                        required 
                        placeholder="Contoh: Camry" 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-black mb-1">Tahun</label>
                    <input 
                        type="number" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        placeholder="Contoh: 2020" 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black mb-1">Plat Nomor</label>
                    <input 
                        type="text" 
                        value={licensePlate} 
                        onChange={(e) => setLicensePlate(e.target.value)} 
                        required 
                        placeholder="Contoh: B 1234 ABC" 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black mb-1">Warna</label>
                    <input 
                        type="text" 
                        value={color} 
                        onChange={(e) => setColor(e.target.value)} 
                        placeholder="Contoh: Hitam" 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-1">
                    Gambar Mobil <span className="text-gray-500 font-normal">(Opsional, Max 5MB, JPG/PNG/GIF)</span>
                </label>
                <div className="mt-1 flex items-center">
                    <div className={`flex justify-center p-6 border-2 border-dashed rounded-md w-full ${imagePreview ? 'border-gray-300' : 'border-gray-300 hover:border-gray-400'}`}>
                        {imagePreview ? (
                            <div className="relative">
                                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-md" />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                                    onClick={() => {
                                        setCarImage(null);
                                        setImagePreview(null);
                                    }}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-1 text-sm text-gray-500">Klik untuk memilih gambar</p>
                            </div>
                        )}
                        <input
                            id="car-image"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <label htmlFor="car-image" className="cursor-pointer mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
                </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambah Mobil
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddCarForm;
