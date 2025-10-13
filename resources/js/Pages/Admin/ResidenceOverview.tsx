import React, { useState } from "react"; // **Import useState**
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
  // **NEW**: State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [selectedResidence, setSelectedResidence] = useState<Residence | null>(null);

  const handleSelectResidence = (residenceId: number) => {
    router.post("/residence/select", { residence_id: residenceId });
  };

  // **NEW**: Handlers for the notification modal
  const handleOpenModal = (residence: Residence) => {
    setSelectedResidence(residence);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResidence(null);
    setNotificationTitle('');
    setNotificationMessage('');
  };

  const handleSendNotification = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim() || !selectedResidence) {
      alert('Please provide a title and message.');
      return;
    }
    // In a real app, this would be an API call, e.g., router.post('/residence/broadcast', { ... });
    console.log(`Broadcasting to ${selectedResidence.name}:`);
    console.log(`Title: ${notificationTitle}`);
    console.log(`Message: ${notificationMessage}`);
    
    // Provide feedback and close modal
    alert(`Notification for ${selectedResidence.name} has been sent!`);
    handleCloseModal();
  };

  return (
    <>
      <Head title="Select Residence" />

      {/* **NEW**: Notification Modal */}
      {isModalOpen && selectedResidence && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md m-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Broadcast to {selectedResidence.name}
            </h2>
            <div className="space-y-4">
              <input
                  type="text"
                  placeholder="Notification Title"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                  placeholder="Enter your message..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={5}
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleSendNotification} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              Residence Overview
            </h1>
            <p className="text-gray-600 text-lg">
              Select a residence to manage or broadcast to
            </p>
          </div>

          {/* Residence Grid */}
          {residences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {residences.map((residence) => (
                <div
                  key={residence.id}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-400 flex flex-col"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-purple-700 mb-2">
                      {residence.name}
                    </h3>
                  </div>

                  {/* **MODIFIED**: Action buttons */}
                  <div className="mt-auto pt-4 flex justify-around border-t">
                    <button
                      onClick={() => handleSelectResidence(residence.id)}
                      className="text-purple-600 hover:text-purple-800 font-medium transition-colors text-sm"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleOpenModal(residence)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                    >
                      Broadcast
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <p className="text-gray-500 text-lg">No residences available</p>
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
