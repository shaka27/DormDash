import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";
import { ArrowLeft } from "lucide-react";

export default function EditEvent({ event }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form with existing event data
    useEffect(() => {
        if (event) {
            setFormData({
                name: event.name || "",
                description: event.description || "",
                date: event.date || "",
                location: event.location || "",
            });
        }
    }, [event]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.put(`/events/${event.id}`, formData, {
            onError: (err) => {
                setErrors(err);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsSubmitting(false);
            },
        });
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            router.delete(`/events/${event.id}`, {
                onSuccess: () => {
                    // Redirect after successful deletion
                },
                onError: () => {
                    alert("Failed to delete the event. Please try again.");
                },
            });
        }
    };

    const handleCancel = () => {
        router.visit("/events");
    };

    return (
        <StudentLayout>
            <Head title="Edit Event" />

            {/* Page Header */}
            <div className="bg-white rounded shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Edit Event
                            </h1>
                            <p className="text-gray-600">
                                Update event details below.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Event Form */}
            <div className="bg-white rounded shadow-sm p-6 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Enter event name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows="4"
                            placeholder="Describe the event..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Event location"
                            />
                            {errors.location && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.location}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-2 rounded text-white font-medium bg-red-600 hover:bg-red-700 transition-colors"
                        >
                            Delete Event
                        </button>
                        
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 rounded text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded text-white font-medium ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                }`}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </StudentLayout>
    );
}