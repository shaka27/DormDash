// resources/js/Pages/Messages.jsx
import { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";

export default function Messages({ groups: initialGroups }) {
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedChatroomId, setSelectedChatroomId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [groupsData] = useState(initialGroups || []);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Poll for new messages every 5 seconds
    useEffect(() => {
        if (!selectedChatroomId) return;

        const interval = setInterval(() => {
            fetchMessages(selectedChatroomId);
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedChatroomId]);

    // Fetch messages for a chatroom
    const fetchMessages = async (chatroomId) => {
        try {
            const response = await axios.get(`/api/chatrooms/${chatroomId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const selectedGroup = selectedGroupId
        ? groupsData.find((g) => g.id === selectedGroupId)
        : null;

    const handleGroupSelect = async (group) => {
        setSelectedGroupId(group.id);
        setSelectedChatroomId(group.chatroom_id);

        if (group.chatroom_id) {
            setLoading(true);
            await fetchMessages(group.chatroom_id);
            setLoading(false);
        } else {
            setMessages([]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChatroomId) return;

        try {
            const response = await axios.post('/api/messages', {
                chatroom_id: selectedChatroomId,
                message: newMessage
            });

            setMessages([...messages, response.data]);
            setNewMessage("");
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
                                {groupsData.length > 0 ? groupsData.map((group) => (
                                    <div
                                        key={group.id}
                                        onClick={() => handleGroupSelect(group)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedGroupId === group.id
                                                ? "bg-purple-50 border-l-4 border-l-purple-500"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600">
                                                {getInitials(group.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {group.name}
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        {group.unreadCount > 0 && (
                                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                {group.unreadCount}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            {group.lastMessageTime}
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
                                )) : (
                                    <div className="p-4 text-center text-gray-500">
                                        <p>No groups available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="w-2/3 flex flex-col">
                            {selectedGroup ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600">
                                                {getInitials(selectedGroup.name)}
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
                                        {loading ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-gray-500">Loading messages...</div>
                                            </div>
                                        ) : messages.length > 0 ? (
                                            <>
                                                {messages.map((message) => (
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
                                                                        {message.sender}
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
                                                                {formatTime(message.timestamp)}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mx-2 ${
                                                                message.isOwn
                                                                    ? "order-1 bg-purple-300 text-purple-900"
                                                                    : "order-2 bg-gray-300 text-gray-700"
                                                            }`}
                                                        >
                                                            {getInitials(message.sender)}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center text-gray-500">
                                                    <p className="text-4xl mb-2">💬</p>
                                                    <p>No messages yet. Start the conversation!</p>
                                                </div>
                                            </div>
                                        )}
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
