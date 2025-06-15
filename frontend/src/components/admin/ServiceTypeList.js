import React from 'react';

const ServiceTypeList = ({ serviceTypes, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {serviceTypes.map((serviceType) => (
                        <tr key={serviceType.serviceTypeId}>
                            <td className="px-6 py-4">{serviceType.name}</td>
                            <td className="px-6 py-4">{serviceType.description}</td>
                            <td className="px-6 py-4">
                                ${Number(serviceType.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onEdit(serviceType)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(serviceType.serviceTypeId)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceTypeList;