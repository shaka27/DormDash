<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GroupMember extends Model 
{
    use HasFactory;

    protected $table = 'group_member';

    protected $fillable = ['group_id', 'user_id', 'gr_id'];

    public function group() 
    {
        return $this->belongsTo(Group::class);
    }

    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    public function role() 
    {
        return $this->belongsTo(GroupRole::class, 'gr_id');
    }
}
