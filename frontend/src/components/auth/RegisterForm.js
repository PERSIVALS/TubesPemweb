// frontend/src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner'; // Path perbaikan: '../common/LoadingSpinner'

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const { register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register({ username, email, password, name, phone });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Registering account..." />;
    }

    return (
        <section className="hero is-fullheight has-background-dark">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5">
                            <div className="box p-6">
                                <h2 className="title is-2 has-text-centered has-text-light mb-5">
                                    Create Account
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
                                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="input is-medium is-dark" placeholder="Choose a username" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label has-text-light">Email:</label>
                                        <div className="control">
                                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input is-medium is-dark" placeholder="Enter your email" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label has-text-light">Password:</label>
                                        <div className="control">
                                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input is-medium is-dark" placeholder="Choose a strong password" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label has-text-light">Confirm Password:</label>
                                        <div className="control">
                                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input is-medium is-dark" placeholder="Confirm your password" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label has-text-light">Full Name (Optional):</label>
                                        <div className="control">
                                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="input is-medium is-dark" placeholder="Your full name" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label has-text-light">Phone Number (Optional):</label>
                                        <div className="control">
                                            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input is-medium is-dark" placeholder="Your phone number" />
                                        </div>
                                    </div>
                                    <div className="field mt-5">
                                        <div className="control">
                                            <button type="submit" className="button is-success is-fullwidth is-medium">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <p className="has-text-centered mt-4 has-text-grey-light">
                                    Already have an account? {' '}
                                    <Link to="/login" className="has-text-primary has-text-weight-bold">
                                        Login here
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

export default RegisterForm;