<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Add 'features' to fillable
   protected $fillable = [
    'name',
    'description',
    'price',
    'category',
    'brand',
    'image',
    'inStock',
    'stockQuantity',
    'features',
    'specifications',
    'user_id',
];


    // Cast 'features' and 'specifications' as array
    protected $casts = [
        'features' => 'array',
        'specifications' => 'array',
    ];

     public function user()
    {
        return $this->belongsTo(User::class);
    }
}
