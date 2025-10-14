// resources/js/Pages/StudentLayout.jsx
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, usePage, router } from '@inertiajs/react';
import {
  Home,
  DoorClosed,
  Calendar,
  Vote,
  Bell,
  MessageSquare,
  User,
  Hotel,
  Settings,
  Wrench,
  Users,
  Building,
  Menu,
  X
} from "lucide-react";

export default function StudentLayout({ children }) {

  //  Get auth.user from Inertia shared props
  const { auth } = usePage().props;

  const { url } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  

  // 🔹 Fetch unread notifications count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get('/notifications/count');
        setNotificationCount(response.data.count);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();

    // Optional: auto-refresh every 60 seconds
    const interval = setInterval(fetchNotificationCount, 60000);
    return () => clearInterval(interval);
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

  // Define navigation based on roles
  const navigation = [
    {
      name: 'Dashboard',
      href: '/StudentDashboard',
      icon: Home,
      current: url === '/StudentDashboard',
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee'] // All roles
    },
    {
      name: isAdmin ? 'Rooms' : 'Room',
      href: isAdmin ? '/admin/rooms' : '/rooms',
      icon: DoorClosed,
      current: isAdmin ? url.startsWith('/admin/rooms') : url.startsWith('/rooms'),
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee']
    },
    {
      name: 'Events',
      href: '/events',
      icon: Calendar,
      current: url.startsWith('/events'),
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee']
    },
    {
      name: 'Voting',
      href: '/voting-centre',
      icon: Vote,
      current: url.startsWith('/voting-centre'),
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee']
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      current: url.startsWith('/notifications'),
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee']
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      current: url.startsWith('/messages'),
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee']
    },
    {
      name: 'Maintenance',
      href: '/maintenance',
      icon: Wrench,
      current: url.startsWith('/maintenance'),
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee']
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      current: url.startsWith('/profile'),
      roles: ['Student', 'Admin', 'HouseParent', 'HouseCommittee']
    },
    // Admin and House Committee specific items
    ...(hasManagementAccess ? [
      {
        name: 'Residence Management',
        href: '/residence-management',
        icon: Settings,
        current: url.startsWith('/residence-management'),
        roles: ['Admin', 'HouseParent', 'HouseCommittee']
      }
    ] : []),
    // Admin only items
    ...(isAdmin ? [
      {
        name: 'User Management',
        href: '/user-management',
        icon: Users,
        current: url.startsWith('/user-management'),
        roles: ['Admin']
      },

    ] : [])
  ];

  // Filter navigation based on user roles
  const visibleNavigation = navigation.filter(item =>
    !item.roles || hasRole(item.roles)
  );

  // Get role badge color and label
  const getRoleBadgeColor = () => {
    if (isAdmin) return 'bg-danger text-white';
    if (isHouseParent) return 'bg-info text-white';
    if (isHouseCommittee) return 'bg-warning text-dark';
    return 'bg-success text-white';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin';
    if (isHouseParent) return 'House Parent';
    if (isHouseCommittee) return 'House Committee';
    return 'Student';
  };

  const handleLogout = () => {
    // Use Inertia's router for proper logout
    router.post('/logout');
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-light border-end p-3 ${sidebarOpen ? 'd-block' : 'd-none'} d-lg-block`}
        style={{ width: "250px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">

          <h1 className="mb-0">
          <Hotel size={18} className="me-1" />DormDash</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn-close d-lg-none"
            aria-label="Close"
          />
        </div>

        <ul className="nav flex-column">
          {visibleNavigation.map((item) => (
            <li key={item.name} className="nav-item">
              <Link
                href={item.href}
                className={`nav-link d-flex align-items-center ${
                    item.current ? 'active fw-bold text-dark' : 'text-muted'
                }`}
                >
                <item.icon className="me-2" size={18} />
                {item.name}
            </Link>

            </li>
          ))}
        </ul>

        {/* User section */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex align-items-center">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: "40px", height: "40px" }}
            >
              {auth.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ms-3">
              <p className="mb-0 fw-bold small">{auth.user?.name}</p>
              <span className={`badge ${getRoleBadgeColor()} small`}>
                {getRoleLabel()}
              </span>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <Link
              href="/profile"
              className="btn btn-outline-secondary btn-sm flex-fill"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top bar */}
        <header className="bg-white border-bottom p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="btn btn-outline-secondary d-lg-none me-2"
              >
                ☰
              </button>
              <h5 className="mb-0">Dashboard</h5>
            </div>
            <Link
                href="/notifications"
                className="btn btn-notification position-relative me-2"
                >
                <Bell size={18} className="me-1" />
                Notifications
                {notificationCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notificationCount}
                </span>
              )}

            </Link>

            </div>

        </header>

        {/* Page content */}
        <main className="flex-grow-1 p-4">{children}</main>
      </div>
    </div>
  );
}
