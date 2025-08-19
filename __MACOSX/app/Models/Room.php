<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Room extends Model
{
    protected $fillable = ['RoomNumber', 'RoomStatus', 'Res_ID'];

    public function residence()
    {
        return $this->belongsTo(Residence::class, 'Res_ID');
    }

    public function beds()
    {
        return $this->hasMany(Bed::class, 'Room_ID');
    }
}
