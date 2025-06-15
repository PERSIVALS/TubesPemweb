// frontend/src/pages/AdminDashboardPage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-primary mb-4">Admin Dashboard</h1>
            <p className="subtitle is-4 has-text-light mb-5">
                Welcome, <strong className="has-text-primary is-capitalized">{user?.name || user?.username}</strong>!
            </p>

            <div className="columns is-multiline">
                <div className="column is-one-third">
                    <div className="box has-background-dark p-5">
                        <p className="title is-4 has-text-light">Manage Users</p>
                        <p className="subtitle is-6 has-text-grey-light">View, create, edit, or delete user accounts.</p>
                        <Link to="/admin/users" className="button is-primary is-small is-rounded">
                            Go to Users
                        </Link>
                    </div>
                </div>
                <div className="column is-one-third">
                    <div className="box has-background-dark p-5">
                        <p className="title is-4 has-text-light">Service Types</p>
                        <p className="subtitle is-6 has-text-grey-light">Define and manage available service categories.</p>
                        <Link to="/admin/service-types" className="button is-primary is-small is-rounded">
                            Go to Service Types
                        </Link>
                    </div>
                </div>
                <div className="column is-one-third">
                    <div className="box has-background-dark p-5">
                        <p className="title is-4 has-text-light">Manage Bookings</p>
                        <p className="subtitle is-6 has-text-grey-light">Overview and control all service appointments.</p>
                        <Link to="/admin/bookings" className="button is-primary is-small is-rounded">
                            Go to Bookings
                        </Link>
                    </div>
                </div>
            </div>

            <div className="box has-background-dark p-5 mt-5">
                <h3 className="title is-4 has-text-light">System Overview (Placeholder)</h3>
                <p className="has-text-grey-light">This section will show key metrics and recent activity for the car service app.</p>
                <ul>
                    <li className="has-text-grey-light mt-3"><span className="icon mr-2"><i className="fas fa-users"></i></span>Total Users: <strong>[N/A]</strong></li>
                    <li className="has-text-grey-light"><span className="icon mr-2"><i className="fas fa-calendar-check"></i></span>Pending Bookings: <strong>[N/A]</strong></li>
                    <li className="has-text-grey-light"><span className="icon mr-2"><i className="fas fa-money-bill-wave"></i></span>Estimated Revenue (Month): <strong>[N/A]</strong></li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboardPage;