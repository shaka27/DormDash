<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Campus extends Model 
{
    use HasFactory;

    protected $table = 'campus';

    protected $fillable = ['name'];
    

    public function residences() 
    {
        return $this->hasMany(Residence::class,'campus_id');
    }
}
