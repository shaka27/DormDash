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
        return $this->hasMany(GroupMember::class);
    }

    // Each group has one chatroom (group messages only)
    public function chatroom()
    {
        return $this->hasOne(Chatroom::class);
    }

     // Returns all users in the group directly
    public function users()
    {
        return $this->belongsToMany(User::class, 'group_member')
                    ->withPivot('gr_id')
                    ->withTimestamps();
    }

}