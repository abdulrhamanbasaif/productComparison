<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::apiResource('products', ProductController::class);


Route::post('/products/compare', [ProductController::class, 'compare']);
