<?php
namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Queue\SerializesModels;
use App\Models\Notification;

class NotificationUpdated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public Notification $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('residence.'.$this->notification->residence_id);
    }

    public function broadcastAs()
    {
        return 'NotificationUpdated';
    }

    public function broadcastWith()
    {
        return [
            'notification' => $this->notification->toArray(),
        ];
    }
}