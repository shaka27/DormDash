<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Residence extends Model
{
    protected $fillable = ['ResName', 'Campus_ID'];

    public function campus()
    {
        return $this->belongsTo(Campus::class, 'Campus_ID');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class, 'Res_ID');
    }
}
