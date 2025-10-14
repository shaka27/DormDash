import React, { useEffect, useState } from 'react';
import { Head, Link } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";
import axios from 'axios';

export default function Events({ events: initialEvents, user }) {
    const [events, setEvents] = useState(initialEvents || []);

    // Listen for new events via broadcasting
    useEffect(() => {
        const echo = window.Echo;
        if (!echo) return;

        echo.channel('events')
            .listen('EventCreated', (e) => setEvents(prev => [e.event, ...prev]))
            .listen('EventUpdated', (e) => setEvents(prev => prev.map(ev => ev.id === e.event.id ? e.event : ev)))
            .listen('EventDeleted', (e) => setEvents(prev => prev.filter(ev => ev.id !== e.eventId)));

        return () => echo.leaveChannel('events');
    }, []);

   // RSVP handler
    const handleRSVP = async (eventId) => {
        try {
            await axios.post(
                `/events/${eventId}/rsvp`,
                {}, // no need to send user_id if using auth middleware
                { withCredentials: true } // important for Laravel session
            );
            // Update the local state to mark the RSVP
            setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, rsvp: true } : ev));
        } catch (err) {
            console.error("RSVP failed", err.response?.data || err.message);
            alert("Failed to RSVP. Try again.");
        }
    };

    return (
        <StudentLayout>
            <Head title="Events" />

            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
                <p className="text-gray-600">Stay updated with residence activities and important dates</p>
            </div>

            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="bg-white rounded shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                                <p className="text-gray-600 mb-2">{event.description}</p>
                                <div className="flex text-sm text-gray-500 space-x-4">
                                    <div>🗓️ {new Date(event.date).toLocaleString()}</div>
                                    <div>📍 {event.location || "TBA"}</div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                                <Link
                                    href={`/events/${event.id}/event-details`}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-purple-300 transition-colors text-center"
                                >
                                    Details
                                </Link>

                                <button
                                    onClick={() => handleRSVP(event.id)}
                                    disabled={event.rsvp}
                                    className={`px-4 py-2 text-sm rounded ${event.rsvp ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                                >
                                    {event.rsvp ? "RSVPed" : "RSVP"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded shadow-sm p-12 text-center">
                        <span className="text-6xl mb-4 block">📅</span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Scheduled</h3>
                        <p className="text-gray-500 mb-6">There are no upcoming events at this time.</p>
                        <Link
                            href="/events/create"
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                        >
                            Create First Event
                        </Link>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
