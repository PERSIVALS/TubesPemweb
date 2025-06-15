// frontend/src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="hero is-fullheight has-background-dark has-text-light is-flex is-justify-content-center is-align-items-center">
            <div className="has-text-centered">
                <div className="loader is-loading is-size-1" style={{ width: '80px', height: '80px', border: '6px solid #8e44ad', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }}></div>
                <p className="title is-4 has-text-light mt-5">{message}</p>
            </div>
            {/* Gaya CSS langsung untuk animasi spin */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;