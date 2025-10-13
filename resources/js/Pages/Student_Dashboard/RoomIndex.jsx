import React from "react";
import { Head, usePage } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function RoomIndex() {
    // Get data from Inertia props (sent from Laravel)
    const { room: assignedRoom } = usePage().props;

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
            <Head title="Your Room" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Your Room</h1>
                <p className="text-gray-600 mt-2">This is the room assigned to you.</p>
            </div>

            {/* Render only the assigned room; no fallbacks */}
            {assignedRoom && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">
                            Room {assignedRoom.number}
                        </h2>
                        <p className="text-gray-500 text-sm mb-2">
                            Residence: {assignedRoom.residence?.name || "N/A"}
                        </p>
                        <span
                            className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(assignedRoom.status)}`}
                        >
                            {assignedRoom.status}
                        </span>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
