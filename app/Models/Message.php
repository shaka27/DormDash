<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';


    //Each message will belong to a chatroom so we add chatroom_id FK to  Message Model/Table
    protected $fillable = [
        'sender_id', 
        'receiver_id', // (FK) If receiver_id is set - it’s a private message and is nullable.
        'message', 
        'chatroom_id'  // (FK) If chatroom_id is set - it’s a group message and is nullable.
    ];

    
    //The sender of the message
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    //The receiver of the message (only for private messages)
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    //The chatroom this message belongs to (only for group messages)
    public function chatroom(): BelongsTo
    {
        return $this->belongsTo(Chatroom::class, 'chatroom_id');
    }

    
    //Helper to check if message is private
    //receiver_id null -> group message
    //receiver_id not null -> private message.
    public function isPrivate(): bool
    {
        return $this->receiver_id !== null;
    }
}
