<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;
use App\Models\VoteOption;
use App\Models\VoteResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VoteController extends Controller
{
    /**
     * Display a listing of votes for the residence
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        if (!$residenceId) {
            return redirect()->route('residence.overview');
        }

        $userId = Auth::id();
        $now = now();

        $votes = Vote::where('residence_id', $residenceId)
            ->with(['options', 'responses'])
            ->get()
            ->map(function ($vote) use ($userId, $now) {
                $totalVotes = $vote->responses->count();
                $hasVoted = $vote->responses->where('user_id', $userId)->isNotEmpty();

                // Determine status based on dates
                $status = 'upcoming';
                if ($now->greaterThan($vote->end_date)) {
                    $status = 'ended';
                } elseif ($now->between($vote->start_date, $vote->end_date)) {
                    $status = 'active';
                }

                return [
                    'id' => $vote->id,
                    'title' => $vote->title,
                    'description' => $vote->description,
                    'status' => $status,
                    'start_date' => $vote->start_date,
                    'end_date' => $vote->end_date,
                    'totalVotes' => $totalVotes,
                    'hasVoted' => $hasVoted,
                    'options' => $vote->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'option_text' => $option->option_text,
                            'user_id' => $option->user_id,
                        ];
                    }),
                ];
            });

        return Inertia::render('Student_Dashboard/VotingCentre', [
            'votes' => $votes,
            'canManageVotes' => $this->canManageVotes()
        ]);
    }

    /**
     * Display the voting details page
     */
    public function getVotingDetailsPage(Request $request, $voteId)
    {
        $user = Auth::user();
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);
        $userId = Auth::id();

        $vote = Vote::where('residence_id', $residenceId)
            ->with(['options.user', 'responses.option'])
            ->findOrFail($voteId);

        $userVote = $vote->responses->where('user_id', $userId)->first();

        $now = now();
        $status = 'upcoming';
        if ($now->greaterThan($vote->end_date)) {
            $status = 'ended';
        } elseif ($now->between($vote->start_date, $vote->end_date)) {
            $status = 'active';
        }

        // Get vote counts per option
        $optionsWithCounts = $vote->options->map(function ($option) use ($vote) {
            return [
                'id' => $option->id,
                'option_text' => $option->option_text,
                'user' => $option->user ? [
                    'id' => $option->user->id,
                    'name' => $option->user->name,
                ] : null,
                'votes' => $option->responses->count(),
            ];
        });

        return Inertia::render('Student_Dashboard/VotingDetails', [
            'vote' => [
                'id' => $vote->id,
                'title' => $vote->title,
                'description' => $vote->description,
                'start_date' => $vote->start_date,
                'end_date' => $vote->end_date,
                'status' => $status,
                'options' => $optionsWithCounts,
                'totalVotes' => $vote->responses->count(),
            ],
            'userVote' => $userVote ? [
                'option_id' => $userVote->vote_option_id
            ] : null,
        ]);
    }

    /**
     * Store a new vote
     */
    public function store(Request $request)
    {
        if (!$this->canManageVotes()) {
            abort(403, 'Unauthorized action.');
        }

        $user = Auth::user();
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'options' => 'required|array|min:2',
            'options.*.option_text' => 'required|string',
            'options.*.user_id' => 'nullable|exists:users,id',
        ]);

        DB::beginTransaction();
        try {
            $vote = Vote::create([
                'user_id' => $user->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'residence_id' => $residenceId,
            ]);

            foreach ($validated['options'] as $optionData) {

                VoteOption::create([
                    'vote_id' => $vote->id,
                    'option_text' => $optionData['option_text'],
                   'user_id' => $user->id,
                ]);
            }

            DB::commit();

            return redirect()->route('voting-centre.index')
                ->with('success', 'Vote created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            dd($e->getMessage());
            return back()->withErrors(['error' => 'Failed to create vote.']);
        }
    }

    /**
     * Update an existing vote
     */
    public function update(Request $request, $id)
    {
        if (!$this->canManageVotes()) {
            abort(403, 'Unauthorized action.');
        }

        $user = Auth::user();
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        $vote = Vote::where('residence_id', $residenceId)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'options' => 'required|array|min:2',
            'options.*.id' => 'nullable|exists:vote_option,id',
            'options.*.option_text' => 'required|string',
            'options.*.user_id' => 'nullable|exists:users,id',
        ]);

        DB::beginTransaction();
        try {
            $vote->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]);

            // Delete existing options and recreate
            $vote->options()->delete();

            foreach ($validated['options'] as $optionData) {
                VoteOption::create([
                    'vote_id' => $vote->id,
                    'option_text' => $optionData['option_text'],
                    'user_id' => $optionData['user_id'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('voting-centre.index')
                ->with('success', 'Vote updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update vote.']);
        }
    }

    /**
     * Delete a vote
     */
    public function destroy(Request $request, $id)
    {
        if (!$this->canManageVotes()) {
            abort(403, 'Unauthorized action.');
        }

        $user = Auth::user();
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);
        $vote = Vote::where('residence_id', $residenceId)->findOrFail($id);

        $vote->delete();

        return redirect()->route('voting-centre.index')
            ->with('success', 'Vote deleted successfully!');
    }

    /**
     * Submit a vote response
     */
    public function submitVote(Request $request, $voteId)
    {
        $user = Auth::user();
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);
        $userId = Auth::id();

        $vote = Vote::where('residence_id', $residenceId)->findOrFail($voteId);

        // Check if vote is active
        $now = now();
        if (!$now->between($vote->start_date, $vote->end_date)) {
            return back()->withErrors(['error' => 'This vote is not currently active.']);
        }

        // Check if user already voted
        $existingVote = VoteResponse::where('vote_id', $voteId)
            ->where('user_id', $userId)
            ->first();

        if ($existingVote) {
            return back()->withErrors(['error' => 'You have already voted.']);
        }

        $validated = $request->validate([
            'vote_option_id' => 'required|exists:vote_option,id',
        ]);

        // Verify option belongs to this vote
        $option = VoteOption::where('id', $validated['vote_option_id'])
            ->where('vote_id', $voteId)
            ->firstOrFail();

        VoteResponse::create([
            'vote_id' => $voteId,
            'user_id' => $userId,
            'vote_option_id' => $validated['vote_option_id'],
        ]);

        return redirect()->route('voting-centre.details', $voteId)
            ->with('success', 'Your vote has been recorded!');
    }

    /**
     * Check if current user can manage votes
     */
    private function canManageVotes()
    {
        $user = Auth::user();
        $allowedRoles = ['Admin', 'HouseParent', 'HouseCommittee'];

        return $user->roles()->whereIn('description', $allowedRoles)->exists();
    }
}
