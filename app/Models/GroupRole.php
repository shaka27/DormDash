<?php

class GroupRole extends Model {
    use HasFactory;

    protected $fillable = ['name', 'description'];

    protected $table = 'group_role';

    public function members()
    {
        return $this->hasMany(GroupMember::class, 'gr_id');
    }
}

