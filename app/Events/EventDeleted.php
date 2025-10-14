<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EventDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $eventId;

    public function __construct($eventId)
    {
        $this->eventId = $eventId;
    }

    public function broadcastOn()
    {
        return new Channel('events');
    }

    public function broadcastAs()
    {
        return 'event-deleted';
    }
}