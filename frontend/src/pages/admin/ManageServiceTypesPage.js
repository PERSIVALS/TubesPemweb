// frontend/src/pages/admin/ManageServiceTypesPage.js
import React, { useState, useEffect } from 'react';
import ServiceTypeList from '../../components/admin/ServiceTypeList';
import AddServiceTypeForm from '../../components/admin/AddServiceTypeForm';
import EditServiceTypeForm from '../../components/admin/EditServiceTypeForm';
import axios from '../../utils/axiosConfig';

const ManageServiceTypesPage = () => {
    const [serviceTypes, setServiceTypes] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchServiceTypes();
    }, []);

    const fetchServiceTypes = async () => {
        try {
            const response = await axios.get('/api/service-types');
            setServiceTypes(response.data);
        } catch (err) {
            setError('Failed to fetch service types: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleAddServiceType = async (newServiceType) => {
        try {
            const response = await axios.post('/api/service-types', newServiceType);
            setServiceTypes(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError('Failed to add service type: ' + (err.response?.data?.message || err.message));
            throw err;
        }
    };

    const handleEditClick = (serviceType) => {
        setSelectedServiceType(serviceType);
        setIsEditModalOpen(true);
    };

    const handleUpdateServiceType = async (updatedServiceType) => {
        try {
            const response = await axios.put(
                `/api/service-types/${updatedServiceType.serviceTypeId}`,
                updatedServiceType
            );
            setServiceTypes(serviceTypes.map(st => 
                st.serviceTypeId === updatedServiceType.serviceTypeId ? response.data : st
            ));
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Failed to update service type');
        }
    };

    const handleDeleteServiceType = async (serviceTypeId) => {
        if (window.confirm('Are you sure you want to delete this service type?')) {
            try {
                await axios.delete(`/api/service-types/${serviceTypeId}`);
                setServiceTypes(serviceTypes.filter(st => st.serviceTypeId !== serviceTypeId));
            } catch (err) {
                setError('Failed to delete service type');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                        Manage Service Types
                    </span>
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Add New Service Type
                        </h2>
                        <AddServiceTypeForm onAddServiceType={handleAddServiceType} />
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                            </svg>
                            Service Types List
                        </h2>
                        <ServiceTypeList 
                            serviceTypes={serviceTypes}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteServiceType}
                        />
                    </div>
                </div>

                {isEditModalOpen && (
                    <EditServiceTypeForm
                        serviceType={selectedServiceType}
                        onUpdate={handleUpdateServiceType}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ManageServiceTypesPage;