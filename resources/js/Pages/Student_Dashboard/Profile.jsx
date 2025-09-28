// resources/js/Pages/Profile.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function Profile({ resident }) {
    const profileData = resident || {
        name: "Evan Titus",
        studentId: "20251234",
        email: "evan.titus@university.edu",
        phone: "+27 82 123 4567",
        residence: "North Residence",
        roomNumber: "204B",
        floor: "2nd Floor",
        role: "Resident",
        keyCard: "Active",
        moveInDate: "2024-02-01",
        expectedMoveOut: "2024-11-30",
        emergencyContact: {
            name: "John Titus",
            relation: "Father",
            phone: "+27 72 456 7890"
        },
        maintenanceRequests: [
            { issue: "Leaky faucet", status: "In Progress", date: "2024-08-25", priority: "medium" },
            { issue: "Broken chair", status: "Completed", date: "2024-08-20", priority: "low" }
        ],
        payments: [
            { month: "August 2024", amount: "R 3,200", status: "Paid" },
            { month: "September 2024", amount: "R 3,200", status: "Pending" }
        ]
    };

    return (
        <StudentLayout>
            <Head title="Resident Profile" />

            {/* Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                        <p className="text-gray-600">{profileData.residence} • Room {profileData.roomNumber}</p>
                    </div>
                    <div className="flex space-x-3">
                    <a href="/EditProfile">
                        <button className="px-4 py-2 border border-gray-300 bg-indigo-100 text-gray-700 rounded hover:bg-indigo-400 transition-colors">
                            Edit Profile
                        </button>
                        </a>

                        <button className="px-4 py-2 border border-gray-300 bg-red-100 text-black rounded hover:bg-red-400 transition-colors">
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <Section title="Personal Information">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Student ID" value={profileData.studentId} />
                            <InfoItem label="Email" value={profileData.email} />
                            <InfoItem label="Phone" value={profileData.phone} />
                            <InfoItem label="Role" value={profileData.role} />
                            
                        </div>
                    </Section>

                    {/* Maintenance Requests */}
                    <Section title="Maintenance Requests">
                        {profileData.maintenanceRequests.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.issue}</p>
                                    <p className="text-xs text-gray-500">Reported on {item.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                        item.status === "Completed"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {item.status}
                                    </span>
                                    <p className={`text-xs mt-1 ${
                                        item.priority === "high"
                                            ? "text-red-600"
                                            : item.priority === "medium"
                                            ? "text-yellow-600"
                                            : "text-gray-600"
                                    }`}>
                                        {item.priority} priority
                                    </p>
                                </div>
                            </div>
                        ))}
                        <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                            View all maintenance requests →
                        </button>
                    </Section>
              
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Emergency Contact */}
                    <Section title="Emergency Contact">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-red-600 text-xl">📞</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">{profileData.emergencyContact.name}</p>
                            <p className="text-xs text-gray-500">{profileData.emergencyContact.relation}</p>
                            <p className="text-lg font-bold text-red-600">{profileData.emergencyContact.phone}</p>
                        </div>
                    </Section>

                    {/* Quick Actions */}
                    <Section title="Quick Actions">
                        <div className="space-y-2">
                            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                🔧 Report Maintenance Issue
                            </button>
                            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                📋 Request Room Transfer
                            </button>
                            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                🔑 Request Spare Key
                            </button>
                        </div>
                    </Section>
                </div>
            </div>
        </StudentLayout>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
            {children}
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-sm text-gray-900 mt-1">{value}</p>
        </div>
    );
}
