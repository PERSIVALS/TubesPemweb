// frontend/src/components/layout/Navbar.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isActive, setIsActive] = useState(false);

    return (
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link to="/" className="navbar-item px-5">
                    <strong className="is-size-4 has-text-primary has-text-weight-bold">LuxuryCarService</strong>
                </Link>

                <a role="button" className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() => setIsActive(!isActive)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className="navbar-end">
                    {user ? (
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link is-capitalized has-text-light">
                                <span className="icon-text mr-2">
                                    <span className="icon"><i className="fas fa-user-circle"></i></span>
                                    <span>{user.username}</span>
                                </span>
                            </a>
                            <div className="navbar-dropdown is-boxed has-background-dark">
                                <Link to={user.role === 'admin' ? "/admin/dashboard" : "/user/dashboard"} className="navbar-item has-text-light">
                                    Dashboard
                                </Link>
                                <hr className="navbar-divider has-background-grey-darker" />
                                <a onClick={logout} className="navbar-item has-text-light">
                                    Logout
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="navbar-item">
                            <div className="buttons">
                                <Link to="/login" className="button is-primary is-rounded is-medium">
                                    <strong>Login</strong>
                                </Link>
                                <Link to="/register" className="button is-success is-rounded is-medium">
                                    <strong>Register</strong>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;