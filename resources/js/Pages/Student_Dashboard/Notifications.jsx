// resources/js/Pages/Notifications.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Head, router, useForm } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function Notifications({ notifications: initialNotifications, canManage, user }) {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [notificationsData, setNotificationsData] = useState(initialNotifications || []);
    const [error, setError] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',
        content: ''
    });

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

    const openNotificationDetails = (notification) => {
        // Mark as read when opening
        markAsRead(notification.id);
        setSelectedNotification({...notification, is_read: true});
        setShowPopup(true);
    };

    const closeNotificationDetails = () => {
        setShowPopup(false);
        setSelectedNotification(null);
    };

    const markAsRead = (notificationId) => {
        router.put(route('notifications.update', notificationId), {
            is_read: true
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setNotificationsData(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, is_read: true }
                            : notification
                    )
                );
            },
            onError: () => {
                alert('Failed to mark notification as read');
            }
        });
    };

    const handleCreateNotification = (e) => {
        e.preventDefault();
        post(route('notifications.store'), {
            onSuccess: () => {
                reset();
                setShowCreateForm(false);
            },
        });
    };

    const handleEditNotification = (e) => {
        e.preventDefault();
        router.put(route('notifications.update', selectedNotification.id), data, {
            preserveState: true,
            onSuccess: () => {
                reset();
                setShowEditForm(false);
                setSelectedNotification(null);
            },
            onError: () => {
                alert('Failed to update notification');
            }
        });
    };

    const handleDeleteNotification = (notificationId) => {
        if (!confirm('Are you sure you want to delete this notification?')) {
            return;
        }

        router.delete(route('notifications.destroy', notificationId), {
            preserveState: true,
            onSuccess: () => {
                setNotificationsData(prevNotifications =>
                    prevNotifications.filter(notification => notification.id !== notificationId)
                );
                setShowPopup(false);
            },
            onError: () => {
                alert('Failed to delete notification');
            }
        });
    };

    const openEditForm = (notification) => {
        setData({
            type: notification.type,
            content: notification.content
        });
        setSelectedNotification(notification);
        setShowEditForm(true);
    };

    return (
        <StudentLayout>
            <Head title="Notifications" />
            
            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-600">Stay informed about important updates and announcements</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {notificationsData.filter(n => !n.is_read).length} Unread
                        </span>
                        {canManage && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                + Create Notification
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notificationsData.map((notification) => (
                    <div
                        key={notification.id}
                        className={`bg-white rounded shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow border-l-4 ${getNotificationColor(notification.type)} ${!notification.is_read ? 'bg-blue-50' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-3">{getNotificationIcon(notification.type)}</span>
                                    <div className="flex items-center">
                                        <h3 className={`text-lg font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} from {notification.sender.name}
                                        </h3>
                                        {!notification.is_read && (
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-3">{notification.content.substring(0, 100)}...</p>
                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <div className="flex items-center">
                                        <span className="mr-1">🗓️</span>
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">🕐</span>
                                        {new Date(notification.created_at).toLocaleTimeString()}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">📋</span>
                                        {notification.type}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                                <button
                                    onClick={() => openNotificationDetails(notification)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-purple-300 transition-colors"
                                >
                                    View
                                </button>
                                {!notification.is_read && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Mark Read
                                    </button>
                                )}
                                {canManage && (
                                    <>
                                        <button
                                            onClick={() => openEditForm(notification)}
                                            className="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNotification(notification.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {notificationsData.length === 0 && (
                <div className="bg-white rounded shadow-sm p-12 text-center">
                    <span className="text-6xl mb-4 block">🔔</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
                    <p className="text-gray-500 mb-6">You're all caught up! No new notifications at this time.</p>
                </div>
            )}

            {/* Notification Details Popup */}
            {showPopup && selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        {/* Popup Header */}
                        <div className={`p-6 border-b border-gray-200 border-l-4 ${getNotificationColor(selectedNotification.type)}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-3xl mr-3">{getNotificationIcon(selectedNotification.type)}</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)} from {selectedNotification.sender.name}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(selectedNotification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeNotificationDetails}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Popup Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Notification Details:</h3>
                                <p className="text-gray-800 leading-relaxed">
                                    {selectedNotification.content}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Type:</span>
                                    <span className="ml-2 capitalize text-gray-600">{selectedNotification.type}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <span className={`ml-2 ${selectedNotification.is_read ? 'text-green-600' : 'text-blue-600'}`}>
                                        {selectedNotification.is_read ? 'Read' : 'Unread'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Popup Footer */}
                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={closeNotificationDetails}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Notification Form */}
            {showCreateForm && canManage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Create New Notification</h2>
                        </div>

                        <form onSubmit={handleCreateNotification} className="p-6">
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    This notification will be sent to all users in your residence.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Type
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select type...</option>
                                        <option value="reminder">Reminder</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="announcement">Announcement</option>
                                        <option value="technical">Technical</option>
                                    </select>
                                    {errors.type && (
                                        <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="5"
                                        placeholder="Enter notification message..."
                                        required
                                    />
                                    {errors.content && (
                                        <p className="text-red-600 text-sm mt-1">{errors.content}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        reset();
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Broadcasting...' : 'Broadcast to Residence'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Notification Form */}
            {showEditForm && canManage && selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Edit Notification</h2>
                        </div>

                        <form onSubmit={handleEditNotification} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Type
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select type...</option>
                                        <option value="reminder">Reminder</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="announcement">Announcement</option>
                                        <option value="technical">Technical</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="5"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setSelectedNotification(null);
                                        reset();
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                >
                                    Update Notification
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </StudentLayout>
    );
}