<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $fillable = ['name', 'date', 'location', 'description']; 

    public function attendees() 
    {
        return $this->belongsToMany(User::class, 'event_attendance')
                    ->withPivot('RSVPStatus');
    }

}