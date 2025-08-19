<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['GroupName', 'GroupDescription'];

    public function members()
    {
        return $this->belongsToMany(User::class, 'group_members', 'Group_ID', 'User_ID');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class, 'Group_ID');
    }

    public function chatrooms()
    {
        return $this->hasMany(ChatRoom::class, 'Group_ID');
    }
}
