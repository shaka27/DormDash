import React from 'react';

const Welcome: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🏠 DormDash
                    </h1>
                    <div className="w-16 h-1 bg-indigo-500 mx-auto mb-6"></div>
                    <p className="text-gray-600 mb-4">
                        Your React + TypeScript + Laravel app is working perfectly!
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm font-medium">
                            ✅ React with TypeScript
                        </p>
                        <p className="text-green-800 text-sm font-medium">
                            ✅ Laravel Backend
                        </p>
                        <p className="text-green-800 text-sm font-medium">
                            ✅ Tailwind CSS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
