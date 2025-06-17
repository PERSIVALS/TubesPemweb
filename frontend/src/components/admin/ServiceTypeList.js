import React from 'react';

const ServiceTypeList = ({ serviceTypes, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 font-medium text-gray-900">Name</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Description</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Price</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {serviceTypes.map((serviceType) => (
                        <tr key={serviceType.serviceTypeId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                {serviceType.name}
                            </td>
                            <td className="px-4 py-4">{serviceType.description}</td>
                            <td className="px-4 py-4 text-emerald-600 font-medium">
                                Rp. {Number(serviceType.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => onEdit(serviceType)}
                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(serviceType.serviceTypeId)}
                                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceTypeList;