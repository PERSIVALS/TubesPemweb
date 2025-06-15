// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar'; // Path perbaikan: '../components/layout/Navbar'
import LoadingSpinner from '../components/common/LoadingSpinner'; // Path perbaikan: '../components/common/LoadingSpinner'

const HomePage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    if (user) {
        return (
            <div className="is-flex is-flex-direction-column" style={{ minHeight: '100vh' }}>
                <Navbar />
                <section className="hero is-fullheight-with-navbar has-background-dark has-text-light">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <h1 className="title is-1 has-text-primary has-text-weight-bold mb-4">
                                Welcome Back, <span className="is-capitalized">{user.name || user.username}</span>!
                            </h1>
                            <p className="subtitle is-4 has-text-grey-light mb-5">
                                You are currently logged in as a <strong className="has-text-primary is-capitalized">{user.role}</strong>.
                                Continue managing your luxury car service experience.
                            </p>
                            {user.role === 'admin' ? (
                                <Link to="/admin/dashboard" className="button is-primary is-large is-rounded">
                                    <span className="icon is-medium"><i className="fas fa-tools"></i></span>
                                    <span>Go to Admin Dashboard</span>
                                </Link>
                            ) : (
                                <Link to="/user/dashboard" className="button is-primary is-large is-rounded">
                                    <span className="icon is-medium"><i className="fas fa-car-side"></i></span>
                                    <span>Go to My Dashboard</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="is-flex is-flex-direction-column" style={{ minHeight: '100vh' }}>
            <Navbar />
            <section className="hero is-fullheight-with-navbar has-background-dark has-text-light">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title is-1 has-text-primary has-text-weight-bold mb-4">
                            Luxury Car Service
                        </h1>
                        <p className="subtitle is-4 has-text-grey-light mb-6">
                            Experience unparalleled automotive care. From routine maintenance to intricate repairs,
                            we ensure your vehicle performs at its peak.
                        </p>
                        <div className="buttons is-centered">
                            <Link to="/login" className="button is-primary is-large is-rounded">
                                <span className="icon"><i className="fas fa-sign-in-alt"></i></span>
                                <span>Login</span>
                            </Link>
                            <Link to="/register" className="button is-success is-large is-rounded">
                                <span className="icon"><i className="fas fa-user-plus"></i></span>
                                <span>Register</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;