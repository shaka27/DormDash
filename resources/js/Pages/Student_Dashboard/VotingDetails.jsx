// resources/js/Pages/VotingDetails.jsx
import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function VotingDetails({ vote, userVote }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data, setData, post, processing } = useForm({
    vote_option_id: userVote?.option_id || null
  });

  const handleVoteSelection = (optionId) => {
    if (userVote) return; // User already voted
    setData('vote_option_id', optionId);
  };

  const handleSubmitVote = () => {
    if (!data.vote_option_id) return;
    setShowConfirmation(true);
  };

  const confirmVote = () => {
    post(route('voting-centre.submit', vote.id), {
      onSuccess: () => {
        setShowConfirmation(false);
      }
    });
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

  const selectedOption = vote.options?.find(o => o.id === data.vote_option_id);

  return (
    <StudentLayout>
      <Head title={`Voting - ${vote.title}`} />
      
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">🗳️</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{vote.title}</h1>
              <p className="text-sm text-gray-600">Cast your vote or view details</p>
            </div>
          </div>
          <Link
            href={route('voting-centre.index')}
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
      <div className="space-y-6">
        {/* Vote Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vote.status === 'active' ? 'bg-green-100 text-green-800' :
                  vote.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {vote.status.charAt(0).toUpperCase() + vote.status.slice(1)}
                </span>
                {userVote && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ You have voted
                  </span>
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                Ends: {formatDate(vote.end_date)}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{vote.description}</p>

            {/* Voting Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total Votes</div>
                <div className="text-2xl font-bold text-gray-900">{vote.totalVotes}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Options</div>
                <div className="text-2xl font-bold text-gray-900">{vote.options?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Options</h2>
          {vote.options?.map((option) => (
            <div
              key={option.id}
              className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all ${
                data.vote_option_id === option.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${userVote || vote.status !== 'active' ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
              onClick={() => handleVoteSelection(option.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{option.option_text}</h3>
                      {option.user && (
                        <p className="text-sm text-gray-600">Proposed by: {option.user.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{option.votes}</div>
                      <div className="text-sm text-gray-500">votes</div>
                    </div>
                  </div>
                </div>

                {data.vote_option_id === option.id && !userVote && vote.status === 'active' && (
                  <div className="text-purple-600 ml-4">
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
        {!userVote && vote.status === 'active' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                {selectedOption ? (
                  <p className="text-gray-700">
                    You have selected: <span className="font-semibold">{selectedOption.option_text}</span>
                  </p>
                ) : (
                  <p className="text-gray-500">Select an option to cast your vote</p>
                )}
              </div>
              <button
                onClick={handleSubmitVote}
                disabled={!data.vote_option_id || processing}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {processing ? 'Submitting...' : 'Cast Vote'}
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
                  Are you sure you want to vote for <span className="font-semibold">{selectedOption?.option_text}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone once submitted.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={confirmVote}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {processing ? 'Submitting...' : 'Confirm Vote'}
                </button>
                <button
                  onClick={cancelVote}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {userVote && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-medium">Your vote has been successfully recorded!</p>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}