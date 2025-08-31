<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::where('user_id', auth()->id())->get();
        return response()->json($products);
    }



    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'image' => 'required|string',
            'inStock' => 'boolean',
            'stockQuantity' => 'integer|min:0',
            'features' => 'sometimes|array',
            'specifications' => 'sometimes|array',
        ]);

       

        $validatedData['user_id'] = auth()->id(); // link to user

        $product = Product::create($validatedData);

        return response()->json($product, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'image' => 'required|string',
            'inStock' => 'boolean',
            'stockQuantity' => 'integer|min:0',
            'features' => 'sometimes|array',
            'specifications' => 'sometimes|array',
        ]);

        $product->update($validatedData);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        if ($product->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();

        return response()->json(null, 204);
    }

    public function compare(Request $request)
    {
        $ids = $request->input('ids'); // array of product IDs
        $products = Product::whereIn('id', $ids)->get();
        return response()->json($products);
    }

public function upload(Request $request)
{
    $request->validate([
        'file' => 'required|image|max:2048',
    ]);

    $path = $request->file('file')->store('products', 'public');

    return response()->json([
        'path' => $path,
        'url'  => Storage::url($path), // e.g. /storage/products/xxx.jpg
        'full_url' => url(Storage::url($path)), // absolute URL
    ], 201);
}
    

}
