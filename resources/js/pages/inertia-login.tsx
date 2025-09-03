import React from "react";
import { Head } from "@inertiajs/react";

export default function Login() {
  return (
    <>
      <Head title="Login" />
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Please sign in to your account
          </p>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="••••••••"
              />
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
