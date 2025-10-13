// resources/js/Pages/RoomDetails.jsx
import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function RoomDetails({ room })  {
    const { bed_number } = usePage().props;
    const roomData = room; // Do not use fallbacks per requirements

    const occupants = roomData.users;
    const maintenance = roomData.maintenance_requests ?? roomData.maintenanceRequests;

    return (
        <StudentLayout>
            <Head title="Room Details" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Room {roomData.number}</h1>
                        <p className="text-gray-600">{roomData.residence.name} • Floor {roomData.floor} • Bed {bed_number}</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-gray-300 bg-red-100 text-black rounded hover:bg-red-400 transition-colors">
                            Report Issue
                        </button>
                        <button className="px-4 py-2 border border-gray-300 bg-green-100 text-gray-700 rounded hover:bg-green-400 transition-colors">
                            Request Transfer
                        </button>
                        <Link
                            href={route('maintenance.index')}
                            className="px-4 py-2 border border-gray-300 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                        >
                            Request Maintenance
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Section title="Room Information">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Type" value={'Residence'} />
                            <InfoItem label="Residence" value={roomData.residence.name} />
                            <InfoItem label="Floor" value={roomData.floor} />
                            <InfoItem label="Bed" value={bed_number} />
                            <InfoItem label="Capacity" value={3} />
                        </div>
                    </Section>

                    {/* Roommates */}
                    <Section title="Occupants">
                        {occupants.map((u) => (
                            <div key={u.id} className="flex items-center justify-between p-4 border border-gray-200 rounded">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{u.first_name} {u.last_name}</p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                </div>
                                {u.contact_num && (
                                    <span className="text-xs text-gray-600">{u.contact_num}</span>
                                )}
                            </div>
                        ))}
                    </Section>

                    {/* Maintenance */}
                    <Section title="Maintenance History">
                        {maintenance.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.issue}</p>
                                    <p className="text-xs text-gray-500">Reported on {new Date(item.reported_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                        {item.status}
                                    </span>
                                    {item.priority && (
                                        <p className="text-xs mt-1 text-gray-600">{item.priority} priority</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Link href={route('maintenance.index')} className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                            View all maintenance requests →
                        </Link>
                    </Section>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <Section title="Amenities">
                        <ul className="space-y-2">
                            {roomData.amenities.map((amenity, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    {amenity}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="Emergency Contact">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-red-600 text-xl">🚨</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Residence Security</p>
                            <p className="text-lg font-bold text-red-600">{roomData.emergencyContact}</p>
                            <p className="text-xs text-gray-500 mt-2">Available 24/7</p>
                        </div>
                    </Section>

                    <Section title="Quick Actions">
                        <div className="space-y-2">
                            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                🔧 Report Maintenance Issue
                            </button>
                            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                                💳 View Payment History
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

// Add this to any of your components to test Bootstrap
function BootstrapTest() {
    return (
        <div className="container mt-4">
            <h2 className="text-primary">Bootstrap Test</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Test Card</h5>
                            <p className="card-text">If you can see this card properly styled, Bootstrap is working!</p>
                            <button className="btn btn-primary me-2">Primary Button</button>
                            <button className="btn btn-secondary">Secondary Button</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Success!</h4>
                        <p>This is a success alert. If it's green and styled, Bootstrap is loaded.</p>
                    </div>
                    <div className="progress mb-3">
                        <div className="progress-bar" role="progressbar" style={{width: '75%'}}>75%</div>
                    </div>
                </div>
            </div>

            {/* Badge test */}
            <div className="mb-3">
                <span className="badge bg-primary me-1">Primary</span>
                <span className="badge bg-success me-1">Success</span>
                <span className="badge bg-danger me-1">Danger</span>
            </div>

            {/* Form test */}
            <form className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="test@example.com" />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-success">Submit</button>
                </div>
            </form>
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
