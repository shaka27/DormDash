<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
     // Explicitly define the table name
    protected $table = 'room';
    
    protected $fillable = ['number', 'status', 'residence_id']; 

    public function residence()
    {
        return $this->belongsTo(Residence::class, 'residence_id'); 
    }

    public function beds()
    {
        return $this->hasMany(Bed::class, 'room_id'); 
    }
}