import React from "react";
import { Head, router } from "@inertiajs/react";

interface Residence {
  id: number;
  name: string;
  campus_id?: number;
}

interface Props {
  residences: Residence[];
}

export default function ResidenceOverview({ residences }: Props) {
  const handleSelectResidence = (residenceId: number) => {
    router.post("/residence/select", { residence_id: residenceId });
  };

  return (
    <>
      <Head title="Select Residence" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              Residence Overview
            </h1>
            <p className="text-gray-600 text-lg">
              Select a residence to manage
            </p>
          </div>

          {/* Residence Grid */}
          {residences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {residences.map((residence) => (
                <div
                  key={residence.id}
                  onClick={() => handleSelectResidence(residence.id)}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-purple-400"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-purple-700 mb-2">
                      {residence.name}
                    </h3>
                    <p className="text-sm text-gray-500">Click to select</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                No residences available
              </p>
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.post("/logout")}
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}