// resources/js/Pages/RoomIndex.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function RoomIndex({ rooms })  {
    // Default rooms data if none provided
    const roomsData = rooms || [
        { id: 1, number: '101', status: 'Available', residence: { name: 'Residence A' } },
        { id: 2, number: '102', status: 'Occupied', residence: { name: 'Residence A' } },
        { id: 3, number: '103', status: 'Maintenance', residence: { name: 'Residence A' } },
    ];

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
                <h1 className="text-2xl font-semibold text-gray-900">This is the room index page where all rooms will be displayed for an overview</h1>
            </div>

            {/* Empty State */}
            {roomsData.length === 0 && (
                <div className="bg-white rounded shadow-sm p-12 text-center">
                    <span className="text-6xl mb-4 block">🏠</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Available</h3>
                    <p className="text-gray-500 mb-6">There are no rooms in the system at this time.</p>
                </div>
            )}
        </StudentLayout>
    );
}
