import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Head, Link, usePage } from '@inertiajs/react';
import StudentLayout from './StudentLayout';

export default function StudentDashboard() {
    
    //  Get auth.user from Inertia shared props
    const { auth } = usePage().props;

    const [studentCount, setStudentCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [activeVoteCount, setActiveVoteCount] = useState(0);
    const [recentAnnouncement, setRecentAnnouncement] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    
    //Return total residents/students
    useEffect(() => {
    const fetchCount = async () => {
        try {
            const response = await axios.get("/api/user/count"); // ✅ lowercase 'user'
            setStudentCount(response.data.count);
        } catch (err) {
            console.error("Error fetching student count:", err);
            setError("Failed to fetch student count.");
        }
        };

        fetchCount();
    }, []);

    // Return of 3 upcomming events
    useEffect(() => {
        axios.get("/api/events/upcoming",{ withCredentials: true })
            .then(res => setEvents(res.data))
            .catch(err => console.error("Error fetching events:", err));
    }, []);

    // Return of 5 recent announcements
    useEffect(() => {
        axios.get("/api/notifications/recent")
            .then(res => {
                console.log("✅ Notifications response:", res.data);
                setRecentAnnouncement(res.data.data || []);
            })
            .catch(err => console.error("❌ Error fetching notifications:", err));
    }, []);

    // Return amount of all upcomming events
    useEffect(() => {
        axios.get("/api/events/upcoming/count")
        .then(res => setUpcomingCount(res.data.count))
        .catch(err => console.error(err));
    }, []);

    // Return amount of all active votes
    useEffect(() => {
        axios.get("/api/vote/activeVotes/count")
        .then(res => setActiveVoteCount(res.data.count))
        .catch(err => console.error(err));
    }, []);

    // Extract user roles and create role checking helpers
    const userRoles = auth.user?.roles?.map(role => role.description) || [];
    
    // Role checking helpers
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

                 {/* Stats Cards - Different stats based on role */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {hasManagementAccess ? (
                         <>
                             <StatCard
                                 title="Total Students"
                                 value={studentCount}
                                 subtitle="Active residents"
                                 icon="👥"
                                 iconBg="bg-blue-100"
                                 iconColor="text-blue-600"
                             />
                             <StatCard
                                 title="Pending Requests"
                                 value="12"
                                 subtitle="Maintenance & Issues"
                                 icon="⚠️"
                                 iconBg="bg-orange-100"
                                 iconColor="text-orange-600"
                             />
                             <StatCard
                                 title="Upcoming Events"
                                 value={upcomingCount}
                                 subtitle="This week"
                                 icon="📅"
                                 iconBg="bg-green-100"
                                 iconColor="text-green-600"
                             />
                             <StatCard
                                 title="Active Votes"
                                 value={activeVoteCount}
                                 subtitle="In progress"
                                 icon="🗳️"
                                 iconBg="bg-purple-100"
                                 iconColor="text-purple-600"
                             />
                         </>
                     ) : (
                         <>
                             <StatCard
                                 title="Upcoming Events"
                                 value={upcomingCount}
                                 subtitle="This week"
                                 icon="📅"
                                 iconBg="bg-green-100"
                                 iconColor="text-green-600"
                             />
                             <StatCard
                                 title="New Announcements"
                                 value="3"
                                 subtitle="Today"
                                 icon="🔔"
                                 iconBg="bg-yellow-100"
                                 iconColor="text-yellow-600"
                             />
                             <StatCard
                                 title="Active Votes"
                                 value={activeVoteCount}
                                 subtitle="Cast your vote"
                                 icon="🗳️"
                                 iconBg="bg-purple-100"
                                 iconColor="text-purple-600"
                             />
                             <StatCard
                                 title="Unread Messages"
                                 value="5"
                                 subtitle="New"
                                 icon="💬"
                                 iconBg="bg-blue-100"
                                 iconColor="text-blue-600"
                             />
                         </>
                     )}
                 </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Upcoming Events */}
                     <div className="bg-white rounded shadow-sm">
                         <div className="p-6 border-b border-gray-200">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center">
                                     <span className="text-lg mr-3">📅</span>
                                     <div>
                                         <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                                         <p className="text-sm text-gray-500 mt-1">Don't miss these important events</p>
                                     </div>
                                 </div>
                                 {hasManagementAccess && (
                                     <Link
                                         href="/events/create"
                                         className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                     >
                                         + Create Event
                                     </Link>
                                 )}
                             </div>
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
                            <Link
                                href="/events"
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                View all events →
                            </Link>
                        </div>
                    </div>

                     {/* Announcements or Management Panel */}
                     {hasManagementAccess ? (
                         <div className="bg-white rounded shadow-sm">
                             <div className="p-6 border-b border-gray-200">
                                 <h2 className="text-lg font-semibold text-gray-900">Management Overview</h2>
                                 <p className="text-sm text-gray-500 mt-1">Quick access to administrative tasks</p>
                             </div>
                             <div className="p-6 space-y-4">
                                 <ManagementItem
                                     title="Pending Maintenance Requests"
                                     count="12"
                                     href="/maintenance-requests"
                                     urgent={true}
                                 />
                                 <ManagementItem
                                     title="Room Inspections Due"
                                     count="8"
                                     href="/rooms"
                                     urgent={false}
                                 />
                                 <ManagementItem
                                     title="Student Access Requests"
                                     count="5"
                                     href="/residence-management"
                                     urgent={false}
                                 />
                                 <ManagementItem
                                     title="Upcoming Event Approvals"
                                     count="3"
                                     href="/events"
                                     urgent={false}
                                 />
                             </div>
                             <div className="px-6 pb-6">
                                 <Link
                                     href="/residence-management"
                                     className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                 >
                                     Go to Management Dashboard →
                                 </Link>
                             </div>
                         </div>
                     ) : (
                         <div className="bg-white rounded shadow-sm">
                             <div className="p-6 border-b border-gray-200">
                                 <div className="flex items-center">
                                     <span className="text-lg mr-3">🔔</span>
                                     <div>
                                         <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
                                         <p className="text-sm text-gray-500 mt-1">Stay updated with the latest news</p>
                                     </div>
                                 </div>
                             </div>
                             <div className="p-6 space-y-4">
                                 
                                {recentAnnouncement.length > 0 ? (
                                    recentAnnouncement.map(notification => (
                                        <AnnouncementItem
                                            key={notification.id}
                                            title={notification.content}
                                            time={new Date(notification.created_at).toLocaleString()}
                                            priority={notification.type || "medium"}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No upcoming notifications.</p>
                                )}
                             </div>
                             <div className="px-6 pb-6">
                                 <Link
                                     href="/notifications"
                                     className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                 >
                                     View all announcements →
                                 </Link>
                             </div>
                         </div>
                     )}
                </div>

                 {/* Quick Actions */}
                 <div className="bg-white rounded shadow-sm p-6">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {hasManagementAccess ? (
                             <>
                                 <QuickActionButton
                                     href="/residence-management"
                                     icon="⚙️"
                                     title="Manage Residence"
                                     description="Settings & Access"
                                 />
                                 <QuickActionButton
                                     href="/maintenance-requests"
                                     icon="🔧"
                                     title="Maintenance"
                                     description="View requests"
                                 />
                                 <QuickActionButton
                                     href="/events"
                                     icon="📅"
                                     title="Manage Events"
                                     description="Create & organize"
                                 />
                                 <QuickActionButton
                                     href="/notifications"
                                     icon="📢"
                                     title="Announcements"
                                     description="Post updates"
                                 />
                             </>
                         ) : (
                             <>
                                 <QuickActionButton
                                     href="/rooms"
                                     icon="🏠"
                                     title="My Room"
                                     description="View room info"
                                 />
                                 <QuickActionButton
                                     href="/voting-centre"
                                     icon="🗳️"
                                     title="Vote"
                                     description="Cast your vote"
                                 />
                                 <QuickActionButton
                                     href="/events"
                                     icon="📅"
                                     title="Events"
                                     description="Browse events"
                                 />
                                 <QuickActionButton
                                     href="/maintenance"
                                     icon="🔧"
                                     title="Report Issue"
                                     description="Submit request"
                                 />
                             </>
                         )}
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
function EventItem({ title, time, location, priority, canManage }) {
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
            {canManage ? (
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Edit
                </button>
            ) : (
                <button className="text-gray-400 hover:text-gray-600">
                    →
                </button>
            )}
        </div>
    );
}

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
