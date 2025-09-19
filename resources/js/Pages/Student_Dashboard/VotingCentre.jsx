// resources/js/Pages/VotingCentre.jsx
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import StudentLayout from "./StudentLayout";

export default function VotingCentre({ elections, userVotes }) {
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [votingStatus, setVotingStatus] = useState({});

  // Mock data if not provided
  const electionsData = elections || [
    {
      id: 1,
      title: "House Captain Elections 2024",
      description:
        "Vote for your residence house captain who will represent your interests and lead various residence activities.",
      status: "active",
      deadline: "2024-09-15",
      totalVotes: 156,
      eligibleVoters: 200,
      hasVoted: false,
      candidates: [
        {
          id: 1,
          name: "Alex Thompson",
          year: "3rd Year",
          course: "Computer Science",
          manifesto:
            "I will focus on improving wifi connectivity, organizing more social events, and establishing a 24/7 study space.",
          votes: 45,
        },
        {
          id: 2,
          name: "Maria Santos",
          year: "2nd Year",
          course: "Business Administration",
          manifesto:
            "My priorities include better dining hall food options, enhanced security measures, and monthly town halls.",
          votes: 38,
        },
        {
          id: 3,
          name: "David Kim",
          year: "4th Year",
          course: "Engineering",
          manifesto:
            "I will work on reducing residence fees, improving maintenance response times, and creating study groups.",
          votes: 42,
        },
      ],
    },
    {
      id: 2,
      title: "Entertainment Committee Head",
      description:
        "Choose who will organize and coordinate all entertainment and social events for the residence.",
      status: "active",
      deadline: "2024-09-18",
      totalVotes: 89,
      eligibleVoters: 200,
      hasVoted: true,
      candidates: [
        {
          id: 4,
          name: "Sophie Wilson",
          year: "2nd Year",
          course: "Event Management",
          manifesto:
            "Monthly themed parties, talent shows, movie nights, and outdoor adventure trips.",
          votes: 32,
        },
        {
          id: 5,
          name: "James Rodriguez",
          year: "3rd Year",
          course: "Music Production",
          manifesto:
            "DJ nights, live music events, karaoke competitions, and cultural celebration events.",
          votes: 28,
        },
      ],
    },
    {
      id: 3,
      title: "Residence Constitution Amendment",
      description:
        "Vote on the proposed changes to the residence constitution regarding quiet hours and guest policies.",
      status: "upcoming",
      deadline: "2024-09-25",
      totalVotes: 0,
      eligibleVoters: 200,
      hasVoted: false,
      options: [
        { id: 1, text: "Yes - Approve the amendments", votes: 0 },
        { id: 2, text: "No - Keep current constitution", votes: 0 },
      ],
    },
  ];

  // Handles vote selection
  const handleVote = (electionId, candidateId) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [electionId]: candidateId,
    }));

    setVotingStatus((prev) => ({
      ...prev,
      [electionId]: "Voted",
    }));
  };

  return (
    <StudentLayout>
      <Head title="Voting Centre" />

      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Voting Centre</h1>

        {electionsData.map((election) => (
          <div
            key={election.id}
            className="border rounded-xl p-6 shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold">{election.title}</h2>
            <p className="text-gray-600 mt-1">{election.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Deadline: {election.deadline}
            </p>

            {/* Candidate list */}
            {election.status === "active" && (
              <div className="mt-4 space-y-3">
                {election.candidates?.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-4 border rounded-lg flex justify-between items-center ${
                      selectedCandidates[election.id] === candidate.id
                        ? "bg-blue-100 border-blue-400"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-gray-500">
                        {candidate.year} • {candidate.course}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {candidate.manifesto}
                      </p>
                    </div>
                    <button
                      onClick={() => handleVote(election.id, candidate.id)}
                      disabled={election.hasVoted}
                      className={`px-4 py-2 rounded text-black ${
                        election.hasVoted
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-blue-300 hover:bg-blue-500"
                      }`}
                    >
                      {election.hasVoted ? "Already Voted" : "Vote"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming elections */}
            {election.status === "upcoming" && (
              <p className="text-gray-500 mt-3">
                Voting starts on {election.deadline}.
              </p>
            )}

            {/* Show voting status */}
            {votingStatus[election.id] && (
              <p className="mt-3 text-green-600 font-medium">
                ✅ You have voted!
              </p>
            )}
          </div>
        ))}
      </div>
    </StudentLayout>
  );
}
