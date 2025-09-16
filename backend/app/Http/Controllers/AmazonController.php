<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Providers\AmazonService;

class AmazonController extends Controller
{
    protected $amazonService;

    public function __construct(AmazonService $amazonService)
    {
        $this->amazonService = $amazonService;
    }

    public function fetchProduct(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        // Extract ASIN from common Amazon URL patterns
        $asin = null;
        if (preg_match('/\/dp\/([A-Z0-9]{10})/i', $request->url, $m)) {
            $asin = $m[1];
        } elseif (preg_match('/\/gp\/product\/([A-Z0-9]{10})/i', $request->url, $m)) {
            $asin = $m[1];
        }

        if (!$asin) {
            return response()->json(['error' => 'Invalid Amazon URL (ASIN not found)'], 400);
        }

        // Determine amazon domain from URL host (fallback to amazon.com)
        $host = parse_url($request->url, PHP_URL_HOST) ?: '';
        $amazonDomain = 'amazon.com';
        if (preg_match('/amazon\.(sa|com|co\.uk|de|fr|it|es|ca|in|com\.au|com\.mx|co\.jp|ae|nl)/i', $host, $dm)) {
            $amazonDomain = 'amazon.' . strtolower($dm[1]);
        }

        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->get('https://api.rainforestapi.com/request', [
                'query' => [
                    'api_key' => env('RAINFOREST_API_KEY'),
                    'type' => 'product',
                    'amazon_domain' => $amazonDomain,
                    'asin' => $asin,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Rainforest API request failed', 'details' => $e->getMessage()], 502);
        }

        $data = json_decode($response->getBody(), true);

        if (!isset($data['product'])) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $p = $data['product'];

        // Robust image fallback chain
        $image = $p['main_image']['link']
            ?? ($p['images'][0]['link'] ?? null)
            ?? ($p['image']['link'] ?? null)
            ?? ($p['image'] ?? null)
            ?? '';

        // Feature bullets normalization
        $features = [];
        if (!empty($p['feature_bullets']) && is_array($p['feature_bullets'])) {
            $features = array_values(array_filter($p['feature_bullets'], fn($f) => is_string($f) && trim($f) !== ''));
        } elseif (!empty($p['features']) && is_array($p['features'])) {
            $features = array_values(array_filter($p['features'], fn($f) => is_string($f) && trim($f) !== ''));
        }

        // Specifications already array of { name, value }
        $specifications = $p['specifications'] ?? [];

        // In-stock detection using multiple possible fields
        $inStock = false;
        if (isset($p['availability_status'])) {
            $inStock = strtolower((string) $p['availability_status']) === 'in_stock';
        } elseif (isset($p['buybox_winner']['availability']['type'])) {
            $inStock = strtolower((string) $p['buybox_winner']['availability']['type']) === 'in_stock';
        } elseif (isset($p['availability']['type'])) {
            $inStock = strtolower((string) $p['availability']['type']) === 'in_stock';
        }

        // Fallback category logic
        $category = $p['categories'][0]['name'] ?? ($p['categories_flat'] ?? ($p['search_alias']['title'] ?? 'General'));

        // Price extraction: try buybox winner, then price, then rrp
        $price = $p['buybox_winner']['price']['value']
            ?? ($p['price']['value'] ?? ($p['buybox_winner']['rrp']['value'] ?? 0));


        // Description: only accept non-empty strings, never features
        $description = '';
        if (!empty($p['description']) && is_string($p['description'])) {
            $description = $p['description'];
        } elseif (!empty($p['editorial_recommendations'][0]['body'])) {
            $description = $p['editorial_recommendations'][0]['body'];
        }

        return response()->json([
            'title' => $p['title'] ?? 'Unknown',
            'description' => $description,
            'price' => $price,
            'category' => $category,
            'brand' => $p['brand'] ?? 'Unknown',
            'image' => $image,
            'inStock' => $inStock,
            'features' => $features,
            'specifications' => $specifications,
            'asin' => $asin,
            'amazon_domain' => $amazonDomain,
        ]);

    }
}
