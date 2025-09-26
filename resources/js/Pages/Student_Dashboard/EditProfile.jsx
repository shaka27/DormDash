// resources/js/Pages/EditProfile.jsx
import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function EditProfile({ user }) {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Form data with default values
    const { data, setData, put, processing, errors, reset } = useForm({
        first_name: user?.first_name || 'John',
        last_name: user?.last_name || 'Doe',
        email: user?.email || 'john.doe@student.university.ac.za',
        phone: user?.phone || '+27 82 123 4567',
        student_number: user?.student_number || 'ST2024001',
        course: user?.course || 'Computer Science',
        year_of_study: user?.year_of_study || '2nd Year',
        residence: user?.residence || 'Mandela Hall',
        room_number: user?.room_number || 'A204',
        emergency_contact_name: user?.emergency_contact_name || 'Jane Doe',
        emergency_contact_phone: user?.emergency_contact_phone || '+27 82 987 6543',
        emergency_contact_relationship: user?.emergency_contact_relationship || 'Mother',
        date_of_birth: user?.date_of_birth || '2002-03-15',
        gender: user?.gender || 'male',
        nationality: user?.nationality || 'South African',
        home_address: user?.home_address || '123 Main Street, Cape Town, 8001'
    });

    // Password change form
    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('profile.update'), {
            onSuccess: () => {
                // Handle success - maybe show a toast notification
                console.log('Profile updated successfully');
            }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                        href="/Profile" 
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
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(data.first_name, data.last_name)
                                )}
                            </div>
                            
                        
                            
                            <label
                                htmlFor="profile-image"
                                className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-purple-300 transition-colors mb-2"
                            >
                            </label>
                            
                        
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
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={e => setData('date_of_birth', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
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
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nationality
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nationality}
                                        onChange={e => setData('nationality', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
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
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Home Address
                                    </label>
                                    <textarea
                                        value={data.home_address}
                                        onChange={e => setData('home_address', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="bg-white rounded shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Student Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.student_number}
                                        onChange={e => setData('student_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Student number cannot be changed</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course/Degree
                                    </label>
                                    <input
                                        type="text"
                                        value={data.course}
                                        onChange={e => setData('course', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Year of Study
                                    </label>
                                    <select
                                        value={data.year_of_study}
                                        onChange={e => setData('year_of_study', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="Postgraduate">Postgraduate</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Residence
                                    </label>
                                    <input
                                        type="text"
                                        value={data.residence}
                                        onChange={e => setData('residence', e.target.value)}
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
                                        value={data.room_number}
                                        onChange={e => setData('room_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Contact management to change room</p>
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
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Relationship
                                    </label>
                                    <select
                                        value={data.emergency_contact_relationship}
                                        onChange={e => setData('emergency_contact_relationship', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="Parent">Parent</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Father">Father</option>
                                        <option value="Guardian">Guardian</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Other">Other</option>
                                    </select>
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
                                        href="/Profile"
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