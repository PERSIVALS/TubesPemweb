// frontend/src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner'; // Path perbaikan: '../common/LoadingSpinner'

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Authenticating..." />;
    }

    return (
        <section className="hero is-fullheight has-background-dark">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <div className="box p-6">
                                <h2 className="title is-2 has-text-centered has-text-light mb-5">
                                    Welcome Back
                                </h2>
                                {error && (
                                    <div className="notification is-danger is-light mb-4 has-text-centered">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="field">
                                        <label className="label has-text-light">Username:</label>
                                        <div className="control">
                                            <input
                                                className="input is-medium is-dark"
                                                type="text"
                                                placeholder="Enter your username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label has-text-light">Password:</label>
                                        <div className="control">
                                            <input
                                                className="input is-medium is-dark"
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field mt-5">
                                        <div className="control">
                                            <button
                                                type="submit"
                                                className="button is-primary is-fullwidth is-medium"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <p className="has-text-centered mt-4 has-text-grey-light">
                                    Don't have an account? {' '}
                                    <Link to="/register" className="has-text-primary has-text-weight-bold">
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;