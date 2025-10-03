<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bed extends Model
{
    use HasFactory;

    protected $fillable = ['room_id', 'description', 'user_id']; 

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id'); 
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}