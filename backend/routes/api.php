<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AmazonController;


// Product routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::post('/products/compare', [ProductController::class, 'compare']);
    

    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);

});
//user routes

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

//handle image upload

Route::post('/upload', [ProductController::class, 'upload']);


Route::post('/amazon/fetch', [AmazonController::class, 'fetchProduct']);



