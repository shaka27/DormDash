// resources/js/Pages/VotingCentre.jsx
import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function VotingCentre({ votes, canManageVotes }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVote, setEditingVote] = useState(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    options: [
      { option_text: '', user_id: null },
      { option_text: '', user_id: null }
    ]
  });

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

  const handleCreateVote = () => {
    setShowCreateModal(true);
    reset();
  };

  const handleEditVote = (vote) => {
    setEditingVote(vote);
    setData({
      title: vote.title,
      description: vote.description,
      start_date: vote.start_date,
      end_date: vote.end_date,
      options: vote.options || [
        { option_text: '', user_id: null },
        { option_text: '', user_id: null }
      ]
    });
    setShowCreateModal(true);
  };

  const handleDeleteVote = (voteId) => {
    if (confirm('Are you sure you want to delete this vote?')) {
      router.delete(route('voting-centre.destroy', voteId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingVote) {
      put(route('voting-centre.update', editingVote.id), {
        onSuccess: () => {
          setShowCreateModal(false);
          setEditingVote(null);
          reset();
        }
      });
    } else {
      post(route('voting-centre.store'), {
        onSuccess: () => {
          setShowCreateModal(false);
          reset();
        }
      });
    }
  };

  const addOption = () => {
    setData('options', [...data.options, { option_text: '', user_id: null }]);
  };

  const removeOption = (index) => {
    if (data.options.length > 2) {
      const newOptions = data.options.filter((_, i) => i !== index);
      setData('options', newOptions);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...data.options];
    newOptions[index][field] = value;
    setData('options', newOptions);
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
              {votes.filter(e => e.status === 'active' && !e.hasVoted).length} Available
            </span>
            {canManageVotes && (
              <button
                onClick={handleCreateVote}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                Create Vote
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Voting Items List */}
      <div className="space-y-4">
        {votes.map((vote) => (
          <div key={vote.id} className="bg-white rounded shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🗳️</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{vote.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vote.status)}`}>
                        {getStatusText(vote.status)}
                      </span>
                      {vote.hasVoted && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          ✓ Voted
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{vote.description}</p>

                    {/* Vote Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <span className="mr-1">🗓️</span>
                        Ends: {formatDate(vote.end_date)}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="mr-1">👥</span>
                        {vote.totalVotes} votes cast
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <Link
                  href={route('voting-centre.details', vote.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-purple-300 transition-colors text-center"
                >
                  {vote.status === 'ended' ? 'Results' : 'Details'}
                </Link>
                {canManageVotes && (
                  <>
                    <button
                      onClick={() => handleEditVote(vote)}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVote(vote.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {votes.length === 0 && (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <span className="text-6xl mb-4 block">🗳️</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Elections Available</h3>
          <p className="text-gray-500 mb-6">There are no elections or votes scheduled at this time.</p>
        </div>
      )}

      {/* Create/Edit Vote Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingVote ? 'Edit Vote' : 'Create New Vote'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    rows="3"
                    required
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={data.start_date}
                      onChange={e => setData('start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                    {errors.start_date && <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={data.end_date}
                      onChange={e => setData('end_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                    {errors.end_date && <p className="text-red-600 text-sm mt-1">{errors.end_date}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options (minimum 2)</label>
                  {data.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={option.option_text}
                        onChange={e => updateOption(index, 'option_text', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {data.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {errors.options && <p className="text-red-600 text-sm mt-1">{errors.options}</p>}
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Add Option
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {processing ? 'Saving...' : editingVote ? 'Update Vote' : 'Create Vote'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingVote(null);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}

