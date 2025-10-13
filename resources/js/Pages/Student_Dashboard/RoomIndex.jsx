import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function RoomIndex() {
    // Get data from Inertia props (sent from Laravel)
    const { room: assignedRoom, bed_number } = usePage().props;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800';
            case 'Occupied': return 'bg-red-100 text-red-800';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'Reserved': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const occupants = assignedRoom ? assignedRoom.users : [];
    const maintenance = assignedRoom ? (assignedRoom.maintenance_requests ?? assignedRoom.maintenanceRequests) : [];

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString();
    };

    return (
        <StudentLayout>
            <Head title="Your Room" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Your Room</h1>
                        <p className="text-gray-600 mt-2">This is the room assigned to you.</p>
                    </div>
                    <Link
                        href={route('maintenance.index')}
                        className="inline-flex items-center px-4 py-2 rounded-md border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                    >
                        Request Maintenance
                    </Link>
                </div>
            </div>

            {/* Render only the assigned room; no fallbacks */}
            {assignedRoom && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Room Overview Card */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100 lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Room {assignedRoom.number}</h2>
                                <p className="text-gray-500 text-sm">
                                    {assignedRoom.residence.name} • {assignedRoom.residence.campus?.name}
                                </p>
                            </div>
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(assignedRoom.status)}`}>
                                {assignedRoom.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Info label="Floor" value={assignedRoom.floor} />
                            <Info label="Bed" value={bed_number} />
                            <Info label="Type" value={'Residence'} />
                            <Info label="Capacity" value={3} />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                        <Link
                            href={route('maintenance.index')}
                            className="w-full inline-flex items-center justify-center px-5 py-4 text-lg font-semibold rounded-md border border-indigo-300 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        >
                            🔧 Request Maintenance
                        </Link>
                    </div>

                    {/* Occupants */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Occupants</h3>
                        <div className="space-y-3">
                            {occupants.map((u) => (
                                <div key={u.id} className="flex items-center justify-between p-3 border rounded">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{u.first_name} {u.last_name}</p>
                                        <p className="text-xs text-gray-500">{u.email}</p>
                                    </div>
                                    {u.contact_num && (
                                        <span className="text-xs text-gray-600">{u.contact_num}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Maintenance Summary */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Maintenance</h3>
                        {maintenance && maintenance.length > 0 ? (
                            <div className="space-y-3">
                                {maintenance.slice(0, 5).map((m) => (
                                    <div key={m.id} className="flex items-center justify-between p-3 border rounded">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{m.issue}</p>
                                            <p className="text-xs text-gray-500">Reported: {formatDate(m.reported_at)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-700">{m.status}</span>
                                            {m.priority && (
                                                <p className="text-xs text-gray-500">Priority: {m.priority}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Link href={route('maintenance.index')} className="text-sm text-indigo-600 hover:text-indigo-500">View all maintenance →</Link>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">No Recent Maintenance Requests</div>
                        )}
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm text-gray-900 mt-1">{value}</p>
        </div>
    );
}
