<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $table = 'group';
    protected $fillable = ['name', 'description']; 

    // Returns GroupMember pivot objects
    public function members()
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }

    // Each group has one chatroom (group messages only)
    public function chatroom()
    {
        return $this->hasOne(Chatroom::class, 'group_id');
    }

     // Returns all users in the group directly
    public function users()
    {
        return $this->belongsToMany(User::class, 'group_member')
                    ->withPivot('gr_id')
                    ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasManyThrough(
            Message::class,
            Chatroom::class,
            'group_id',     // Foreign key on chatrooms table
            'chatroom_id', // Foreign key on messages table
            'id',           // Local key on groups table
            'id'            // Local key on chatrooms table
        );
    }
}