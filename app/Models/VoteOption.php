<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VoteOption extends Model
{
    use HasFactory;

    protected $table = 'vote_option';
    protected $fillable = ['vote_id', 'option_text', 'user_id'];

    // Relationships
    public function vote(): BelongsTo
    {
        return $this->belongsTo(Vote::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(VoteResponse::class, 'vote_option_id');
    }
}
