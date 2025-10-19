import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StudentLayout from './StudentLayout';
import { ArrowLeft, Clock, User, CheckCircle } from 'lucide-react';

interface Sender {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
}

interface NotificationProps {
  notification: {
    id: number;
    type: string;
    content: string;
    is_read: boolean;
    created_at: string;
    sender?: Sender;
  };
}

export default function NotificationDetails({ notification }: NotificationProps) {
  if (!notification) {
    return (
      <StudentLayout>
        <Head title="Notification Not Found" />
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Notification not found
          </h3>
          <p className="text-gray-500 mb-6">
            The notification you are looking for does not exist.
          </p>
          <Link
            href="/notifications"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Back to Notifications
          </Link>
        </div>
      </StudentLayout>
    );
  }

  const handleMarkAsRead = () => {
    if (!notification.is_read) {
      router.post(`/api/notifications/${notification.id}/read`, {}, {
        preserveScroll: true,
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'technical':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'reminder':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
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

  return (
    <StudentLayout>
      <Head title={`${notification.type} - Notification`} />

      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/notifications"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Notifications
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Type Badge */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getTypeIcon(notification.type)}</div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(notification.type)}`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                  <p className="text-gray-600 text-sm mt-2 font-medium">
                    {notification.sender
                      ? `From: ${notification.sender.first_name} ${notification.sender.last_name}`
                      : 'System Notification'}
                  </p>
                </div>
              </div>
              {notification.is_read && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Read</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {notification.content}
              </div>
            </div>
          </div>

          {/* Footer with Metadata */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                <span>
                  {new Date(notification.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!notification.is_read && (
                <button
                  onClick={handleMarkAsRead}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Read
                </button>
              )}
              <Link
                href="/notifications"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}