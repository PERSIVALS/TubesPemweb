// frontend/src/pages/UserDashboardPage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="container p-4">
            <p className="subtitle is-4 has-text-light mb-5">
                Welcome, <strong className="has-text-primary is-capitalized">{user?.name || user?.username}</strong>!
            </p>

            <div className="columns is-multiline">
                <div className="column is-one-third">
                    <div className="box has-background-dark p-5">
                        <p className="title is-4 has-text-light">My Cars</p>
                        <p className="subtitle is-6 has-text-grey-light">Manage your registered vehicles.</p>
                        <Link to="/user/my-cars" className="button is-primary is-small is-rounded">
                            View My Cars
                        </Link>
                    </div>
                </div>
                <div className="column is-one-third">
                    <div className="box has-background-dark p-5">
                        <p className="title is-4 has-text-light">Book New Service</p>
                        <p className="subtitle is-6 has-text-grey-light">Schedule a new maintenance or repair appointment.</p>
                        <Link to="/user/book-service" className="button is-success is-small is-rounded">
                            Book Now
                        </Link>
                    </div>
                </div>
                <div className="column is-one-third">
                    <div className="box has-background-dark p-5">
                        <p className="title is-4 has-text-light">My Bookings</p>
                        <p className="subtitle is-6 has-text-grey-light">View your past and upcoming service appointments.</p>
                        <Link to="/user/my-bookings" className="button is-primary is-small is-rounded">
                            View Bookings
                        </Link>
                    </div>
                </div>
            </div>

            <div className="box has-background-dark p-5 mt-5">
                <h3 className="title is-4 has-text-light">Recent Activity (Placeholder)</h3>
                <p className="has-text-grey-light">This section will show your recent service history and updates.</p>
                <ul>
                    <li className="has-text-grey-light mt-3"><span className="icon mr-2"><i className="fas fa-calendar-alt"></i></span>Last Service: <strong>[N/A]</strong></li>
                    <li className="has-text-grey-light"><span className="icon mr-2"><i className="fas fa-bell"></i></span>Notifications: <strong>[N/A]</strong></li>
                </ul>
            </div>
        </div>
    );
};

export default UserDashboardPage;