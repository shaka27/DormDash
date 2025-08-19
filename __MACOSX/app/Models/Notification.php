<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Notification extends Model
{
    protected $fillable = ['User_ID', 'Type', 'Content', 'IsRead'];

    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID');
    }
}
