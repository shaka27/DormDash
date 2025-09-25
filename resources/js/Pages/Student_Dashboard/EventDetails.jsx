// resources/js/Pages/Events.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function EventDetails({ event }) {

    return (
        <StudentLayout>
            <Head title="Events" />
            
            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
                        <p className="text-gray-600">View and manage event details</p>
                    </div>
                </div>
            </div>
        </StudentLayout>
        
    );

 
}