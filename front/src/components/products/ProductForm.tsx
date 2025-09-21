import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Product } from '../../types';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    image: '',
    inStock: true,
    stockQuantity: 0,
    features: [] as string[],
    specifications: {} as Record<string, string>
  });

  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.image,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity,
        features: [...product.features],
        specifications: { ...product.specifications }
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // delegate actual saving to parent/context
      onSubmit(formData as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextField
            label="Product Name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            variant="standard"
            fullWidth
            placeholder="Enter product name"
          />
        </div>

        <div>
          <TextField
            label="Price"
            name="price"
            required
            type="number"
            value={formData.price}
            onChange={handleChange}
            variant="standard"
            fullWidth
            placeholder="0.00"
            inputProps={{ min: 0, step: 0.01 }}
          />
        </div>
      </div>

      <div>
        <TextField
          label="Description"
          name="description"
          required
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          variant="standard"
          fullWidth
          placeholder="Enter product description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextField
            label="Category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            variant="standard"
            fullWidth
            placeholder="e.g., Electronics, Clothing"
          />
        </div>

        <div>
          <TextField
            label="Brand"
            name="brand"
            required
            value={formData.brand}
            onChange={handleChange}
            variant="standard"
            fullWidth
            placeholder="Enter brand name"
          />
        </div>
      </div>

      {/* FilePond upload instead of Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          server={{
            url: "http://127.0.0.1:8000/api",
            process: {
              url: "/upload",
              method: "POST",

              onload: (response) => {
                const res = JSON.parse(response);
                const imageUrl = res.full_url || (res.url ? `${window.location.origin}${res.url}` : res.path);
                setFormData(prev => ({
                  ...prev,
                  image: imageUrl
                }));
                return imageUrl;
              },
              onerror: (err) => console.error("Upload error:", err),
            },
          }}
          name="file"
          labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
        />
        {formData.image && (
          <p className="text-sm text-gray-500 mt-2">Uploaded: {formData.image}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            In Stock
          </label>
        </div>

        <div>
          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            variant="standard"
            fullWidth
            inputProps={{ min: 0 }}
          />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <TextField
              label="Add a feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              variant="standard"
              fullWidth
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                onDelete={() => removeFeature(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specifications
        </label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <TextField
              label="Specification name"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              variant="standard"
              fullWidth
              placeholder="Specification name"
            />
            <TextField
              label="Specification value"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              variant="standard"
              fullWidth
              placeholder="Specification value"
            />
            <button
              type="button"
              onClick={addSpecification}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(formData.specifications).map(([key, value]) => (

              <Chip

                key={key}
                label={`${key}: ${value}`}
                onDelete={() => removeSpecification(key)}
                color="primary"
                variant="outlined"
                deleteIcon={<CancelIcon />}

              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-white rounded-md transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
