<?php

class Bed extends Model
{
    protected $fillable = ['room_id', 'description']; 

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id'); 
    }
}