<?php

class Campus extends Model 
{
    protected $fillable = ['name'];

    public function residences() 
    {
        return $this->hasMany(Residence::class,'campus_id');
    }
}
