import  { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import TextField from '@mui/material/TextField';

export default function AmazonImport() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  const fetchProduct = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/amazon/fetch", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save directly after successful fetch (normalize supports Rainforest API shape)
        await saveProduct(data);
      } else {
        setError(data.error || "Failed to fetch product");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (amzRaw: any) => {
    // Normalize Rainforest API shape (data.product.*) or a pre-normalized shape
    const pick = (obj: any, path: (string | number)[]): any => {
      try {
        return path.reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
      } catch {
        return undefined;
      }
    };

    const parsePrice = (p: any) => {
      if (typeof p === 'number' && isFinite(p)) return p;
      if (typeof p === 'string') {
        const num = parseFloat(p.replace(/[^0-9.\-]/g, ''));
        return isNaN(num) ? 0 : num;
      }
      return 0;
    };

    // If response is Rainforest-style, data.product exists; else assume already flattened
    const src = amzRaw?.product ? amzRaw.product : amzRaw;

    const name = (src?.title ?? amzRaw?.title ?? '').toString().trim() || 'Imported Product';
    const rawDesc = (typeof src?.description === 'string' ? src.description : (typeof amzRaw?.description === 'string' ? amzRaw.description : '')).trim();

    const imageUrl =
      pick(src, ['main_image', 'link']) ||
      (Array.isArray(src?.images) && src.images.length ? src.images[0]?.link : undefined) ||
      pick(amzRaw, ['image', 'link']) ||
      amzRaw?.image ||
      '';

    const featuresList: string[] = Array.isArray(src?.feature_bullets)
      ? src.feature_bullets.filter((f: any) => typeof f === 'string')
      : Array.isArray(amzRaw?.features)
        ? amzRaw.features.filter((f: any) => typeof f === 'string')
        : [];

    const fallbackDesc = featuresList.length
      ? `Features: ${featuresList.slice(0, 10).join(', ')}`
      : `Imported product: ${name}`;
    const description = rawDesc || fallbackDesc;

    const priceCandidate =
      src?.price?.value ??
      pick(src, ['buybox_winner', 'price', 'value']) ??
      pick(src, ['buybox_winner', 'rrp', 'value']) ??
      amzRaw?.price ??
      0;

    // Specifications array of { name, value } -> object map
    const specsArray = Array.isArray(src?.specifications)
      ? src.specifications
      : Array.isArray(amzRaw?.specifications)
        ? amzRaw.specifications
        : [];
    const specsObj = specsArray.reduce((acc: Record<string, string>, s: any) => {
      if (!s) return acc;
      const key = (s.name ?? '').toString().replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      const val = (s.value ?? '').toString().replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      if (key) acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    const category = (
      (src?.categories_flat ?? '').toString().trim() ||
      (src?.search_alias?.title ?? '').toString().trim() ||
      (Array.isArray(src?.categories) && src.categories[0]?.name) ||
      (amzRaw?.category ?? '').toString().trim() ||
      'Imported'
    );

    const brand = (src?.brand ?? amzRaw?.brand ?? 'Unknown').toString().trim() || 'Unknown';

    const payload = {
      name,
      description,
      price: parsePrice(priceCandidate),
      category,
      brand,
      image: imageUrl,
      inStock: true,
      stockQuantity: 0,
      features: featuresList,
      specifications: specsObj,
    };

    // Guarantee an image so backend validation passes
    if (!payload.image || (typeof payload.image === 'string' && payload.image.trim() === '')) {
      payload.image = 'https://via.placeholder.com/400?text=No+Image';
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
  const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();
      if (response.ok) {
        setMessage("Product saved successfully.");
        setUrl("");
      } else {
        setError(resJson?.message || resJson?.error || "Failed to save product");
      }
    } catch (err) {
      setError("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Import Amazon Product</h2>

      {/* URL Input */}
      <TextField
        type="url"
        placeholder="Paste Amazon product link here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border rounded-lg p-2"
        label="Amazon Product URL"
        variant="standard"
        fullWidth
      />

      {/* Fetch Button */}
      <button
        onClick={fetchProduct}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Fetching..." : "Fetch Product"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Status messages */}
      {message && <p className="text-green-600">{message}</p>}
      {saving && <p className="text-gray-600">Saving...</p>}
    </div>
  );
}
