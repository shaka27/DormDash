<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Vote extends Model
{
    protected $fillable = ['VoteTitle', 'VoteDescription', 'VoteStartDate', 'VoteEndDate'];

    public function options()
    {
        return $this->hasMany(VoteOption::class, 'Vote_ID');
    }

    public function responses()
    {
        return $this->hasMany(VoteResponse::class, 'Vote_ID');
    }
}
