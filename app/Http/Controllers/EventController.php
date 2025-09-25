<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::all();

        return Inertia::render("Events", ["events" => $events]);
    }

    public function getEventDetailsPage(Request $request, $eventId)
    {
        $event = Event::all()->findOrFail($eventId);
        return inertia('Student_Dashboard/EventDetails', ['event' => $event]);
    }


}
