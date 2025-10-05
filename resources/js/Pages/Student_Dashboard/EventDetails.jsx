import React from "react";
import { Head, Link } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function EventDetails({ event }) {
    if (!event) {
        return (
            <StudentLayout>
                <Head title="Event Details" />
                <div className="bg-white rounded shadow-sm p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Event not found
                    </h3>
                    <p className="text-gray-500 mb-6">
                        The event you are looking for does not exist.
                    </p>
                    <Link
                        href="/events"
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
            <Head title={event.name} />

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 mt-8 border border-gray-200">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {event.name}
                </h1>

                {/* Info Row */}
                <div className="flex flex-wrap items-center text-gray-500 text-sm space-x-6 mb-6">
                    <div className="flex items-center">
                        <span className="mr-2 text-lg">🗓️</span>
                        <span className="font-medium text-gray-800">
                            {event.date}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2 text-lg">📍</span>
                        <span className="font-medium text-gray-800">
                            {event.location}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="text-gray-700 leading-relaxed mb-8">
                    {event.description}
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <Link
                        href="/events"
                        className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        ← Back to Events
                    </Link>
                </div>
            </div>
        </StudentLayout>
    );
}
