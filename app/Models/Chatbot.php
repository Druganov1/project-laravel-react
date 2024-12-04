<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chatbot extends Model
{

    protected $fillable = ['role', 'content', 'user_id'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
