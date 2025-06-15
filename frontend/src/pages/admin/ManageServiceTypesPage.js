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
        <div className="container mx-auto px-4 py-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <h1 className="text-3xl font-bold mb-8">Manage Service Types</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Service Type</h2>
                <AddServiceTypeForm onAddServiceType={handleAddServiceType} />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Service Types List</h2>
                <ServiceTypeList 
                    serviceTypes={serviceTypes}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteServiceType}
                />
            </div>

            {isEditModalOpen && (
                <EditServiceTypeForm
                    serviceType={selectedServiceType}
                    onUpdate={handleUpdateServiceType}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ManageServiceTypesPage;