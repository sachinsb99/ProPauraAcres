<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class HomeEnquiry extends Model
{
    protected $table = 'popup_enquiries';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'property', // renamed from message → property
        'status',
        'responded_at',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
    ];

    // Optional: default status value
    protected $attributes = [
        'status' => 'pending',
    ];

    // Accessor for formatted created_at
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at
            ? Carbon::parse($this->created_at)->format('d M Y, h:i A')
            : '';
    }
}
