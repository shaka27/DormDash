<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Residence extends Model
{
    use HasFactory;

    protected $table = 'residence';

    protected $fillable = ['name', 'campus_id']; 

    public function campus()
    {
        return $this->belongsTo(Campus::class, 'campus_id'); 
    }

    public function rooms()
    {
        return $this->hasMany(Room::class, 'residence_id'); 
    }

    // Each Residence has many Users(students)
    public function users()
    {
        return $this->hasMany(User::class, 'residence_id');
    }

    // ADD THIS METHOD for maintenance requests
    public function maintenanceRequests()
    {
        return $this->hasManyThrough(MaintenanceRequest::class, Room::class, 'residence_id', 'room_id');
    }
}