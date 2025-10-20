<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 

class Chatroom extends Model
{
    use HasFactory;

    protected $table = 'chatroom';

    protected $fillable = [
        'name',
        'description',
        'group_id',  // The group this chatroom belongs to
        'residence_id',  // The residence this chatroom belongs to
    ];

    // The group that owns this chatroom (null if its a private chatroom)
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // Group messages only (receiver_id = null)
    public function messages()
    {
        // Only messages where receiver_id is NULL (group messages)
        return $this->hasMany(Message::class)->whereNull('receiver_id');
    }
}