// resources/js/Pages/Messages.jsx
import { useState, useEffect, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import axios from "axios";
import StudentLayout from "./StudentLayout";

export default function Messages({ groups: initialGroups, directMessages: initialDirectMessages, residenceUsers: initialResidenceUsers, canManageGroups, user }) {
    const [activeTab, setActiveTab] = useState('groups'); // 'groups' or 'direct'
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedChatroomId, setSelectedChatroomId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [groupsData] = useState(initialGroups || []);
    const [directMessagesData] = useState(initialDirectMessages || []);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [residenceUsers] = useState(initialResidenceUsers || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const messagesEndRef = useRef(null);

    // Use Inertia form for message input state
    const { data, setData, processing } = useForm({
        message: ''
    });

    // Use Inertia form for group creation
    const { data: groupData, setData: setGroupData, post: postGroup, processing: processingGroup, reset: resetGroup, errors: groupErrors } = useForm({
        name: '',
        description: '',
        member_ids: []
    });

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Poll for new messages every 5 seconds
    useEffect(() => {
        if (!selectedChatroomId && !selectedUserId) return;

        const interval = setInterval(() => {
            if (selectedChatroomId) {
                fetchMessages(selectedChatroomId);
            } else if (selectedUserId) {
                fetchDirectMessages(selectedUserId);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedChatroomId, selectedUserId]);

    // Fetch messages for a chatroom (using web routes now)
    const fetchMessages = async (chatroomId) => {
        try {
            const response = await axios.get(`/messages/chatroom/${chatroomId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Fetch direct messages with a user (using web routes now)
    const fetchDirectMessages = async (userId) => {
        try {
            const response = await axios.get(`/messages/direct/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching direct messages:', error);
        }
    };

    const selectedGroup = selectedGroupId
        ? groupsData.find((g) => g.id === selectedGroupId)
        : null;

    const handleGroupSelect = async (group) => {
        setSelectedGroupId(group.id);
        setSelectedChatroomId(group.chatroom_id);
        setSelectedUserId(null);
        setSelectedUserName(null);

        if (group.chatroom_id) {
            setLoading(true);
            await fetchMessages(group.chatroom_id);
            setLoading(false);
        } else {
            setMessages([]);
        }
    };

    const handleUserSelect = async (user) => {
        setSelectedUserId(user.id);
        setSelectedUserName(user.name);
        setSelectedGroupId(null);
        setSelectedChatroomId(null);
        setShowNewMessageModal(false);
        setSearchQuery("");

        setLoading(true);
        await fetchDirectMessages(user.id);
        setLoading(false);
    };

    const handleDirectMessageSelect = async (conversation) => {
        setSelectedUserId(conversation.id);
        setSelectedUserName(conversation.name);
        setSelectedGroupId(null);
        setSelectedChatroomId(null);

        setLoading(true);
        await fetchDirectMessages(conversation.id);
        setLoading(false);
    };

    const handleNewMessage = () => {
        setShowNewMessageModal(true);
    };

    const handleCreateGroup = () => {
        setShowCreateGroupModal(true);
        resetGroup();
        setSelectedMembers([]);
    };

    const handleMemberToggle = (userId) => {
        setSelectedMembers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSubmitGroup = (e) => {
        e.preventDefault();

        // Update the form data with selected members
        setGroupData('member_ids', selectedMembers);

        // Use router.post to have full control over the data
        router.post('/groups', {
            name: groupData.name,
            description: groupData.description,
            member_ids: selectedMembers
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateGroupModal(false);
                resetGroup();
                setSelectedMembers([]);
                router.reload();
            },
            onError: (errors) => {
                console.error('Error creating group:', errors);
            }
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!data.message.trim()) return;
        if (!selectedChatroomId && !selectedUserId) return;

        // Prepare the payload - ensure only one of chatroom_id or receiver_id is set
        // Build object conditionally to avoid sending both
        const messageData = {
            message: data.message
        };

        if (selectedChatroomId) {
            messageData.chatroom_id = selectedChatroomId;
        } else if (selectedUserId) {
            messageData.receiver_id = selectedUserId;
        }

        console.log('Sending message:', { selectedChatroomId, selectedUserId, messageData });

        // Use router.post instead of the form's post method for more control
        router.post('/messages', messageData, {
            preserveScroll: true,
            onSuccess: () => {
                // Clear the message input
                setData('message', '');
                // Refetch messages to show the new one
                if (selectedChatroomId) {
                    fetchMessages(selectedChatroomId);
                } else if (selectedUserId) {
                    fetchDirectMessages(selectedUserId);
                }
            },
            onError: (errors) => {
                console.error('Error sending message:', errors);
                alert('Failed to send message. Please try again.');
            }
        });
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

    const filteredUsers = residenceUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentLayout>
            <Head title="Messages" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                        <p className="text-gray-600">Residence Group Communications</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {canManageGroups && (
                            <button
                                onClick={handleCreateGroup}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Create Group</span>
                            </button>
                        )}
                        <button
                            onClick={handleNewMessage}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Message</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Messages Container */}
            <div className="bg-white rounded shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
                <div className="flex h-full">
                    {/* Sidebar with Tabs */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            {/* Tabs Header */}
                            <div className="border-b border-gray-200">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('groups')}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                            activeTab === 'groups'
                                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        Groups ({groupsData.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('direct')}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                                            activeTab === 'direct'
                                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        Direct ({directMessagesData.length})
                                    </button>
                                </div>
                            </div>

                            {/* Groups Tab Content */}
                            {activeTab === 'groups' && (
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
                            )}

                            {/* Direct Messages Tab Content */}
                            {activeTab === 'direct' && (
                                <div className="flex-1 overflow-y-auto">
                                    {directMessagesData.length > 0 ? directMessagesData.map((conversation) => (
                                        <div
                                            key={conversation.id}
                                            onClick={() => handleDirectMessageSelect(conversation)}
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedUserId === conversation.id
                                                    ? "bg-purple-50 border-l-4 border-l-purple-500"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                                                    {getInitials(conversation.name)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {conversation.name}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            {conversation.unreadCount > 0 && (
                                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    {conversation.unreadCount}
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-gray-500">
                                                                {conversation.lastMessageTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {conversation.lastMessage}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {conversation.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-gray-500">
                                            <p className="mb-2">No direct messages yet</p>
                                            <p className="text-sm">Click "New Message" to start a conversation</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Messages Area */}
                        <div className="w-2/3 flex flex-col">
                            {selectedGroup || selectedUserId ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600">
                                                {getInitials(selectedGroup ? selectedGroup.name : selectedUserName)}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-bold text-gray-900">
                                                    {selectedGroup ? selectedGroup.name : selectedUserName}
                                                </h2>
                                                <p className="text-sm text-gray-600">
                                                    {selectedGroup
                                                        ? `${selectedGroup.description} • ${selectedGroup.members} members`
                                                        : 'Direct Message'
                                                    }
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
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData('message', e.target.value)
                                                }
                                                placeholder="Type your message..."
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!data.message.trim() || processing}
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
                                            Select a Group or Start a New Message
                                        </h3>
                                        <p className="text-gray-500">
                                            Choose a group from the sidebar or click "New Message" to chat with someone
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[600px] overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">New Message</h2>
                            <button
                                onClick={() => {
                                    setShowNewMessageModal(false);
                                    setSearchQuery("");
                                }}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-200">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                            />
                        </div>

                        {/* Users List */}
                        <div className="overflow-y-auto max-h-[400px]">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserSelect(user)}
                                        className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
                                                {getInitials(user.name)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    {searchQuery ? (
                                        <p>No users found matching "{searchQuery}"</p>
                                    ) : (
                                        <p>No users available in your residence</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateGroupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Group</h2>

                        <form onSubmit={handleSubmitGroup}>
                            <div className="space-y-4">
                                {/* Group Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Group Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={groupData.name}
                                        onChange={e => setGroupData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                                        required
                                        placeholder="e.g., Floor 2 Group, Study Group"
                                    />
                                    {groupErrors.name && <p className="text-red-600 text-sm mt-1">{groupErrors.name}</p>}
                                </div>

                                {/* Group Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={groupData.description}
                                        onChange={e => setGroupData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                                        rows="3"
                                        placeholder="Optional description for the group"
                                    />
                                    {groupErrors.description && <p className="text-red-600 text-sm mt-1">{groupErrors.description}</p>}
                                </div>

                                {/* Member Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Members * (Select at least one)
                                    </label>
                                    <div className="border border-gray-300 rounded max-h-64 overflow-y-auto">
                                        {residenceUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleMemberToggle(user.id)}
                                                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                                                    selectedMembers.includes(user.id) ? 'bg-green-50' : ''
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(user.id)}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                />
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                                    </p>
                                    {groupErrors.member_ids && <p className="text-red-600 text-sm mt-1">{groupErrors.member_ids}</p>}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={processingGroup || selectedMembers.length === 0}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processingGroup ? 'Creating...' : 'Create Group'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateGroupModal(false);
                                        resetGroup();
                                        setSelectedMembers([]);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
