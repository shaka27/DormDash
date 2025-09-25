import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StudentLayout from './StudentLayout';

export default function StudentDashboard() {
   
    //  Get auth.user from Inertia shared props
    const { auth } = usePage().props;

    return (
        <StudentLayout>
            <Head title="Student Dashboard" />

            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-white rounded shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {auth.user?.name}!
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening in your residence today.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Occupancy Rate"
                        value="94%"
                        subtitle="326 of 347 rooms occupied"
                        icon="📊"
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        title="Upcoming Events"
                        value="8"
                        subtitle="This week"
                        icon="📅"
                        iconBg="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        title="Active Groups"
                        value="23"
                        subtitle="Student committees"
                        icon="👥"
                        iconBg="bg-purple-100"
                        iconColor="text-purple-600"
                    />
                    <StatCard
                        title="New Announcements"
                        value="3"
                        subtitle="Today"
                        icon="🔔"
                        iconBg="bg-yellow-100"
                        iconColor="text-yellow-600"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Events */}
                    <div className="bg-white rounded shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <span className="text-lg mr-3">📅</span>
                                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Don't miss these important events</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <EventItem
                                title="House Committee Meeting"
                                time="Today, 2:00 PM"
                                location="Common Room A"
                                priority="high"
                            />
                            <EventItem
                                title="Braai Day Celebration"
                                time="Tomorrow, 6:00 PM"
                                location="Residence Garden"
                                priority="medium"
                            />
                            <EventItem
                                title="Study Group - Mathematics"
                                time="Friday, 7:00 PM"
                                location="Study Hall"
                                priority="low"
                            />
                        </div>
                        <div className="px-6 pb-6">
                            <Link
                                href="/Events"
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                View all events →
                            </Link>
                        </div>
                    </div>

                    {/* Recent Announcements */}
                    <div className="bg-white rounded shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <span className="text-lg mr-3">🔔</span>
                                <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Stay updated with the latest news</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <AnnouncementItem
                                title="Water Maintenance - Building C"
                                time="2 hours ago"
                                priority="important"
                            />
                            <AnnouncementItem
                                title="New WiFi Password Available"
                                time="4 hours ago"
                                priority=""
                            />
                            <AnnouncementItem
                                title="Voting Now Open - House Captain Elections"
                                time="1 day ago"
                                priority="important"
                            />
                        </div>
                        <div className="px-6 pb-6">
                            <Link
                                href="/Notifications"
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                View all announcements →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <QuickActionButton
                            href="/RoomDetails"
                            icon="🏠"
                            title="My Room"
                            description="View room info"
                        />
                        <QuickActionButton
                            href="/VotingCentre"
                            icon="🗳️"
                            title="Vote"
                            description="Cast your vote"
                        />
                        <QuickActionButton
                            href="/Events"
                            icon="📅"
                            title="Events"
                            description="Browse events"
                        />
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

// Stats Card Component
function StatCard({ title, value, subtitle, icon, iconBg, iconColor }) {
    return (
        <div className="bg-white rounded shadow-sm p-6">
            <div className="flex items-center">
                <div className={`${iconBg} ${iconColor} p-3 rounded`}>
                    <span className="text-xl">{icon}</span>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

// Event Item Component
function EventItem({ title, time, location, priority }) {
    const priorityColors = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-purple-100 text-purple-800',
        low: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="flex items-start justify-between p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow">
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    {priority && (
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${priorityColors[priority]}`}>
                            {priority}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600">{time}</p>
                <p className="text-xs text-gray-500">{location}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                →
            </button>
        </div>
    );
}

// Announcement Item Component
function AnnouncementItem({ title, time, priority }) {
    return (
        <div className="flex items-start justify-between p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow">
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    {priority === 'important' && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Important
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500">{time}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                →
            </button>
        </div>
    );
}

// Quick Action Button Component
function QuickActionButton({ href, icon, title, description }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center p-4 border border-gray-200 rounded hover:shadow-sm hover:border-indigo-300 transition-all"
        >
            <span className="text-2xl mb-2">{icon}</span>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 text-center">{description}</p>
        </Link>
    );
}
