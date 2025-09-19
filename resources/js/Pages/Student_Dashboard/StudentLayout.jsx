// resources/js/Pages/StudentLayout.jsx
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Home, 
  DoorClosed, 
  Calendar, 
  Vote, 
  Bell, 
  MessageSquare, 
  User ,
  Hotel
} from "lucide-react";

export default function StudentLayout({ children }) {
  const { url } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/StudentDashboard',
      icon: Home,
      current: url === '/StudentDashboard'
    },
    {
      name: 'Rooms',
      href: '/RoomDetails',
      icon: DoorClosed,
      current: url.startsWith('/RoomDetails')
    },
    {
      name: 'Events',
      href: '/Events',
      icon: Calendar,
      current: url.startsWith('/Events')
    },
    {
      name: 'Voting',
      href: '/VotingCentre',
      icon: Vote,
      current: url.startsWith('/VotingCentre')
    },
    {
      name: 'Notifications',
      href: '/Notifications',
      icon: Bell,
      current: url.startsWith('/Notifications')
    },
    {
      name: 'Messages',
      href: '/Messages',
      icon: MessageSquare,
      current: url.startsWith('/Messages')
    },
    {
      name: 'Profile',
      href: '/Profile',
      icon: User,
      current: url.startsWith('/Profile')
    }
  ];

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
          {navigation.map((item) => (
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
              S
            </div>
            <div className="ms-3">
              <p className="mb-0 fw-bold small">Evan Titus</p>
              <p className="mb-0 text-muted small">Room 204B</p>
            </div>
          </div>
          <Link
            href="/Profile"
            className="btn btn-outline-secondary btn-sm w-100 mt-2"
          >
            View Profile
          </Link>
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
                href="/Notifications"
                className="btn btn-notification position-relative me-2"
                >
                <Bell size={18} className="me-1" />
                Notifications
                <span                       
                    
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.5rem" }}
                    >
                    3
                </span>
                
            </Link>
                   
            </div>
    
        </header>

        {/* Page content */}
        <main className="flex-grow-1 p-4">{children}</main>
      </div>
    </div>
  );
}
