<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = [
            [
                "EventName" => "House Committee Meeting",
                "EventDate" => "2025-09-02 14:00",
                "EventLocation" => "Common Room A",
                "EventDescription" => "Discussion of residence issues",
            ],
            [
                "EventName" => "Braai Day Celebration",
                "EventDate" => "2025-09-03 18:00",
                "EventLocation" => "Residence Garden",
                "EventDescription" => "Celebrate with food and music",
            ],
        ];

        return Inertia::render("Events", [
            "events" => $events
        ]);
    }
}
