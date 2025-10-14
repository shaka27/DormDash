import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Head, Link, usePage } from '@inertiajs/react';
import StudentLayout from './StudentLayout';

export default function StudentDashboard() {
    // Get auth.user from Inertia shared props
    const { auth } = usePage().props;

    const [studentCount, setStudentCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [activeVoteCount, setActiveVoteCount] = useState(0);
    const [recentAnnouncement, setRecentAnnouncement] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    // Fetch total students
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get("/api/user/count");
                setStudentCount(response.data.count);
            } catch (err) {
                console.error("Error fetching student count:", err);
                setError("Failed to fetch student count.");
            }
        };
        fetchCount();
    }, []);

    // Fetch 3 upcoming events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get("/api/events/upcoming", { withCredentials: true });
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };
        fetchEvents();
    }, []);

    // Fetch count of all upcoming events
    useEffect(() => {
        const fetchUpcomingCount = async () => {
            try {
                const res = await axios.get("/api/events/upcoming/count");
                setUpcomingCount(res.data.count);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUpcomingCount();
    }, []);

    // Fetch recent announcements
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get("/api/notifications/recent");
                setRecentAnnouncement(res.data.data || []);
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };
        fetchAnnouncements();
    }, []);

    // Fetch active votes count
    useEffect(() => {
        const fetchActiveVotes = async () => {
            try {
                const res = await axios.get("/api/vote/activeVotes/count");
                setActiveVoteCount(res.data.count);
            } catch (err) {
                console.error(err);
            }
        };
        fetchActiveVotes();
    }, []);

    // Listen for real-time event creation via Laravel Echo
    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel('events');

            channel.listen('EventCreated', (e) => {
                setEvents(prev => [...prev, e]);
                setUpcomingCount(prev => prev + 1);
            });

            return () => {
                window.Echo.leaveChannel('events');
            };
        }
    }, []);

    // Extract user roles
    const userRoles = auth.user?.roles?.map(role => role.description) || [];
    const hasRole = (roles) => roles.some(role => userRoles.includes(role));
    const isAdmin = hasRole(['Admin']);
    const isHouseParent = hasRole(['HouseParent']);
    const isHouseCommittee = hasRole(['HouseCommittee']);
    const isStudent = hasRole(['Student']);
    const hasManagementAccess = isAdmin || isHouseParent || isHouseCommittee;

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
                            <Link href={route('events.create')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                + Create Event
                            </Link>
                        )}
                    </div>
                    <div className="p-6 space-y-4">
                        {events.length > 0 ? (
                            events.map(event => (
                                <EventItem
                                    key={event.id}
                                    title={event.name}
                                    time={new Date(event.date).toLocaleString()}
                                    location={event.location || "TBA"}
                                    priority={event.priority || "medium"}
                                    canManage={hasManagementAccess}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No upcoming events.</p>
                        )}
                    </div>
                    <div className="px-6 pb-6">
                        <Link href="/events" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                            View all events →
                        </Link>
                    </div>
                </div>

                

                {/* The rest of your dashboard (Announcements, Management Panel, Quick Actions) remains unchanged */}
            </div>
        </StudentLayout>
    );

    // Management Item Component
function ManagementItem({ title, count, href, urgent }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between p-4 border border-gray-200 rounded hover:shadow-sm hover:border-indigo-300 transition-all"
        >
            <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                    {count} {urgent && <span className="text-red-600 font-medium">• Requires attention</span>}
                </p>
            </div>
            <span className={`ml-3 px-3 py-1 rounded-full text-sm font-semibold ${
                urgent ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {count}
            </span>
        </Link>
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

}

// Components: StatCard, EventItem, ManagementItem, AnnouncementItem, QuickActionButton
// (You can reuse your existing component definitions here without changes)
