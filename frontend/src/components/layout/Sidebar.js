// frontend/src/components/layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    const commonLinkClasses = (path) => `
        bd-link is-flex is-align-items-center
        is-size-5 has-text-weight-medium py-3 px-4 mb-3
        has-text-light
        ${isActive(path) ? 'has-background-primary-dark has-text-weight-bold is-active' : 'hover:has-background-grey-darker hover:has-text-primary-light'}
        is-rounded
        transition duration-300 ease-in-out
    `;

    return (
        <aside className="menu p-4 has-background-dark is-flex is-flex-direction-column" style={{ width: '280px', minHeight: '100vh', borderRight: '1px solid #363636' }}>
            <div className="mb-6">
                <p className="title is-4 has-text-light has-text-centered mb-2">LuxuryCarService</p>
                <p className="subtitle is-6 has-text-grey-light has-text-centered">
                    {user.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}
                </p>
            </div>

            <ul className="menu-list is-flex-grow-1">
                {user.role === 'admin' ? (
                    <>
                        <li><Link to="/admin/dashboard" className={commonLinkClasses("/admin/dashboard")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-tachometer-alt"></i></span> Dashboard
                        </Link></li>
                        <li><Link to="/admin/users" className={commonLinkClasses("/admin/users")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-users"></i></span> Manage Users
                        </Link></li>
                        <li><Link to="/admin/service-types" className={commonLinkClasses("/admin/service-types")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-wrench"></i></span> Service Types
                        </Link></li>
                        <li><Link to="/admin/bookings" className={commonLinkClasses("/admin/bookings")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-calendar-alt"></i></span> Manage Bookings
                        </Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/user/dashboard" className={commonLinkClasses("/user/dashboard")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-tachometer-alt"></i></span> Dashboard
                        </Link></li>
                        <li><Link to="/user/my-cars" className={commonLinkClasses("/user/my-cars")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-car"></i></span> My Cars
                        </Link></li>
                        <li><Link to="/user/book-service" className={commonLinkClasses("/user/book-service")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-plus-circle"></i></span> Book New Service
                        </Link></li>
                        <li><Link to="/user/my-bookings" className={commonLinkClasses("/user/my-bookings")}>
                            <span className="icon is-medium mr-2"><i className="fas fa-history"></i></span> My Bookings
                        </Link></li>
                    </>
                )}
            </ul>

            <div className="pt-5 mt-auto" style={{ borderTop: '1px solid #363636' }}>
                <p className="has-text-centered has-text-grey-light is-size-7 mb-3">
                    Logged in as: <strong className="has-text-light">{user.username}</strong> (<span className="is-capitalized">{user.role}</span>)
                </p>
                <button
                    onClick={logout}
                    className="button is-danger is-fullwidth is-medium is-rounded"
                >
                    <span className="icon"><i className="fas fa-sign-out-alt"></i></span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;