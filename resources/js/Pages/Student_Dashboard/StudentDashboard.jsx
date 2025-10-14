import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Head, Link, usePage } from '@inertiajs/react';
import StudentLayout from './StudentLayout';

function EventItem({ title, time, location, priority, canManage, eventId }) {
    return (
        <div className="flex items-start justify-between p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow">
            <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">{time} | {location}</p>
            </div>
            {canManage && (
                <Link
                    href={route('events.edit', eventId)}
                    className="text-indigo-600 hover:text-indigo-500 text-sm"
                >
                    Edit
                </Link>
            )}
        </div>
    );
}

function AnnouncementItemComponent({ title, time, priority }) {
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
            <button className="text-gray-400 hover:text-gray-600">→</button>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon, iconBg, iconColor }) {
    return (
        <div className="flex items-center p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow">
            <div className={`p-3 rounded-full ${iconBg} ${iconColor} text-xl`}>
                {icon}
            </div>
            <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
}

export default function StudentDashboard() {
    const { auth } = usePage().props;

    const [studentCount, setStudentCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [activeVoteCount, setActiveVoteCount] = useState(0);
    const [recentAnnouncement, setRecentAnnouncement] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const userRoles = auth.user?.roles?.map(role => role.description) || [];
    const hasRole = (roles) => roles.some(role => userRoles.includes(role));
    const isAdmin = hasRole(['Admin']);
    const isHouseParent = hasRole(['HouseParent']);
    const isHouseCommittee = hasRole(['HouseCommittee']);
    const isStudent = hasRole(['Student']);
    const hasManagementAccess = isAdmin || isHouseParent || isHouseCommittee;

    // Fetch counts and data
    useEffect(() => {
        axios.get("/api/user/count").then(res => setStudentCount(res.data.count)).catch(() => setError("Failed to fetch student count."));
        axios.get("/api/events/upcoming", { withCredentials: true }).then(res => setEvents(res.data));
        axios.get("/api/events/upcoming/count").then(res => setUpcomingCount(res.data.count));
        axios.get("/api/notifications/recent").then(res => setRecentAnnouncement(res.data.data || []));
        axios.get("/api/vote/activeVotes/count").then(res => setActiveVoteCount(res.data.count));
    }, []);

    // Listen for Laravel Echo events
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel('events');
        channel
            .listen('EventCreated', (e) => {
                setEvents(prev => [...prev, e.event]);
                setUpcomingCount(prev => prev + 1);
            })
            .listen('EventUpdated', (e) => {
                setEvents(prev => prev.map(event => event.id === e.event.id ? e.event : event));
            })
            .listen('EventDeleted', (e) => {
                setEvents(prev => prev.filter(event => event.id !== e.eventId));
                setUpcomingCount(prev => Math.max(0, prev - 1));
            });

        return () => window.Echo.leaveChannel('events');
    }, []);

    return (
        <StudentLayout>
            <Head title="Student Dashboard" />
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-white rounded shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {auth.user?.name}!</h1>
                    <p className="text-gray-600">
                        {isAdmin && "You have full administrative access to manage the residence."}
                        {isHouseParent && "You can oversee residence operations and student welfare."}
                        {isHouseCommittee && "You can help manage residence activities and student concerns."}
                        {isStudent && !hasManagementAccess && "Here's what's happening in your residence today."}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hasManagementAccess ? (
                        <>
                            <StatCard title="Total Students" value={studentCount} subtitle="Active residents" icon="👥" iconBg="bg-blue-100" iconColor="text-blue-600" />
                            <StatCard title="Pending Requests" value="12" subtitle="Maintenance & Issues" icon="⚠️" iconBg="bg-orange-100" iconColor="text-orange-600" />
                            <StatCard title="Upcoming Events" value={upcomingCount} subtitle="This week" icon="📅" iconBg="bg-green-100" iconColor="text-green-600" />
                            <StatCard title="Active Votes" value={activeVoteCount} subtitle="In progress" icon="🗳️" iconBg="bg-purple-100" iconColor="text-purple-600" />
                        </>
                    ) : (
                        <>
                            <StatCard title="Upcoming Events" value={upcomingCount} subtitle="This week" icon="📅" iconBg="bg-green-100" iconColor="text-green-600" />
                            <StatCard title="New Announcements" value={recentAnnouncement.length} subtitle="Today" icon="🔔" iconBg="bg-yellow-100" iconColor="text-yellow-600" />
                            <StatCard title="Active Votes" value={activeVoteCount} subtitle="Cast your vote" icon="🗳️" iconBg="bg-purple-100" iconColor="text-purple-600" />
                            <StatCard title="Unread Messages" value="5" subtitle="New" icon="💬" iconBg="bg-blue-100" iconColor="text-blue-600" />
                        </>
                    )}
                </div>

                {/* Events and Announcements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Events Panel */}
                    <div className="bg-white rounded shadow-sm">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-lg mr-3">📅</span>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                                    <p className="text-sm text-gray-500 mt-1">Don't miss these important events</p>
                                </div>
                            </div>
                            {hasManagementAccess && (
                                <Link href={route('events.create')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Create</Link>
                            )}
                        </div>
                        <div className="p-6 space-y-4">
                            {events.length > 0 ? events.map(event => (
                                <EventItem
                                    key={event.id}
                                    eventId={event.id}
                                    title={event.name}
                                    time={new Date(event.date).toLocaleString()}
                                    location={event.location || "TBA"}
                                    priority={event.priority || "medium"}
                                    canManage={hasManagementAccess}
                                />
                            )) : <p className="text-gray-500 text-sm">No upcoming events.</p>}
                        </div>
                        <div className="px-6 pb-6">
                            <Link href="/events" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">View all events →</Link>
                        </div>
                    </div>

                    {/* Announcements Panel */}
                    <div className="bg-white rounded shadow-sm">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-lg mr-3">📢</span>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
                                    <p className="text-sm text-gray-500 mt-1">Stay updated with the latest news</p>
                                </div>
                            </div>
                            {hasManagementAccess && (
                                <Link href={route('notifications.index')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Create</Link>
                            )}
                        </div>
                        <div className="p-6 space-y-4">
                            {recentAnnouncement.length > 0 ? recentAnnouncement.map(announcement => (
                                <AnnouncementItemComponent
                                    key={announcement.id}
                                    title={announcement.content}
                                    time={new Date(announcement.created_at).toLocaleString()}
                                    priority={announcement.type || "normal"}
                                />
                            )) : <p className="text-gray-500 text-sm">No announcements yet.</p>}
                        </div>
                        <div className="px-6 pb-6">
                            <Link href="/notifications" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">View all announcements →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
