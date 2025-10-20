import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StudentLayout from './StudentLayout';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import axios from '../../axiosSetup';
import { route } from 'ziggy-js';

interface Sender {
  id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface NotificationShape {
  id: number;
  type: string;
  content: string;
  is_read?: boolean;
  created_at?: string;
  sender?: Sender | null;
}

export default function NotificationDetails(props: { notification?: NotificationShape }) {
  const page = usePage();
  const initialNotification = props.notification ?? (page.props as any).notification ?? null;
  const [notification, setNotification] = useState<NotificationShape | null>(initialNotification);

  useEffect(() => {
    // If Inertia didn't pass the notification prop, fetch it from API by parsing URL
    if (!notification) {
      (async () => {
        try {
          const parts = window.location.pathname.split('/').filter(Boolean);
          const id = parts[parts.length - 1];
          const res = await axios.get(`/api/notifications/${id}`);
          setNotification(res.data.notification ?? res.data ?? null);
        } catch (err) {
          console.error('Failed to load notification', err);
        }
      })();
    }
  }, [notification]);

  if (!notification) {
    return (
      <StudentLayout>
        <Head title="Notification Not Found" />
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notification not found</h3>
          <p className="text-gray-500 mb-6">The notification you are looking for does not exist.</p>
          <Link href={route('notifications.index')} className="px-4 py-2 bg-indigo-600 text-white rounded">Back to Notifications</Link>
        </div>
      </StudentLayout>
    );
  }

  const handleMarkAsRead = async () => {
    if (!notification.is_read) {
      try {
        await axios.post(`/api/notifications/${notification.id}/read`);
        setNotification({ ...notification, is_read: true });
      } catch (err) {
        console.error('Failed to mark read', err);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'maintenance': return '🔧';
      case 'technical': return '💻';
      case 'reminder': return '⏰';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'technical': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'reminder': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <StudentLayout>
      <Head title={`${notification.type} - Notification`} />

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href={route('notifications.index')} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
            <ArrowLeft size={20} /> Back to Notifications
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getTypeIcon(notification.type)}</div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(notification.type)}`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                  <p className="text-gray-600 text-sm mt-2 font-medium">
                    {notification.sender ? `From: ${notification.sender.first_name ?? notification.sender.name ?? ''} ${notification.sender.last_name ?? ''}` : 'System Notification'}
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

          <div className="p-8">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {notification.content}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                <span>
                  {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {!notification.is_read && (
                <button onClick={handleMarkAsRead} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <CheckCircle size={16} /> Mark as Read
                </button>
              )}
              <Link href={route('notifications.index')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-medium">
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}