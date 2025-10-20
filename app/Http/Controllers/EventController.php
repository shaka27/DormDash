<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get all events and check if current user has RSVP'd
        $events = Event::with('attendees')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($event) use ($user) {
                $event->rsvp = $event->attendees->contains('id', $user->id);
                return $event;
            });

        return Inertia::render("Student_Dashboard/Events", ["events" => $events]);
    }

    // Show the edit event form
    public function edit(Event $event)
    {
        return Inertia::render('Student_Dashboard/EditEvent', ['event' => $event]);
    }

    public function getEventDetailsPage($event)
    {
        $event = Event::with('attendees')->findOrFail($event);
        $user = auth()->user();
        
        // Check if current user has RSVP'd
        $event->rsvp = $event->attendees->contains('id', $user->id);
        
        return Inertia::render('Student_Dashboard/EventDetails', ['event' => $event]);
    }

    /**
     * Return amount of upcoming events
     */
    public function upcommingEvents()
    {
        $now = now();
        $count = Event::where('date', '>', $now)->count();
        
        return response()->json([
            'count' => $count
        ]);
    }
    
    /**
     * Return 3 upcoming events
     */
    public function upcoming()
{
    $user = auth()->user();

    $events = Event::with('attendees')
        ->where('date', '>=', now())
        ->orderBy('date', 'asc')
        ->take(3)
        ->get()
        ->map(function ($event) use ($user) {
            $event->rsvp = $user
                ? $event->attendees->contains('id', $user->id)
                : false;
            return $event;
        });

    return response()->json($events);
}


    // CREATE - Save to database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'location' => 'nullable|string|max:255',
        ]);

        $event = Event::create($validated);

        // Redirect back to events list with success message
        return redirect()->route('events.index')->with('success', 'Event created successfully!');
    }

    // UPDATE - Save to database
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'date' => 'sometimes|required|date',
            'location' => 'sometimes|nullable|string|max:255',
        ]);

        $event->update($validated);

        // Redirect back to events list with success message
        return redirect()->route('events.index')->with('success', 'Event updated successfully!');
    }

    // DELETE - Remove from database
    public function destroy(Event $event)
    {
        $event->delete();

        // Redirect back with success message
        return redirect()->route('events.index')->with('success', 'Event deleted successfully!');
    }

    public function create()
    {
        return Inertia::render('Student_Dashboard/CreateEvent');
    }

    public function rsvp(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);
        $user = auth()->user();

        // Check if user already RSVP'd
        if ($event->attendees()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Already RSVP\'d'], 400);
        }

        // Attach user to event
        $event->attendees()->attach($user->id);

        return response()->json([
            'message' => 'RSVP successful',
            'rsvp' => true
        ], 200);
    }

    public function cancelRsvp(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);
        $user = auth()->user();

        // Detach user from event
        $event->attendees()->detach($user->id);

        return response()->json([
            'message' => 'RSVP cancelled',
            'rsvp' => false
        ], 200);
    }
}