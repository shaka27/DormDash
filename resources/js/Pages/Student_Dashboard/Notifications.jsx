// resources/js/Pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";

/**
 * Student notifications page.
 * Expects `notifications` and `user` to be passed via Inertia props from NotificationController@index.
 * Falls back to an API fetch if not provided.
 */
export default function Notifications({ notifications: initialNotifications = [], user }) {
  const [notificationsData, setNotificationsData] = useState(initialNotifications || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialNotifications || initialNotifications.length === 0) {
      // try to fetch recent notifications for the user's residence
      (async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/notifications/recent', { credentials: 'include' });
          if (res.ok) {
            const json = await res.json();
            setNotificationsData(json.notifications ?? json ?? []);
          } else {
            console.warn('Failed fetching recent notifications', res.status);
            setNotificationsData([]);
          }
        } catch (err) {
          console.error(err);
          setNotificationsData([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reminder": return "⏰";
      case "maintenance": return "🔧";
      case "announcement": return "📢";
      case "technical": return "💻";
      default: return "🔔";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "reminder": return "border-l-yellow-400";
      case "maintenance": return "border-l-orange-400";
      case "announcement": return "border-l-blue-400";
      case "technical": return "border-l-purple-400";
      default: return "border-l-gray-400";
    }
  };

  return (
    <>
      <Head title="Notifications" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {loading && <div>Loading...</div>}
        {!loading && notificationsData.length === 0 && <div className="text-gray-500">No notifications</div>}
        <div className="space-y-4">
          {notificationsData.map(n => (
            <div key={n.id} className={`p-4 border rounded bg-white border-l-4 ${getNotificationColor(n.type)}`}>
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{n.type?.charAt(0).toUpperCase() + n.type?.slice(1)} from {n.sender?.name ?? 'System'}</div>
                  <div className="text-sm text-gray-600">{n.content}</div>
                </div>
                <div className="text-sm text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}