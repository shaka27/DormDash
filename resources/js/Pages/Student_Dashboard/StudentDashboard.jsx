import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Head, Link, usePage, router } from '@inertiajs/react';
import StudentLayout from './StudentLayout';

function EventItem({ event, canManage, onDelete }) {
    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        router.delete(`/events/${event.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onDelete(event.id);
            },
            onError: (errors) => {
                console.error(errors);
                alert("Failed to delete event");
            }
        });
    };

    return (
        <div className="flex flex-col p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-gray-900">{event.name}</h3>
                    <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleString()} | {event.location || "TBA"}
                    </p>
                </div>
                {canManage && (
                    <div className="flex space-x-2">
                        <Link
                            href={`/events/${event.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-500 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            {event.description && (
                <p className="mt-2 text-gray-700 text-sm">{event.description}</p>
            )}
            {event.rsvp !== undefined && (
                <p className="mt-1 text-xs text-gray-500">
                    {event.rsvp ? "✓ You are attending" : "You have not RSVP'd"}
                </p>
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
    const [pendingRequestCount, setPendingRequestCount] = useState(0);
    const [recentAnnouncement, setRecentAnnouncement] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0); // added
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const userRoles = auth.user?.roles?.map(role => role.description) || [];
    const hasRole = (roles) => roles.some(role => userRoles.includes(role));
    const isAdmin = hasRole(['Admin']);
    const isHouseParent = hasRole(['HouseParent']);
    const isHouseCommittee = hasRole(['HouseCommittee']);
    const isStudent = hasRole(['Student']);
    const hasManagementAccess = isAdmin || isHouseParent || isHouseCommittee;

    // Fetch counts and data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    studentRes,
                    eventsRes,
                    upcomingRes,
                    notificationsRes,
                    votesRes,
                    maintenanceRes
                ] = await Promise.all([
                    axios.get("/api/user/count"),
                    axios.get("/api/events/upcoming", { withCredentials: true }),
                    axios.get("/api/events/upcoming/count"),
                    axios.get("/api/notifications/recent"), // keep existing call
                    axios.get("/api/vote/activeVotes/count"),
                    axios.get("/api/maintenance_requests/pendingRequest/count")
                ]);

                setStudentCount(studentRes.data.count);
                setEvents(eventsRes.data);
                setUpcomingCount(upcomingRes.data.count);

                // support multiple response shapes (notifications endpoint may return { notifications: [...] } or { data: [...] })
                const notifs = notificationsRes.data.notifications ?? notificationsRes.data.data ?? notificationsRes.data ?? [];
                setRecentAnnouncement(notifs);

                // try to fetch unread/count - prefer API route then fallback to non-API route
                try {
                    const countRes = await axios.get('/api/notifications/count');
                    setNotificationCount(countRes.data.count ?? 0);
                } catch (e) {
                    try {
                        const countRes2 = await axios.get('/notifications/count');
                        setNotificationCount(countRes2.data.count ?? 0);
                    } catch (e2) {
                        // fallback to length of recent announcements if count endpoint not available
                        setNotificationCount(Array.isArray(notifs) ? notifs.length : 0);
                    }
                }

                setActiveVoteCount(votesRes.data.count);
                setPendingRequestCount(maintenanceRes.data.count);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data");
            }
        };

        fetchData();
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

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hasManagementAccess ? (
                        <>
                            <StatCard title="Total Students" value={studentCount} subtitle="Active residents" icon="👥" iconBg="bg-blue-100" iconColor="text-blue-600" />
                            <StatCard title="Pending Requests" value={pendingRequestCount} subtitle="Maintenance & Issues" icon="⚠️" iconBg="bg-orange-100" iconColor="text-orange-600" />
                            <StatCard title="Upcoming Events" value={upcomingCount} subtitle="This week" icon="📅" iconBg="bg-green-100" iconColor="text-green-600" />
                            <StatCard title="Active Votes" value={activeVoteCount} subtitle="In progress" icon="🗳️" iconBg="bg-purple-100" iconColor="text-purple-600" />
                            {/* show notifications count for admins as well */}
                            <StatCard title="New Announcements" value={notificationCount} subtitle="Today" icon="🔔" iconBg="bg-yellow-100" iconColor="text-yellow-600" />
                        </>
                    ) : (
                        <>
                            <StatCard title="Upcoming Events" value={upcomingCount} subtitle="This week" icon="📅" iconBg="bg-green-100" iconColor="text-green-600" />
                            <StatCard title="New Announcements" value={notificationCount} subtitle="Today" icon="🔔" iconBg="bg-yellow-100" iconColor="text-yellow-600" />
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
                                    event={event}
                                    canManage={hasManagementAccess}
                                    onDelete={(id) => setEvents(prev => prev.filter(e => e.id !== id))}
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