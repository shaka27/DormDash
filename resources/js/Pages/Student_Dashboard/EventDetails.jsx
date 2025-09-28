// resources/js/Pages/Student_Dashboard/EventDetails.jsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function EventDetails({ event }) {
    if (!event) {
        return (
            <StudentLayout>
                <Head title="Event Details" />
                <div className="bg-white rounded shadow-sm p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Event not found</h3>
                    <p className="text-gray-500 mb-6">The event you are looking for does not exist.</p>
                    <Link
                        href="/Events"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    >
                        Back to Events
                    </Link>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <Head title={event.EventName} />

            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.EventName}</h1>
                <div className="flex items-center text-gray-500 text-sm space-x-6 mb-4">
                    <div className="flex items-center">
                        <span className="mr-2">🗓️</span>
                        {event.EventDate}
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        {event.EventLocation}
                    </div>
                </div>
                <p className="text-gray-700 mb-6">{event.EventDescription}</p>

                <Link
                    href="/Events"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                    Back to Events
                </Link>
            </div>
        </StudentLayout>
    );
}
