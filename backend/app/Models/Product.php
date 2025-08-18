<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Add 'features' to fillable
    protected $fillable = ['name', 'description', 'price', 'features'];

    // Cast 'features' as array
    protected $casts = [
        'features' => 'array',
    ];
}
