// frontend/src/pages/user/NewBookingPage.js
import React from 'react'; // Perbaikan: import React yang benar

const NewBookingPage = () => {
    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-light mb-4">Book New Service</h1>
            <div className="box has-background-dark p-5">
                <p className="subtitle is-5 has-text-grey-light">
                    User only. This page will provide a form to book a new service for your car.
                </p>
                <div className="content has-text-grey-light mt-4">
                    <p>Features to be implemented:</p>
                    <ul>
                        <li>Dropdown to select your registered car.</li>
                        <li>Dropdown to select the desired service type.</li>
                        <li>Date and time pickers for the appointment.</li>
                        <li>Text area for additional notes.</li>
                        <li>Confirmation and submission of the booking.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NewBookingPage;