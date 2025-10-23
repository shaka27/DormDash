import React, { useEffect, useState } from 'react';
import { Head, Link } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function Events({ events: initialEvents, user }) {
    const [events, setEvents] = useState(initialEvents || []);
    const [rsvpedEvents, setRsvpedEvents] = useState(new Set());

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

    // Load RSVPs from localStorage on mount
    useEffect(() => {
        const savedRsvps = localStorage.getItem('student_rsvps');
        if (savedRsvps) {
            setRsvpedEvents(new Set(JSON.parse(savedRsvps)));
        }
    }, []);

    // RSVP handler - client-side only
    const handleRSVP = (eventId) => {
        const newRsvpedEvents = new Set(rsvpedEvents);
        
        if (newRsvpedEvents.has(eventId)) {
            // Un-RSVP
            newRsvpedEvents.delete(eventId);
        } else {
            // RSVP
            newRsvpedEvents.add(eventId);
        }
        
        setRsvpedEvents(newRsvpedEvents);
        
        // Save to localStorage
        localStorage.setItem('student_rsvps', JSON.stringify([...newRsvpedEvents]));
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
                    events.map(event => {
                        const hasRsvped = rsvpedEvents.has(event.id);
                        
                        return (
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

                                    {user?.role !== 'admin' && (
                                        <button
                                            onClick={() => handleRSVP(event.id)}
                                            className={`px-4 py-2 text-sm rounded transition-colors ${
                                                hasRsvped 
                                                    ? "bg-green-600 text-white hover:bg-green-700" 
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                        >
                                            {hasRsvped ? "✓ RSVPed" : "RSVP"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
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