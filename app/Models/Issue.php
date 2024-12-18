<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    //
    protected $fillable = ['title', 'reference_id', 'description', 'status', 'priority', 'assigned_to', 'created_by', 'resolved_at'];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }





}
