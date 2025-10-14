<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Inertia\Inertia;
use App\Events\EventCreated;
use App\Events\EventUpdated;
use App\Events\EventDeleted;
class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();

        return Inertia::render("Student_Dashboard/Events", ["events" => $events]);
    }

    // Show the edit event form
    public function edit(Event $event)
    {
        return Inertia::render('Student_Dashboard/EditEvent', ['event' => $event]);
    }


    public function getEventDetailsPage($event)
    {
        $event = Event::findOrFail($event);
        return Inertia::render('Student_Dashboard/EventDetails', ['event' => $event]);
    }

    /**
     * Return amount of upcomming events
     */
    public function upcommingEvents()
    {
        // Get current time with Carbon
        $now = now();
        $upcomingEvents = Event::where('date', '>', $now)->get();
        // Count them
        $count = $upcomingEvents->count();
        // Return as JSON (or however you need it)
        return response()->json([
            'count' => $count
        ]);
    }
    
    /**
     * Return 3 upcomming events
     */
    public function upcoming()
    {
        $events = \App\Models\Event::where('date', '>=', now())
            ->orderBy('date', 'asc')
            ->take(3)
            ->get();

        return response()->json($events);
    }

    // CREATE - Broadcast to all users
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'location' => 'nullable|string',
        ]);

        $event = Event::create($validated);

        // Broadcast to all connected users
        broadcast(new EventCreated($event))->toOthers();

        return response()->json($event, 201);
    }

    // UPDATE - Broadcast to all users
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'discription' => 'sometimes|string',
            'date' => 'sometimes|date',
            'location' => 'sometimes|string',
        ]);

        $event->update($validated);

        // Broadcast update to all connected users
        broadcast(new EventUpdated($event))->toOthers();

        return response()->json($event, 200);
    }

    // DELETE - Broadcast to all users
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $eventId = $event->id;
        $event->delete();

        // Broadcast deletion to all connected users
        broadcast(new EventDeleted($eventId))->toOthers();

        return response()->json(['message' => 'Event deleted'], 200);
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
            return response()->json(['message' => 'Already RSVP’d'], 400);
        }

        $event->attendees()->attach($user->id);

        return response()->json(['message' => 'RSVP successful']);
    }

    public function cancelRsvp(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);
        $user = auth()->user();

        $event->attendees()->detach($user->id);

        return response()->json(['message' => 'RSVP cancelled']);
    }

}
