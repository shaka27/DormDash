import React from "react";
import { Head, usePage } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function RoomIndex() {
    // Get data from Inertia props (sent from Laravel)
    const { rooms } = usePage().props;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800';
            case 'Occupied': return 'bg-red-100 text-red-800';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'Reserved': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <StudentLayout>
            <Head title="Room Index" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Residence Room Overview
                </h1>
                <p className="text-gray-600 mt-2">
                    View all rooms and their current status below.
                </p>
            </div>

            {/* If no rooms exist */}
            {(!rooms || rooms.length === 0) && (
                <div className="bg-white rounded shadow-sm p-12 text-center">
                    <span className="text-6xl mb-4 block">🏠</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Available</h3>
                    <p className="text-gray-500 mb-6">There are no rooms in the system at this time.</p>
                </div>
            )}

            {/* If rooms exist */}
            {rooms && rooms.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">
                                Room {room.number}
                            </h2>
                            <p className="text-gray-500 text-sm mb-2">
                                Residence: {room.residence?.name || "N/A"}
                            </p>
                            <span
                                className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(room.status)}`}
                            >
                                {room.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}