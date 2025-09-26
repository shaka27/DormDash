// resources/js/Pages/VotingDetails.jsx
import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";

export default function VotingDetails({ election, userVote }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock election data if not provided
  const electionData = election || {
    id: 1,
    title: "House Captain Elections 2024",
    description: "Vote for your residence house captain who will represent your interests and lead various residence activities. The house captain will serve for a full academic year and will be responsible for organizing events, representing student interests to management, and fostering a positive residence community.",
    status: "active",
    deadline: "2024-09-15",
    totalVotes: 156,
    eligibleVoters: 200,
    hasVoted: false,
    type: "candidate",
    icon: "👑",
    candidates: [
      {
        id: 1,
        name: "Alex Thompson",
        year: "3rd Year",
        course: "Computer Science",
        manifesto: "I will focus on improving wifi connectivity, organizing more social events, and establishing a 24/7 study space. My experience as class representative has taught me how to effectively communicate student needs to management.",
        votes: 45,
        image: "AT",
        experience: "Class Representative (2 years), Debate Society President",
        goals: ["Improve WiFi infrastructure", "24/7 study spaces", "Monthly social events", "Better communication with management"]
      },
      {
        id: 2,
        name: "Maria Santos",
        year: "2nd Year",
        course: "Business Administration",
        manifesto: "My priorities include better dining hall food options, enhanced security measures, and monthly town halls. I believe in transparent leadership and regular communication with all residents.",
        votes: 38,
        image: "MS",
        experience: "Student Council Member, Volunteer Coordinator",
        goals: ["Improve dining hall options", "Enhanced security", "Monthly town halls", "Transparent communication"]
      },
      {
        id: 3,
        name: "David Kim",
        year: "4th Year",
        course: "Engineering",
        manifesto: "I will work on reducing residence fees, improving maintenance response times, and creating study groups. As a senior student, I understand the challenges residents face.",
        votes: 42,
        image: "DK",
        experience: "Residence Assistant (1 year), Engineering Society Treasurer",
        goals: ["Reduce residence fees", "Faster maintenance response", "Study group programs", "Peer mentoring system"]
      }
    ]
  };

  const handleVoteSelection = (candidateId) => {
    if (electionData.hasVoted || hasVoted) return;
    setSelectedOption(candidateId);
  };

  const handleSubmitVote = () => {
    if (!selectedOption) return;
    setShowConfirmation(true);
  };

  const confirmVote = () => {
    // This would typically make an API call to submit the vote
    console.log(`Submitting vote for candidate ${selectedOption} in election ${electionData.id}`);
    setHasVoted(true);
    setShowConfirmation(false);
    // In a real app, you would also update the backend and refresh the data
  };

  const cancelVote = () => {
    setShowConfirmation(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVotingProgress = (totalVotes, eligibleVoters) => {
    return Math.round((totalVotes / eligibleVoters) * 100);
  };

  const selectedCandidate = electionData.candidates?.find(c => c.id === selectedOption);
  const userHasVoted = electionData.hasVoted || hasVoted;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head title={`Voting - ${electionData.title}`} />
      
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{electionData.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{electionData.title}</h1>
              <p className="text-sm text-gray-600">Cast your vote or view details</p>
            </div>
          </div>
          <Link 
            href="/VotingCentre" 
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Voting Centre</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Election Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
                {userHasVoted && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ You have voted
                  </span>
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                Deadline: {formatDate(electionData.deadline)}
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">{electionData.description}</p>
            
            {/* Voting Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total Votes</div>
                <div className="text-2xl font-bold text-gray-900">{electionData.totalVotes}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Eligible Voters</div>
                <div className="text-2xl font-bold text-gray-900">{electionData.eligibleVoters}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Participation</div>
                <div className="text-2xl font-bold text-gray-900">{getVotingProgress(electionData.totalVotes, electionData.eligibleVoters)}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${getVotingProgress(electionData.totalVotes, electionData.eligibleVoters)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Candidates */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Candidates</h2>
          {electionData.candidates?.map((candidate) => (
            <div 
              key={candidate.id}
              className={`bg-white rounded-lg shadow-sm p-6 border-2 cursor-pointer transition-all ${
                selectedOption === candidate.id 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${userHasVoted ? 'cursor-not-allowed opacity-75' : ''}`}
              onClick={() => handleVoteSelection(candidate.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-xl font-bold text-purple-600">
                  {candidate.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.year} • {candidate.course}</p>
                      <p className="text-sm text-gray-500">{candidate.experience}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{candidate.votes}</div>
                      <div className="text-sm text-gray-500">votes</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{candidate.manifesto}</p>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Goals:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {candidate.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {selectedOption === candidate.id && !userHasVoted && (
                  <div className="text-purple-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vote Button */}
        {!userHasVoted && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                {selectedOption ? (
                  <p className="text-gray-700">
                    You have selected: <span className="font-semibold">{selectedCandidate?.name}</span>
                  </p>
                ) : (
                  <p className="text-gray-500">Select a candidate to cast your vote</p>
                )}
              </div>
              <button
                onClick={handleSubmitVote}
                disabled={!selectedOption}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cast Vote
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Your Vote</h3>
                <p className="text-gray-600">
                  Are you sure you want to vote for <span className="font-semibold">{selectedCandidate?.name}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone once submitted.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={confirmVote}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Confirm Vote
                </button>
                <button
                  onClick={cancelVote}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {userHasVoted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-medium">Your vote has been successfully recorded!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}