// resources/js/Pages/Events.jsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function Events({ events }) {
    // Default events data if none provided
    const eventsData = events || [
        {
            EventName: "House Committee Meeting",
            EventDescription: "Monthly meeting to discuss residence matters and upcoming events.",
            EventDate: "2024-09-02",
            EventLocation: "Common Room A"
        },
        {
            EventName: "Braai Day Celebration",
            EventDescription: "Join us for a traditional South African braai with music and games.",
            EventDate: "2024-09-05",
            EventLocation: "Residence Garden"
        },
        {
            EventName: "Study Group - Mathematics",
            EventDescription: "Weekly study session for first-year mathematics students.",
            EventDate: "2024-09-06",
            EventLocation: "Study Hall"
        }
    ];

    return (
        <StudentLayout>
            <Head title="Events" />
            
            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
                        <p className="text-gray-600">Stay updated with residence activities and important dates</p>
                    </div>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {eventsData.map((event, index) => (
                    <div key={index} className="bg-white rounded shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-3">📅</span>
                                    <h3 className="text-lg font-semibold text-gray-900">{event.EventName}</h3>
                                </div>
                                <p className="text-gray-600 mb-3">{event.EventDescription}</p>
                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <div className="flex items-center">
                                        <span className="mr-1">🗓️</span>
                                        {event.EventDate}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">📍</span>
                                        {event.EventLocation}
                                    </div>
                                </div>
                            </div>

                            {/* Details Button */}
                            <div className="flex flex-col space-y-2 ml-4">
                                <Link
                                    href={`/EventDetails/${index}`} // Pass the index to the details page
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-purple-300 transition-colors text-center"
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {eventsData.length === 0 && (
                <div className="bg-white rounded shadow-sm p-12 text-center">
                    <span className="text-6xl mb-4 block">📅</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Scheduled</h3>
                    <p className="text-gray-500 mb-6">There are no upcoming events at this time.</p>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                        Create First Event
                    </button>
                </div>
            )}
        </StudentLayout>
    );
}
