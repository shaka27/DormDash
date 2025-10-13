import React, { ChangeEvent, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function New_Login() {
  const { data, setData, post, processing, errors } = useForm<LoginFormValues>({
    email: "",
    password: "",
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData(e.target.name as keyof LoginFormValues, e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting form...');
    post("/login", {
      onError: (errors) => {
        console.log('Login errors:', errors);
      },
      onSuccess: () => {
        console.log('Login successful!');
      }
    });
  };

  return (
    <>
      <Head title="Login" />
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Welcome Back</h1>
          <p className="text-center text-gray-500 mb-8">Please sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-purple-600 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
}
