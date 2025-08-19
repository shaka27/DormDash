<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = ['title', 'description', 'start_date', 'end_date']; // Match migration columns

    public function options()
    {
        return $this->hasMany(VoteOption::class, 'vote_id'); // Use snake_case
    }

    public function responses()
    {
        return $this->hasMany(VoteResponse::class, 'vote_id'); // Use snake_case
    }
}
