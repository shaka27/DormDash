// resources/js/Pages/Messages.jsx
import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";

export default function Messages({ groups, messages }) {
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    // Dummy groups data
    const [groupsData, setGroupsData] = useState(
        groups || [
            {
                id: 1,
                name: "House Committee",
                description: "Official house committee discussions",
                lastMessage: "Meeting scheduled for tomorrow",
                lastMessageTime: "14:30",
                unreadCount: 2,
                members: 8,
                avatar: "🏠",
            },
            {
                id: 2,
                name: "Study Group - Math",
                description: "First-year mathematics study group",
                lastMessage: "Can someone help with calculus?",
                lastMessageTime: "12:15",
                unreadCount: 5,
                members: 12,
                avatar: "📚",
            },
            {
                id: 3,
                name: "Sports Team",
                description: "Residence rugby team",
                lastMessage: "Practice at 16:00 today",
                lastMessageTime: "10:45",
                unreadCount: 0,
                members: 15,
                avatar: "🏉",
            },
            {
                id: 4,
                name: "Social Events",
                description: "Planning fun activities",
                lastMessage: "Braai this Saturday!",
                lastMessageTime: "09:20",
                unreadCount: 1,
                members: 25,
                avatar: "🎉",
            },
            {
                id: 5,
                name: "Maintenance Issues",
                description: "Report and track maintenance",
                lastMessage: "WiFi fixed in block A",
                lastMessageTime: "Yesterday",
                unreadCount: 0,
                members: 6,
                avatar: "🔧",
            },
        ]
    );

    // Dummy messages data for each group
    const messagesData = {
        1: [
            {
                id: 1,
                sender: "John Smith",
                message:
                    "Good morning everyone! Just a reminder about tomorrow's meeting at 18:00 in Common Room A.",
                timestamp: "2024-09-05 08:30",
                isOwn: false,
                avatar: "JS",
            },
            {
                id: 2,
                sender: "You",
                message:
                    "Thanks for the reminder! Will we be discussing the new security measures?",
                timestamp: "2024-09-05 08:45",
                isOwn: true,
                avatar: "ME",
            },
            {
                id: 3,
                sender: "Sarah Johnson",
                message:
                    "Yes, security measures will be on the agenda along with the budget review.",
                timestamp: "2024-09-05 09:00",
                isOwn: false,
                avatar: "SJ",
            },
            {
                id: 4,
                sender: "Mike Davis",
                message:
                    "Can we also discuss the WiFi upgrade plans? Students have been asking about it.",
                timestamp: "2024-09-05 14:30",
                isOwn: false,
                avatar: "MD",
            },
        ],
        2: [
            {
                id: 1,
                sender: "Emma Wilson",
                message:
                    "Hey everyone! Can someone help me with integration by parts? I'm stuck on question 5.",
                timestamp: "2024-09-05 10:15",
                isOwn: false,
                avatar: "EW",
            },
            {
                id: 2,
                sender: "You",
                message:
                    "Sure! Integration by parts follows the formula: ∫u dv = uv - ∫v du. What specific part are you struggling with?",
                timestamp: "2024-09-05 10:20",
                isOwn: true,
                avatar: "ME",
            },
            {
                id: 3,
                sender: "Tom Brown",
                message:
                    "I can help too! Let's meet in the study hall after lunch to go through it together.",
                timestamp: "2024-09-05 11:30",
                isOwn: false,
                avatar: "TB",
            },
            {
                id: 4,
                sender: "Emma Wilson",
                message:
                    "That would be amazing! Thank you both so much 🙏",
                timestamp: "2024-09-05 12:15",
                isOwn: false,
                avatar: "EW",
            },
        ],
        3: [
            {
                id: 1,
                sender: "Coach Williams",
                message:
                    "Team practice today at 16:00 on the main field. Please bring your boots and water bottles.",
                timestamp: "2024-09-05 08:00",
                isOwn: false,
                avatar: "CW",
            },
            {
                id: 2,
                sender: "You",
                message:
                    "Will be there! Should we bring the new training equipment?",
                timestamp: "2024-09-05 08:30",
                isOwn: true,
                avatar: "ME",
            },
            {
                id: 3,
                sender: "Coach Williams",
                message:
                    "Yes, bring everything. We'll be working on scrummaging techniques today.",
                timestamp: "2024-09-05 10:45",
                isOwn: false,
                avatar: "CW",
            },
        ],
        4: [
            {
                id: 1,
                sender: "Lisa Chen",
                message:
                    "Braai this Saturday at 18:00 in the residence garden! 🔥🥩",
                timestamp: "2024-09-05 07:00",
                isOwn: false,
                avatar: "LC",
            },
            {
                id: 2,
                sender: "Mark Taylor",
                message:
                    "Count me in! Should I bring my guitar for some music?",
                timestamp: "2024-09-05 07:30",
                isOwn: false,
                avatar: "MT",
            },
            {
                id: 3,
                sender: "You",
                message:
                    "Great idea Mark! I'll bring some drinks. What should everyone else bring?",
                timestamp: "2024-09-05 08:00",
                isOwn: true,
                avatar: "ME",
            },
            {
                id: 4,
                sender: "Lisa Chen",
                message:
                    "Perfect! I'll post a sign-up sheet on the notice board for food contributions.",
                timestamp: "2024-09-05 09:20",
                isOwn: false,
                avatar: "LC",
            },
        ],
        5: [
            {
                id: 1,
                sender: "Maintenance Team",
                message:
                    "WiFi issues in Block A have been resolved. Please restart your devices if you're still experiencing problems.",
                timestamp: "2024-09-04 15:30",
                isOwn: false,
                avatar: "MT",
            },
            {
                id: 2,
                sender: "You",
                message: "Thank you! WiFi is working perfectly now.",
                timestamp: "2024-09-04 16:00",
                isOwn: true,
                avatar: "ME",
            },
        ],
    };

    const selectedGroup = selectedGroupId
        ? groupsData.find((g) => g.id === selectedGroupId)
        : null;
    const currentMessages = selectedGroupId
        ? messagesData[selectedGroupId] || []
        : [];

    const handleGroupSelect = (groupId) => {
        setSelectedGroupId(groupId);
        setGroupsData((prevGroups) =>
            prevGroups.map((group) =>
                group.id === groupId ? { ...group, unreadCount: 0 } : group
            )
        );
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedGroupId) return;

        console.log(
            `Sending message to group ${selectedGroupId}: ${newMessage}`
        );

        const newMsg = {
            id: currentMessages.length + 1,
            sender: "You",
            message: newMessage,
            timestamp: new Date()
                .toISOString()
                .slice(0, 16)
                .replace("T", " "),
            isOwn: true,
            avatar: "ME",
        };

        setNewMessage("");
        // In real app: push to backend, update messages
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Messages" />

            {/* Messages Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">💬</span>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Messages
                            </h1>
                            <p className="text-sm text-gray-600">
                                Residence Group Communications
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/StudentDashboard"
                        className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span className="text-sm font-medium">
                            Back to Dashboard
                        </span>
                    </Link>
                </div>
            </div>

            {/* Main Messages Container */}
            <div className="h-screen">
                <div className="h-full bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
                    <div className="flex h-full">
                        {/* Groups Sidebar */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Groups
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Select a group to start messaging
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {groupsData.map((group) => (
                                    <div
                                        key={group.id}
                                        onClick={() =>
                                            handleGroupSelect(group.id)
                                        }
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedGroupId === group.id
                                                ? "bg-purple-50 border-l-4 border-l-purple-500"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                                                {group.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {group.name}
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        {group.unreadCount >
                                                            0 && (
                                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                {
                                                                    group.unreadCount
                                                                }
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                group.lastMessageTime
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {group.lastMessage}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {group.members} members
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="w-2/3 flex flex-col">
                            {selectedGroup ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                                                {selectedGroup.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-bold text-gray-900">
                                                    {selectedGroup.name}
                                                </h2>
                                                <p className="text-sm text-gray-600">
                                                    {selectedGroup.description}{" "}
                                                    • {selectedGroup.members}{" "}
                                                    members
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                <span>Online</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages List */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {currentMessages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${
                                                    message.isOwn
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md ${
                                                        message.isOwn
                                                            ? "order-2"
                                                            : "order-1"
                                                    }`}
                                                >
                                                    <div
                                                        className={`px-4 py-2 rounded-lg ${
                                                            message.isOwn
                                                                ? "bg-purple-600 text-white"
                                                                : "bg-gray-200 text-gray-800"
                                                        }`}
                                                    >
                                                        {!message.isOwn && (
                                                            <p className="text-xs font-semibold mb-1">
                                                                {
                                                                    message.sender
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="text-sm">
                                                            {message.message}
                                                        </p>
                                                    </div>
                                                    <p
                                                        className={`text-xs text-gray-500 mt-1 ${
                                                            message.isOwn
                                                                ? "text-right"
                                                                : "text-left"
                                                        }`}
                                                    >
                                                        {formatTime(
                                                            message.timestamp
                                                        )}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold mx-2 ${
                                                        message.isOwn
                                                            ? "order-1"
                                                            : "order-2"
                                                    }`}
                                                >
                                                    {message.avatar}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                                        <form
                                            onSubmit={handleSendMessage}
                                            className="flex space-x-3"
                                        >
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) =>
                                                    setNewMessage(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Type your message..."
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                    />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl mb-4 block">
                                            💬
                                        </span>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Select a Group
                                        </h3>
                                        <p className="text-gray-500">
                                            Choose a group from the sidebar to
                                            start messaging
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
