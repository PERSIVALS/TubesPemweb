// frontend/src/components/user/MyCarsList.js
import React from 'react';

const MyCarsList = ({ cars, onEdit, onDelete }) => {
    // Placeholder image jika tidak ada gambar
    const placeholderImage = "https://placehold.co/100x70/282828/ffffff?text=No+Image";

    if (cars.length === 0) {
        return (
            <div className="notification is-info is-light">
                Anda belum mendaftarkan mobil. Klik "Tambahkan Mobil Baru" untuk memulai!
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable has-background-dark has-text-light">
                <thead>
                    <tr>
                        <th>Gambar</th> {/* Kolom baru untuk gambar */}
                        <th><abbr title="Manufacture">Merk</abbr></th>
                        <th>Model</th>
                        <th>Tahun</th>
                        <th>Plat Nomor</th>
                        <th>Warna</th>
                        <th className="has-text-centered">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car.carId}>
                            <td>
                                <figure className="image is-64x64">
                                    <img 
                                        src={car.imageUrl || placeholderImage} 
                                        alt={`${car.make} ${car.model}`} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} // Fallback jika gambar gagal dimuat
                                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </figure>
                            </td>
                            <td className="has-text-light">{car.make}</td>
                            <td className="has-text-light">{car.model}</td>
                            <td className="has-text-light">{car.year || 'N/A'}</td>
                            <td className="has-text-light">{car.licensePlate}</td>
                            <td className="has-text-light">{car.color || 'N/A'}</td>
                            <td className="has-text-centered is-nowrap">
                                <button
                                    className="button is-info is-small mr-2"
                                    onClick={() => onEdit(car)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button is-danger is-small"
                                    onClick={() => onDelete(car.carId)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyCarsList;
