import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from '../../axiosSetup'; // ensure this is correct path
import StudentLayout from './StudentLayout';

export default function Notifications({ notifications: initialNotifications = [], user, canManage }) {
  const page = usePage();
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(
    (initialNotifications || []).filter((n) => !n.is_read).length
  );

  // Admin create/edit UI state
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState('announcement');
  const [createContent, setCreateContent] = useState('');
  const [editing, setEditing] = useState(null); // notification being edited
  const [editType, setEditType] = useState('');
  const [editContent, setEditContent] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // if server already passed notifications via Inertia, keep them.
    if (initialNotifications && initialNotifications.length > 0) {
      setNotifications(initialNotifications);
      return;
    }
    // otherwise fetch residence-scoped notifications
    (async () => {
      try {
        const res = await axios.get('/notifications/recent');
        setNotifications(res.data.notifications ?? []);
      } catch (err) {
        console.error('❌ Error fetching notifications:', err);
        setNotifications([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolve residence id for admin create: prefer user's residence_id, otherwise infer from first notification
  const resolveResidenceId = () => {
    return user?.residence_id ?? notifications[0]?.residence_id ?? null;
  };

  // Create
  const createNotification = async () => {
    const residenceId = resolveResidenceId();
    if (!residenceId) return alert('Residence not selected. Set a residence for the user or select one first.');

    setProcessing(true);
    try {
      const res = await axios.post(`/admin/residences/${residenceId}/notifications`, {
        type: createType,
        content: createContent,
      });
      const created = res.data.notification ?? res.data;
      // add to local list
      setNotifications((prev) => [created, ...prev]);
      setCreateContent('');
      setCreateType('announcement');
      setShowCreate(false);
    } catch (err) {
      console.error('Create failed', err);
      alert(err?.response?.data?.message || 'Failed to create notification');
    } finally {
      setProcessing(false);
    }
  };

  // Open edit modal
  const openEdit = (n) => {
    setEditing(n);
    setEditType(n.type || 'announcement');
    setEditContent(n.content || '');
  };

  // Update
  const updateNotification = async () => {
    if (!editing) return;
    setProcessing(true);
    try {
      const res = await axios.put(`/admin/notifications/${editing.id}`, {
        type: editType,
        content: editContent,
      });
      const updated = res.data.notification ?? res.data;
      setNotifications((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditing(null);
    } catch (err) {
      console.error('Update failed', err);
      alert(err?.response?.data?.message || 'Failed to update notification');
    } finally {
      setProcessing(false);
    }
  };

  // Delete
  const deleteNotification = async (id) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await axios.delete(`/admin/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete notification');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'maintenance': return '🔧';
      case 'announcement': return '📢';
      case 'technical': return '💻';
      default: return '🔔';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'reminder': return 'bg-green-50 border-l-4 border-yellow-400';
      case 'maintenance': return 'bg-yellow-50 border-l-4 border-orange-400';
      case 'announcement': return 'bg-blue-50 border-l-4 border-blue-400';
      case 'technical': return 'bg-purple-50 border-l-4 border-purple-400';
      default: return 'bg-gray-50 border-l-4 border-gray-300';
    }
  };

  return (
    <StudentLayout>
      <Head title="Notifications" />

      <div className="bg-white rounded shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Recent notifications for your residence</p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {unreadCount} Unread
            </span>

            {canManage && (
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                + Create
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading && <div className="text-gray-600">Loading...</div>}

        {!loading && notifications.length === 0 && (
          <div className="bg-white rounded shadow-sm p-12 text-center">
            <span className="text-6xl mb-4 block">🔔</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-500 mb-6">You're all caught up! No new notifications at this time.</p>
          </div>
        )}

        {notifications.map((n) => (
          <div key={n.id} className={`bg-white rounded shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow ${getTypeColor(n.type)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{getTypeIcon(n.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {n.type?.charAt(0).toUpperCase() + n.type?.slice(1)}{n.sender?.name ? ` — ${n.sender.name}` : ''}
                    </h3>
                    <p className="text-gray-600 mt-1">{(n.content || '').substring(0, 120)}{(n.content || '').length > 120 ? '...' : ''}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <span className="mr-1">🗓️</span>
                    {n.created_at ? new Date(n.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <Link
                  href={route('notifications.show', n.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-100"
                >
                  View
                </Link>

                {canManage && (
                  <>
                    <button onClick={() => openEdit(n)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
                      Edit
                    </button>
                    <button onClick={() => deleteNotification(n.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-3">Create Notification</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium">Type</label>
              <select value={createType} onChange={(e) => setCreateType(e.target.value)} className="w-full border px-3 py-2 rounded">
                <option value="announcement">Announcement</option>
                <option value="reminder">Reminder</option>
                <option value="maintenance">Maintenance</option>
                <option value="technical">Technical</option>
              </select>

              <label className="block text-sm font-medium">Description</label>
              <textarea value={createContent} onChange={(e) => setCreateContent(e.target.value)} rows={5} className="w-full border p-2 rounded" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={createNotification} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">{processing ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-3">Edit Notification</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium">Type</label>
              <select value={editType} onChange={(e) => setEditType(e.target.value)} className="w-full border px-3 py-2 rounded">
                <option value="announcement">Announcement</option>
                <option value="reminder">Reminder</option>
                <option value="maintenance">Maintenance</option>
                <option value="technical">Technical</option>
              </select>

              <label className="block text-sm font-medium">Description</label>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={5} className="w-full border p-2 rounded" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={updateNotification} disabled={processing} className="px-4 py-2 bg-yellow-600 text-white rounded">{processing ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
