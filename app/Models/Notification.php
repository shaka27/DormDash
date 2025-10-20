<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'content',
        'residence_id',
        'user_id',
        'sender_id',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created/sent the notification.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the user who receives the notification.
     */
    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Get the residence this notification belongs to.
     */
    public function residence()
    {
        return $this->belongsTo(Residence::class);
    }

    /**
     * Scope: Get unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope: Get notifications for a specific residence.
     */
    public function scopeForResidence($query, $residenceId)
    {
        return $query->where('residence_id', $residenceId);
    }
}