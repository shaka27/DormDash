<?php

namespace App\Events;

use App\Models\Event;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EventCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    // Use a private channel if you want authentication
    public function broadcastOn()
    {
        return new Channel('events'); // public channel "events"
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->event->id,
            'name' => $this->event->name,
            'discription' => $this->event->discription,
            'date' => $this->event->date,
            'location' => $this->event->location,
        ];
    }
}
