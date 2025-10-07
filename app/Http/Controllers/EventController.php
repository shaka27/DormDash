<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();

        return Inertia::render("Student_Dashboard/Events", ["events" => $events]);
    }

    public function getEventDetailsPage($event)
    {
        $event = Event::findOrFail($event);
        return Inertia::render('Student_Dashboard/EventDetails', ['event' => $event]);
    }

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

    public function upcoming()
    {
        $events = \App\Models\Event::where('date', '>=', now())
            ->orderBy('date', 'asc')
            ->take(3)
            ->get();

        return response()->json($events);
    }
}
