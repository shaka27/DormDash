import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Notifications({ notifications = [], user, canManage }) {
  const { flash } = usePage().props;
  const [notificationsData, setNotificationsData] = useState(notifications);
  const unreadCount = notificationsData.filter((n) => !n.is_read).length;

  const markAsRead = (id) => {
    router.patch(
      route("notifications.markAsRead", id),
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
      router.delete(route("notifications.destroy", id), {
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
      router.delete(route("notifications.clearAll"), {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <div className="flex items-center gap-3">
          {/* Unread count badge */}
          <div className="bg-red-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
            {unreadCount} Unread
          </div>

          {/* Clear All button */}
          <button
            onClick={clearAllNotifications}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>

          {/* Create button (only if admin/houseparent) */}
          {canManage && (
            <button
              onClick={() => router.visit(route("notifications.create"))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create Notification
            </button>
          )}
        </div>
      </div>

      {flash.success && (
        <div className="mb-4 text-green-600 font-semibold">{flash.success}</div>
      )}
      {flash.error && (
        <div className="mb-4 text-red-600 font-semibold">{flash.error}</div>
      )}

      {notificationsData.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No notifications found.
        </div>
      ) : (
        <ul className="space-y-4">
          {notificationsData.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg shadow-md transition ${
                notification.is_read
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-blue-50 dark:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {notification.type}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {notification.content}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Sent by {notification.sender?.name || "Unknown"} •{" "}
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-green-600 hover:text-green-800 font-semibold"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
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
