<?php

class GroupMember extends Model 
{
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
