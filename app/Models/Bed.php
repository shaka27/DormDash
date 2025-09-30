<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bed extends Model
{
    use HasFactory;
    protected $table = 'bed';

    protected $fillable = ['room_id', 'description']; 

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id'); 
    }
}