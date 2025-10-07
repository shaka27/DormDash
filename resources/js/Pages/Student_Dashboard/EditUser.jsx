import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function EditUser({ user, roles }) {
  // Get the user's first role if they have one
  const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : null;

  const { data, setData, put, processing, errors } = useForm({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    role_id: userRole ? userRole.id : "",
    contact_num: user.contact_num || "",
    gender: user.gender || "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...data,
      role_id: data.role_id === "" ? null : parseInt(data.role_id), // 👈 convert to integer
    };

    put(route("users.update", user.id), { data: payload });
  }

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <Head title={`Edit User - ${user.first_name} ${user.last_name}`} />

        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-6 text-gray-700">
            Edit User Information
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-gray-600">First Name</label>
              <input
                type="text"
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-600">Last Name</label>
              <input
                type="text"
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                value={data.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-gray-600">Contact Number</label>
              <input
                type="text"
                value={data.contact_num}
                onChange={(e) => setData("contact_num", e.target.value)}
                placeholder="e.g. 082 123 4567"
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.contact_num && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact_num}
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
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-600">Role</label>
              <select
                value={data.role_id}
                onChange={(e) => setData("role_id", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select a role</option>
                {roles && roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.description}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
              )}
            </div>

            {/* Password (Optional) */}
            <div>
              <label className="block text-gray-600">New Password (optional)</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <Link
                href={route("users.index")}
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
    </StudentLayout>
  );
}