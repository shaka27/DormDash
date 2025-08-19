<?php

class Bed extends Model
{
    protected $fillable = ['Room_ID', 'Bed_Description'];

    public function room()
    {
        return $this->belongsTo(Room::class, 'Room_ID');
    }
}
