<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;
    
    protected $table = 'vote';

    protected $fillable = ['title', 'description', 'start_date', 'end_date', 'residence_id', 'user_id']; // Match migration columns

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function residence()
    {
        return $this->belongsTo(Residence::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function options()
    {
        return $this->hasMany(VoteOption::class, 'vote_id'); // Use snake_case
    }

    public function responses()
    {
        return $this->hasMany(VoteResponse::class, 'vote_id'); // Use snake_case
        
    }
}
