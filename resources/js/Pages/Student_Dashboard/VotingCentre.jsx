// resources/js/Pages/VotingCentre.jsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function VotingCentre({ elections }) {
  // Mock data if not provided
  const electionsData = elections || [
    {
      id: 1,
      title: "House Captain Elections 2024",
      description: "Vote for your residence house captain who will represent your interests and lead various residence activities.",
      status: "active",
      deadline: "2024-09-15",
      totalVotes: 156,
      eligibleVoters: 200,
      hasVoted: false,
      type: "candidate",
      icon: "👑"
    },
    {
      id: 2,
      title: "Entertainment Committee Head",
      description: "Choose who will organize and coordinate all entertainment and social events for the residence.",
      status: "active",
      deadline: "2024-09-18",
      totalVotes: 89,
      eligibleVoters: 200,
      hasVoted: true,
      type: "candidate",
      icon: "🎉"
    },
    {
      id: 3,
      title: "Residence Constitution Amendment",
      description: "Vote on the proposed changes to the residence constitution regarding quiet hours and guest policies.",
      status: "active",
      deadline: "2024-09-25",
      totalVotes: 45,
      eligibleVoters: 200,
      hasVoted: false,
      type: "referendum",
      icon: "📜"
    },
    {
      id: 4,
      title: "New Gym Equipment Purchase",
      description: "Decide which gym equipment should be purchased with the allocated residence budget.",
      status: "upcoming",
      deadline: "2024-10-01",
      totalVotes: 0,
      eligibleVoters: 200,
      hasVoted: false,
      type: "budget",
      icon: "🏋️"
    },
    {
      id: 5,
      title: "Dining Hall Menu Changes",
      description: "Vote on proposed changes to the weekly dining hall menu including vegetarian and halal options.",
      status: "ended",
      deadline: "2024-08-30",
      totalVotes: 187,
      eligibleVoters: 200,
      hasVoted: true,
      type: "policy",
      icon: "🍽️"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "ended": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active": return "Active";
      case "upcoming": return "Upcoming";
      case "ended": return "Ended";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getVotingProgress = (totalVotes, eligibleVoters) => {
    return Math.round((totalVotes / eligibleVoters) * 100);
  };

  return (
    <StudentLayout>
      <Head title="Voting Centre" />
      
      {/* Page Header */}
      <div className="bg-white rounded shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voting Centre</h1>
            <p className="text-gray-600">Participate in residence elections and referendums</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {electionsData.filter(e => e.status === 'active' && !e.hasVoted).length} Available
            </span>
          </div>
        </div>
      </div>

      {/* Voting Items List */}
      <div className="space-y-4">
        {electionsData.map((election) => (
          <div key={election.id} className="bg-white rounded shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{election.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                        {getStatusText(election.status)}
                      </span>
                      {election.hasVoted && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          ✓ Voted
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{election.description}</p>
                    
                    {/* Election Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <span className="mr-1">🗓️</span>
                        Deadline: {formatDate(election.deadline)}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-1">👥</span>
                        {election.totalVotes} / {election.eligibleVoters} voted
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-1">📊</span>
                        {getVotingProgress(election.totalVotes, election.eligibleVoters)}% participation
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${getVotingProgress(election.totalVotes, election.eligibleVoters)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                {election.status === 'active' ? (
                  <Link 
                    href={`/VotingDetails/${election.id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-purple-300 transition-colors text-center"
                  >
                    Details
                  </Link>
                ) : election.status === 'ended' ? (
                  <Link 
                    href={`/VotingDetails/${election.id}`}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded text-sm text-center"
                  >
                    Results
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="px-4 py-2 bg-gray-100 text-gray-400 rounded text-sm cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {electionsData.length === 0 && (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <span className="text-6xl mb-4 block">🗳️</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Elections Available</h3>
          <p className="text-gray-500 mb-6">There are no elections or votes scheduled at this time.</p>
        </div>
      )}
    </StudentLayout>
  );
}

