import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";

export default function EditUser({ user }) {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "",
    contact_number: user.contact_number || "",
    gender: user.gender || "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    put(route("users.update", user.id));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head title={`Edit User - ${user.name}`} />

      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          Edit User Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-600">Contact Number</label>
            <input
              type="text"
              value={data.contact_number}
              onChange={(e) => setData("contact_number", e.target.value)}
              placeholder="e.g. 082 123 4567"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact_number}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-600">Gender</label>
            <select
              value={data.gender}
              onChange={(e) => setData("gender", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-600">Role</label>
            <select
              value={data.role}
              onChange={(e) => setData("role", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="house_parent">House Parent</option>
              <option value="committee">Committee</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Link
              href={route("user-management.index")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </Link>

            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {processing ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
