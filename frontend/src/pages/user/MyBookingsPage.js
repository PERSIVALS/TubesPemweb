// frontend/src/pages/user/MyBookingsPage.js
import React from 'react'; // Perbaikan: import React yang benar

const MyBookingsPage = () => {
    return (
        <div className="container p-4">
            <h1 className="title is-2 has-text-light mb-4">My Bookings</h1>
            <div className="box has-background-dark p-5">
                <p className="subtitle is-5 has-text-grey-light">
                    User only. This page will display your service booking history and their statuses.
                </p>
                <div className="content has-text-grey-light mt-4">
                    <p>Features to be implemented:</p>
                    <ul>
                        <li>Table to list your past and upcoming service appointments.</li>
                        <li>View details for each booking (service type, date, time, status).</li>
                        <li>Option to cancel pending bookings.</li>
                        <li>Filter and sort your booking history.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyBookingsPage;