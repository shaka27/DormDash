import React, { useEffect, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function UserManagement() {
    const { auth } = usePage().props;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const userRoles = auth.user?.roles?.map(role => role.description) || [];
    const isAdmin = userRoles.includes("Admin") || userRoles.includes("HouseParent");

    // Fetch users from backend
    useEffect(() => {
        fetch("/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }, []);

    // Delete a user
    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        router.delete(`/users/${id}`, {
            onSuccess: () => setUsers(users.filter(user => user.id !== id)),
        });
    };

    // Filter users
    const filteredUsers = users.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.student_number.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <StudentLayout>
            <Head title="User Management" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="bg-white rounded shadow-sm p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">
                            Manage all registered users in your residence system.
                        </p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/register"
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                        >
                            + Add New User
                        </Link>
                    )}
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search by name, email or student number..."
                        className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* User Table */}
                <div className="bg-white rounded shadow-sm overflow-x-auto">
                    {loading ? (
                        <p className="text-center py-6 text-gray-500">Loading users...</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-center py-6 text-gray-500">No users found.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.student_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{user.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.contact_num}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 space-x-2">
                                           
                                            {isAdmin && (
                                                <>
                                                   <Link href={route('users.edit', user.id)}>
                                                    <button className="text-blue-600 hover:underline">Edit</button>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
