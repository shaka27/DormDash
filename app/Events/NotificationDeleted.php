<?php
namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Queue\SerializesModels;
use App\Models\Notification;

class NotificationDeleted implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public int $id;
    protected int $residenceId;

    public function __construct(Notification $notification)
    {
        $this->id = $notification->id;
        $this->residenceId = $notification->residence_id;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('residence.'.$this->residenceId);
    }

    public function broadcastAs()
    {
        return 'NotificationDeleted';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->id,
        ];
    }
}