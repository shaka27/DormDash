// resources/js/Pages/Notifications.jsx
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function Notifications({ notifications }) {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [notificationsData, setNotificationsData] = useState(notifications || [
        {
            id: 1,
            title: "House Committee Meeting Reminder",
            message: "Don't forget about tomorrow's house committee meeting at 18:00 in Common Room A.",
            fullMessage: "This is a reminder that the monthly house committee meeting is scheduled for tomorrow at 18:00 in Common Room A. We will be discussing the upcoming braai day celebration, new residence rules, and addressing any concerns from residents. Your attendance is highly encouraged as we value your input on residence matters. Please bring any topics you'd like to discuss.",
            type: "reminder",
            date: "2024-09-01",
            time: "14:30",
            isRead: false
        },
        {
            id: 2,
            title: "Maintenance Notice",
            message: "Water supply will be temporarily interrupted on Friday for pipe maintenance.",
            fullMessage: "Please be advised that there will be a temporary water supply interruption on Friday, September 6th, from 09:00 to 15:00 for essential pipe maintenance in the residence. This maintenance is necessary to ensure continued reliable water supply. We recommend filling containers with water beforehand for your convenience. We apologize for any inconvenience and appreciate your understanding.",
            type: "maintenance",
            date: "2024-09-03",
            time: "10:15",
            isRead: true
        },
        {
            id: 3,
            title: "New Security Measures",
            message: "Enhanced security protocols have been implemented effective immediately.",
            fullMessage: "We are pleased to inform you that new security measures have been implemented to ensure the safety and security of all residents. These include: 24/7 security personnel at the main entrance, new access card system for all entry points, CCTV monitoring in common areas, and mandatory visitor registration. Please ensure you have your access card with you at all times. If you have any questions about these new measures, please contact the residence management office.",
            type: "announcement",
            date: "2024-09-04",
            time: "08:45",
            isRead: false
        },
        {
            id: 4,
            title: "WiFi Network Update",
            message: "WiFi network will be upgraded this weekend. Temporary connectivity issues expected.",
            fullMessage: "We are excited to announce that our WiFi network infrastructure will be upgraded this weekend (September 7-8) to provide faster and more reliable internet connectivity. During the upgrade process, you may experience temporary connectivity issues or slower speeds. The work is scheduled to begin Saturday at 22:00 and should be completed by Sunday at 14:00. We appreciate your patience during this improvement process.",
            type: "technical",
            date: "2024-09-05",
            time: "16:20",
            isRead: true
        }
    ]);

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
        setSelectedNotification({...notification, isRead: true});
        setShowPopup(true);
    };

    const closeNotificationDetails = () => {
        setShowPopup(false);
        setSelectedNotification(null);
    };

    const markAsRead = (notificationId) => {
        setNotificationsData(prevNotifications => 
            prevNotifications.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
        // This would typically make an API call to mark as read
        console.log(`Marking notification ${notificationId} as read`);
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
                    <div className="flex items-center space-x-2">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {notificationsData.filter(n => !n.isRead).length} Unread
                        </span>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notificationsData.map((notification) => (
                    <div 
                        key={notification.id} 
                        className={`bg-white rounded shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow border-l-4 ${getNotificationColor(notification.type)} ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-3">{getNotificationIcon(notification.type)}</span>
                                    <div>
                                        <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.isRead && (
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-3">{notification.message}</p>
                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <div className="flex items-center">
                                        <span className="mr-1">🗓️</span>
                                        {notification.date}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">🕐</span>
                                        {notification.time}
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
                                {!notification.isRead && (
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
                                            {selectedNotification.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {selectedNotification.date} at {selectedNotification.time}
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
                                    {selectedNotification.fullMessage}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Type:</span>
                                    <span className="ml-2 capitalize text-gray-600">{selectedNotification.type}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <span className={`ml-2 ${selectedNotification.isRead ? 'text-green-600' : 'text-blue-600'}`}>
                                        {selectedNotification.isRead ? 'Read' : 'Unread'}
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
            
        </StudentLayout>
    );
}