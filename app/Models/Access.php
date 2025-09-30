<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Access extends Model
{
    use HasFactory;

    protected $table = 'access';

    protected $fillable = ['student_number', 'residence_id'];

    public function residence()
    {
        return $this->belongsTo(Residence::class, 'residence_id');
    }
}
