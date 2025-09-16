<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;

class AmazonService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.rainforest.api_key');
    }

    /**
     * Extract ASIN from Amazon link
     */
    public function extractAsin($url)
    {
        if (preg_match('/(?:dp|gp\/product)\/([A-Z0-9]{10})/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Fetch product info from Rainforest API using ASIN
     */
    public function getProductInfo($asin, $domain = 'amazon.com')
    {
        $response = Http::get('https://api.rainforestapi.com/request', [
            'api_key' => $this->apiKey,
            'type' => 'product',
            'amazon_domain' => $domain,
            'asin' => $asin,
        ]);

        if ($response->failed()) {
            return null;
        }

        return $response->json();
    }
}
