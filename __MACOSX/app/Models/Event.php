<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['EventName', 'EventDate', 'EventLocation', 'Event_Description'];

    public function attendees()
    {
        return $this->belongsToMany(User::class, 'event_attendance', 'Event_ID', 'User_ID')
                    ->withPivot('RSVPStatus');
    }
}
