// resources/js/Pages/RoomIndex.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function RoomIndex({ rooms })  {
    return (
        <StudentLayout>
            <Head title="Room Index" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">This is the room index page where all rooms will be displayed for an overview</h1>
            </div>
        </StudentLayout>
    );
}
