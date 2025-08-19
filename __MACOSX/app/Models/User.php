<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Model
{
    protected $fillable = ['FirstName', 'LastName', 'Email', 'ContactNumber', 'Gender', 'PasswordHash'];

    // User belongs to many Roles
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role', 'User_ID', 'Role_ID');
    }

    // User belongs to many Groups
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_members', 'User_ID', 'Group_ID');
    }

    // User has many Notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'User_ID');
    }

    // User attends many Events
    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_attendance', 'User_ID', 'Event_ID')
                    ->withPivot('RSVPStatus');
    }

    // User sends many Messages
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'User_ID(Sender)');
    }

    // User receives many Messages
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'User_ID(Receiver)');
    }
}
