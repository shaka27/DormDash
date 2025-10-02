<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */

    protected $table = 'users';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'contact_num',
        'password',
        'gender',
        'student_number',
        'residence_id',
        'room_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',   // Laravel 10+ password hashing cast
    ];

    /* -------------------
       Relationships
    -------------------- */

    public function groupMemberships() 
    {
        return $this->hasMany(GroupMember::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function voteResponses()
    {
        return $this->hasMany(VoteResponse::class);
    }

    public function messagesSent()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messagesReceived() 
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function notifications() 
    {
        return $this->hasMany(Notification::class);
    }

    public function events() 
    {
        return $this->belongsToMany(Event::class, 'event_attendance')
                    ->withPivot('RSVPStatus')
                    ->withTimestamps();
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role')
                    ->withTimestamps();
    }

    //Get full name attribute
    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

}