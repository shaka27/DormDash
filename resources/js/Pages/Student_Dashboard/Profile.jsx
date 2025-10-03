// resources/js/Pages/Profile.jsx
import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function Profile({ user }) {
    const formatDate = (date) => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getStatusDisplay = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'in_progress': 'In Progress',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    };

    const getPriorityDisplay = (priority) => {
        return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
    };

    const getRoleName = () => {
        if (user.roles && user.roles.length > 0) {
            return user.roles[0].name;
        }
        return 'Resident';
    };

    return (
        <StudentLayout>
            <Head title="Resident Profile" />

            {/* Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-600">
                            {user.residence?.name || 'No Residence'} • Room {user.room?.number || 'Unassigned'}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href={route('profile.edit')}>
                            <button className="px-4 py-2 border border-gray-300 bg-indigo-100 text-gray-700 rounded hover:bg-indigo-400 transition-colors">
                                Edit Profile
                            </button>
                        </Link>

                        <button
                            onClick={() => router.post('/logout')}
                            className="px-4 py-2 border border-gray-300 bg-red-100 text-black rounded hover:bg-red-400 transition-colors"
                        >
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
                            <InfoItem label="Student ID" value={user.student_number || 'Not set'} />
                            <InfoItem label="Email" value={user.email} />
                            <InfoItem label="Phone" value={user.contact_num || 'Not set'} />
                            <InfoItem label="Role" value={getRoleName()} />
                            <InfoItem label="Move-in Date" value={formatDate(user.move_in_date)} />
                            <InfoItem label="Expected Move-out" value={formatDate(user.expected_move_out)} />
                        </div>
                    </Section>

                    {/* Maintenance Requests */}
                    <Section title="Maintenance Requests">
                        {user.maintenance_requests && user.maintenance_requests.length > 0 ? (
                            <>
                                {user.maintenance_requests.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded mb-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{item.issue}</p>
                                            <p className="text-xs text-gray-500">Reported on {formatDate(item.reported_at)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                item.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : item.status === "in_progress"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {getStatusDisplay(item.status)}
                                            </span>
                                            <p className={`text-xs mt-1 ${
                                                item.priority === "high"
                                                    ? "text-red-600"
                                                    : item.priority === "medium"
                                                    ? "text-yellow-600"
                                                    : "text-gray-600"
                                            }`}>
                                                {getPriorityDisplay(item.priority)} priority
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <Link href={route('maintenance.index')}>
                                    <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                        View all maintenance requests →
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">No maintenance requests yet.</p>
                        )}
                    </Section>
              
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Emergency Contact */}
                    <Section title="Emergency Contact">
                        {user.emergency_contact_name ? (
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-red-600 text-xl">📞</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">{user.emergency_contact_name}</p>
                                <p className="text-xs text-gray-500">{user.emergency_contact_relation || 'Contact'}</p>
                                <p className="text-lg font-bold text-red-600">{user.emergency_contact_phone}</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">No emergency contact set</p>
                                <Link href={route('profile.edit')}>
                                    <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                        Add emergency contact
                                    </button>
                                </Link>
                            </div>
                        )}
                    </Section>

                    {/* Quick Actions */}
                    <Section title="Quick Actions">
                        <div className="space-y-2">
                            <Link href={route('maintenance.create')}>
                                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                    🔧 Report Maintenance Issue
                                </button>
                            </Link>
                            <Link href={route('messages.index')}>
                                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                    💬 Send Message
                                </button>
                            </Link>
                            <Link href={route('rooms.index')}>
                                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                    🏠 View Rooms
                                </button>
                            </Link>
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
