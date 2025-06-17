import React, { useState } from 'react';

const AddServiceTypeForm = ({ onAddServiceType }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (!formData.name || !formData.price) {
                setError('Name and price are required');
                return;
            }

            await onAddServiceType({
                ...formData,
                price: Number(formData.price)
            });

            // Reset form after successful submission
            setFormData({
                name: '',
                description: '',
                price: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding service type');
        }
    };

return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}
        
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Service Name *
            </label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 text-black focus:ring-blue-500 sm:text-sm"
                placeholder="Enter service name"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">
                Description
            </label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 text-black focus:ring-blue-500 sm:text-sm"
                placeholder="Enter service description"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">
                Price *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <span className="text-black sm:text-sm">Rp </span>
                </div>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="block w-full pl-7 pr-12 text-black rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="0.00"
                />
            </div>
        </div>

        <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
            Add Service Type
        </button>
    </form>
);
};

export default AddServiceTypeForm;