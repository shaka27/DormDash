// resources/js/Pages/EditProfile.jsx
import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function EditProfile({ user }) {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const formatDateForInput = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    // Form data with default values from user prop
    const { data, setData, patch, processing, errors, reset } = useForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        contact_num: user?.contact_num || '',
        student_number: user?.student_number || '',
        gender: user?.gender || '',
        move_in_date: formatDateForInput(user?.move_in_date),
        expected_move_out: formatDateForInput(user?.expected_move_out),
        emergency_contact_name: user?.emergency_contact_name || '',
        emergency_contact_phone: user?.emergency_contact_phone || '',
        emergency_contact_relation: user?.emergency_contact_relation || '',
    });

    // Password change form
    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => {
                // Profile updated successfully, redirect is handled by controller
            },
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword(route('password.update'), {
            onSuccess: () => {
                resetPassword();
                setShowPasswordForm(false);
                console.log('Password updated successfully');
            }
        });
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <StudentLayout>
            <Head title="Edit Profile" />
            
            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                        <p className="text-gray-600">Update your personal information and preferences</p>
                    </div>
                    <Link
                        href={route('profile.index')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Profile</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
                        
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-600 mb-4 overflow-hidden">
                                {getInitials(data.first_name, data.last_name)}
                            </div>
                            <p className="text-sm text-gray-500 text-center">Profile pictures coming soon</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded shadow-sm p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="w-full text-left px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">🔒</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Change Password</p>
                                        <p className="text-sm text-gray-500">Update your account password</p>
                                    </div>
                                </div>
                            </button>
                            
                        </div>
                    </div>
                </div>

                {/* Main Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={e => setData('first_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={e => setData('last_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        value={data.gender}
                                        onChange={e => setData('gender', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.contact_num}
                                        onChange={e => setData('contact_num', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.contact_num && <p className="text-red-500 text-sm mt-1">{errors.contact_num}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Residence Information */}
                        <div className="bg-white rounded shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Residence Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Student Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.student_number}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Student number cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Residence
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.residence?.name || 'Not assigned'}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Contact management to change residence</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Room Number
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.room?.number || 'Not assigned'}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Contact management to change room</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Move-in Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.move_in_date}
                                        onChange={e => setData('move_in_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.move_in_date && <p className="text-red-500 text-sm mt-1">{errors.move_in_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expected Move-out Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.expected_move_out}
                                        onChange={e => setData('expected_move_out', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.expected_move_out && <p className="text-red-500 text-sm mt-1">{errors.expected_move_out}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white rounded shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_name}
                                        onChange={e => setData('emergency_contact_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.emergency_contact_name && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.emergency_contact_phone}
                                        onChange={e => setData('emergency_contact_phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.emergency_contact_phone && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_phone}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Relationship
                                    </label>
                                    <select
                                        value={data.emergency_contact_relation}
                                        onChange={e => setData('emergency_contact_relation', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select Relationship</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Father">Father</option>
                                        <option value="Guardian">Guardian</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.emergency_contact_relation && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_relation}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="bg-white rounded shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    * Required fields
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('profile.index')}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                            <button 
                                onClick={() => setShowPasswordForm(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={e => setPasswordData('current_password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    {passwordErrors.current_password && <p className="text-red-500 text-sm mt-1">{passwordErrors.current_password}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.new_password}
                                        onChange={e => setPasswordData('new_password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    {passwordErrors.new_password && <p className="text-red-500 text-sm mt-1">{passwordErrors.new_password}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.new_password_confirmation}
                                        onChange={e => setPasswordData('new_password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    {passwordErrors.new_password_confirmation && <p className="text-red-500 text-sm mt-1">{passwordErrors.new_password_confirmation}</p>}
                                </div>
                            </div>
                            
                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
                                >
                                    {passwordProcessing ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}