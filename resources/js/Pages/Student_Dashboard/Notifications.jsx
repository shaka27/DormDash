// resources/js/Pages/Notifications.jsx
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function Notifications({ notifications }) {
    // Put notifications into state so we can update them
    const [data, setData] = useState(
        notifications || [
            { 
                type: "Maintenance", 
                title: "AC Maintenance Completed", 
                message: "Your maintenance request for the AC unit has been resolved.", 
                date: "2024-08-21", 
                status: "read" 
            },
            { 
                type: "Payment", 
                title: "September Payment Due", 
                message: "Your room fee of R 3,200 is due by 2025-09-01.", 
                date: "2025-08-25", 
                status: "unread" 
            },
            { 
                type: "Announcement", 
                title: "Fire Drill Scheduled", 
                message: "A fire drill will be held on 2025-09-10 at 10:00 AM.", 
                date: "2025-08-28", 
                status: "unread" 
            }
        ]
    );

    // Mark one notification as read
    const handleMarkAsRead = (index) => {
        setData((prev) =>
            prev.map((note, i) =>
                i === index ? { ...note, status: "read" } : note
            )
        );
    };

    // Mark all as read
    const handleMarkAllAsRead = () => {
        setData((prev) =>
            prev.map((note) => ({ ...note, status: "read" }))
        );
    };

    return (
        <StudentLayout>
            <Head title="Notifications" />

            {/* Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <button 
                        onClick={handleMarkAllAsRead}
                        className="px-4 py-2 border border-gray-300 bg-indigo-100 text-gray-700 rounded hover:bg-green-300 transition-colors"
                    >
                        Mark All as Read
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Stay updated with your residence announcements, payments, and maintenance alerts.
                </p>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {data.map((note, index) => (
                    <div 
                        key={index} 
                        className={`flex items-start justify-between p-4 border rounded ${
                            note.status === "unread" ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"
                        }`}
                    >
                        <div className="flex items-start">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full mr-3 ${
                                note.type === "Maintenance" ? "bg-yellow-100 text-yellow-600" :
                                note.type === "Payment" ? "bg-green-100 text-green-600" :
                                "bg-blue-100 text-blue-600"
                            }`}>
                                {note.type === "Maintenance" ? "🔧" :
                                 note.type === "Payment" ? "💳" : "📢"}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{note.title}</p>
                                <p className="text-sm text-gray-600">{note.message}</p>
                                <p className="text-xs text-gray-400 mt-1">Posted on {note.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {note.status === "unread" && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                                    New
                                </span>
                            )}
                            {note.status === "unread" && (
                                <button 
                                    onClick={() => handleMarkAsRead(index)}
                                    className="text-xs text-indigo-600 hover:text-indigo-500"
                                >
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </StudentLayout>
    );
}
