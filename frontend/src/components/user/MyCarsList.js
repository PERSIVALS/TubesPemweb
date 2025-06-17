// frontend/src/components/user/MyCarsList.js
import React from 'react';

const MyCarsList = ({ cars, onEdit, onDelete }) => {
     // Placeholder image if no image is available
    const placeholderImage = "https://placehold.co/300x200/e2e8f0/64748b?text=No+Image";

    if (cars.length === 0) {
        return (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 rounded-lg shadow-md mb-6">
                <div className="flex items-center">
                    <svg className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">Anda belum mendaftarkan mobil. Klik "Tambahkan Mobil Baru" untuk memulai!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
                <div key={car.carId} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-48 bg-gray-200">
                        <img
                            src={car.imageUrl || placeholderImage}
                            alt={`${car.make} ${car.model}`}
                            onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {car.year || 'N/A'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{car.make} {car.model}</h3>
                                <div className="text-sm text-gray-600 mb-3">
                                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 font-medium">
                                        {car.licensePlate}
                                    </span>
                                    {car.color && (
                                        <span className="inline-block ml-2">
                                            <span 
                                                className="inline-block w-3 h-3 rounded-full mr-1" 
                                                style={{
                                                    backgroundColor: car.color.toLowerCase(),
                                                    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                                                }}
                                            ></span>
                                            {car.color}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                            <button
                                onClick={() => onEdit(car)}
                                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(car.carId)}
                                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyCarsList;
