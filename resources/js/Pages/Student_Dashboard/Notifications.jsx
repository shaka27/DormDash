import React, { useState } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { Trash2, Eye, Bell, Check } from "lucide-react";

export default function Notifications({ notifications = [], user, canManage }) {
  const { flash } = usePage().props;
  const [notificationsData, setNotificationsData] = useState(notifications);
  const unreadCount = notificationsData.filter((n) => !n.is_read).length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
      case 'technical':
        return 'bg-purple-100 text-purple-800 border-l-4 border-purple-500';
      case 'reminder':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      default:
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement':
        return '📢';
      case 'maintenance':
        return '🔧';
      case 'technical':
        return '💻';
      case 'reminder':
        return '⏰';
      default:
        return '📝';
    }
  };

  const markAsRead = (id) => {
    router.post(
      `/api/notifications/${id}/read`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setNotificationsData((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
          );
        },
      }
    );
  };

  const deleteNotification = (id) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      router.delete(`/notifications/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setNotificationsData((prev) => prev.filter((n) => n.id !== id));
        },
        onError: () => {
          alert("Failed to delete notification");
        },
      });
    }
  };

  const clearAllNotifications = () => {
    if (notificationsData.length === 0) {
      alert("No notifications to clear.");
      return;
    }

    if (confirm("Are you sure you want to clear all notifications?")) {
      router.delete(`/api/notifications/clear-all`, {
        preserveScroll: true,
        onSuccess: () => {
          setNotificationsData([]);
        },
        onError: () => {
          alert("Failed to clear all notifications");
        },
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 text-sm mt-1">Stay updated with residence announcements and updates</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <div className="bg-red-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
              {unreadCount} Unread
            </div>
          )}

          {/* Clear All button */}
          {notificationsData.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {flash?.success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {flash.success}
        </div>
      )}
      {flash?.error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {flash.error}
        </div>
      )}

      {notificationsData.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500">
            You'll see residence announcements and updates here
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notificationsData.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg shadow-sm transition border ${
                notification.is_read
                  ? "bg-gray-50 dark:bg-gray-800 border-gray-200"
                  : "bg-white dark:bg-gray-700 border-indigo-300 shadow-md"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(notification.type)}`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                      {!notification.is_read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {notification.content}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>
                      {new Date(notification.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {notification.sender && (
                      <span>By {notification.sender.first_name} {notification.sender.last_name}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/notifications/${notification.id}`}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition flex items-center justify-center"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </Link>

                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition flex items-center justify-center"
                      title="Mark as Read"
                    >
                      <Check size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition flex items-center justify-center"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
