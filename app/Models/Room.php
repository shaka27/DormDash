<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'room';

    protected $fillable = [
        'number',
        'floor',
        'capacity',
        'residence_id',
        'type',
        'status',
    ];

    public function residence()
    {
        return $this->belongsTo(Residence::class, 'residence_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'room_id');
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class, 'room_id');
    }
}
