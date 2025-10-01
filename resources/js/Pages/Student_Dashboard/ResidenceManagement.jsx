// resources/js/Pages/Student_Dashboard/ResidenceManagement.jsx
import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function ResidenceManagement({ residence, users, accessList, roles }) {
    const [showAddAccessForm, setShowAddAccessForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_number: '',
        role: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('residence-management.access.add'), {
            onSuccess: () => {
                reset();
                setShowAddAccessForm(false);
            },
        });
    };

    const handleDeleteAccess = (id) => {
        if (confirm('Are you sure you want to remove this access entry?')) {
            router.delete(route('residence-management.access.delete', id));
        }
    };

    return (
        <StudentLayout>
            <Head title="Residence Management" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Residence Management</h1>
                        <p className="text-gray-600">Manage residence information and user access</p>
                    </div>
                </div>
            </div>

            {/* Residence Information */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Residence Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Residence Name</p>
                        <p className="text-lg font-medium text-gray-900">{residence.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Campus</p>
                        <p className="text-lg font-medium text-gray-900">{residence.campus?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-lg font-medium text-gray-900">{users.length}</p>
                    </div>
                </div>
            </div>

            {/* Access Management Section */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Access Management</h2>
                    <button
                        onClick={() => setShowAddAccessForm(!showAddAccessForm)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
                    >
                        {showAddAccessForm ? 'Cancel' : 'Add New Access'}
                    </button>
                </div>

                {/* Add Access Form */}
                {showAddAccessForm && (
                    <form onSubmit={handleSubmit} className="bg-gray-50 rounded p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Student Number
                                </label>
                                <input
                                    type="text"
                                    value={data.student_number}
                                    onChange={(e) => setData('student_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter student number"
                                    required
                                />
                                {errors.student_number && (
                                    <p className="text-red-600 text-sm mt-1">{errors.student_number}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.description}>
                                            {role.description}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="text-red-600 text-sm mt-1">{errors.role}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add Access'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Access List Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Has Registered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Added Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {accessList.length > 0 ? (
                                accessList.map((access) => (
                                    <tr key={access.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {access.student_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {access.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {access.has_registered ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {access.created_at}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteAccess(access.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No access entries found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registered Users Table */}
            <div className="bg-white rounded shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.student_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.roles || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.created_at}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No registered users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );
}
