<?php

class GroupRole extends Model {
    protected $fillable = ['name', 'description'];

    public function members()
    {
        return $this->hasMany(GroupMember::class, 'gr_id');
    }
}

