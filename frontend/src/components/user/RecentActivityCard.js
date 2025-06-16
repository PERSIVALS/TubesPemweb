// frontend/src/components/user/RecentActivityCard.js
import React from 'react';

const RecentActivityCard = ({ activities }) => {
    return (
        <div className="box has-background-dark p-5 mt-5">
            <h3 className="title is-4 has-text-light mb-4">Aktivitas Terbaru</h3>
            <p className="subtitle is-6 has-text-grey-light mb-4">
                Bagian ini menampilkan riwayat layanan dan pembaruan terbaru Anda.
            </p>

            {activities.length === 0 ? (
                <div className="notification is-info is-light">
                    Belum ada aktivitas layanan terbaru. Ayo buat booking pertama Anda!
                </div>
            ) : (
                <div className="content has-text-grey-light">
                    {activities.map((activity) => (
                        <div key={activity.bookingId} className="card has-background-dark-lighter p-4 mb-3" style={{ borderRadius: '8px' }}>
                            <div className="media">
                                <div className="media-left">
                                    <span className="icon has-text-primary">
                                        <i className="fas fa-calendar-check fa-lg"></i> {/* Ikon kalender/booking */}
                                    </span>
                                </div>
                                <div className="media-content">
                                    <p className="title is-6 has-text-light mb-1">
                                        {activity.serviceType?.name || 'Layanan Tidak Dikenal'} untuk{' '}
                                        {activity.car?.make} {activity.car?.model} ({activity.car?.licensePlate})
                                    </p>
                                    <p className="subtitle is-7 has-text-grey-light mb-1">
                                        Tanggal: {new Date(activity.bookingDate).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}{' '}
                                        Pukul: {activity.bookingTime}
                                    </p>
                                    <p className="subtitle is-7 has-text-grey-light mb-0">
                                        Status: <span className={`tag ${activity.status === 'pending' ? 'is-warning' : activity.status === 'confirmed' ? 'is-info' : activity.status === 'completed' ? 'is-success' : 'is-danger'}`}>
                                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {activity.notes && (
                                <p className="help has-text-grey-lighter mt-2">Catatan: {activity.notes}</p>
                            )}
                            <p className="is-size-7 has-text-grey-light mt-2">
                                Dibuat: {new Date(activity.createdAt).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivityCard;
