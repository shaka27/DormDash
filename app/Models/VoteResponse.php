<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoteResponse extends Model
{
    use HasFactory;

    protected $table = 'vote_response'; 

    protected $fillable = ['vote_id','user_id','vote_option_id'];

    // Relationships
    public function vote(): BelongsTo
    {
        return $this->belongsTo(Vote::class, 'vote_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(VoteOption::class, 'vote_option_id');
    }
}
