<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;
use Inertia\Inertia;

class VoteController extends Controller
{
    public function index()
    {
        $votes = Vote::all();
        return inertia('Student_Dashboard/VotingCentre', ['votes' => $votes]);
    }

    public function getVotingDetailsPage(Request $request, $voteId)
    {
        $vote = Vote::with('options', 'responses')->findOrFail($voteId);
        return inertia('Student_Dashboard/VotingDetails', ['vote' => $vote]);
    }

    // TODO: Add CRUD methods for votes and options
}
