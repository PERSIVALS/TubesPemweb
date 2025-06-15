// frontend/src/pages/user/MyCarsPage.js
import React from 'react'; // Perbaikan: import React yang benar

const MyCarsPage = () => {
    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-light mb-4">My Cars</h1>
            <div className="box has-background-dark p-5">
                <p className="subtitle is-5 has-text-grey-light">
                    User only. This page will display a list of your registered cars and allow you to add or manage them.
                </p>
                <div className="content has-text-grey-light mt-4">
                    <p>Features to be implemented:</p>
                    <ul>
                        <li>Table to list your registered cars.</li>
                        <li>Form to add a new car to your profile.</li>
                        <li>Option to edit details of an existing car.</li>
                        <li>Functionality to delete a car from your profile.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyCarsPage;