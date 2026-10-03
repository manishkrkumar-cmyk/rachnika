import React, { useState } from 'react';
import { Store, PlusCircle, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import { productApi } from '../api/productApi';
import { CATEGORIES } from '../utils/constants';
import axios from 'axios';

export default function SellerStudioPage({ onProductCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    imageUrl: '',
    stock: '10',
    categoryId: '1',
    sellerId: '1'
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if ((name === 'price' || name === 'originalPrice') && updated.price && updated.originalPrice) {
        const orig = parseFloat(updated.originalPrice);
        const curr = parseFloat(updated.price);
        if (orig > curr && orig > 0) {
          updated.discount = Math.round(((orig - curr) / orig) * 100).toString();
        }
      }
      return updated;
    });
  };

  // Compress image on client side to keep DB payload light and prevent timeout errors
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compressed Base64 string at 75% quality
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');

    try {
      // 1. Compress locally for preview and fallback
      const compressedDataUrl = await compressImage(file);
      setPreviewUrl(compressedDataUrl);

      // 2. Try multipart backend upload endpoint
      const uploadData = new FormData();
      uploadData.append('file', file);

      try {
        const res = await axios.post('http://localhost:8091/api/upload/image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 4000
        });
        if (res.data?.url) {
          setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
          return;
        }
      } catch {
        // Backend upload controller not present, persist compressed base64 directly
      }

      setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
    } catch (err) {
      setErrorMsg('Failed to process the chosen image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
      discount: formData.discount ? parseInt(formData.discount, 10) : 0,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      stock: parseInt(formData.stock, 10),
      categoryId: parseInt(formData.categoryId, 10),
      sellerId: 1
    };

    try {
      await productApi.createProduct(payload);
      setSuccessMsg('Craft product successfully published with custom photo!');
      setFormData({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        imageUrl: '',
        stock: '10',
        categoryId: '1',
        sellerId: '1'
      });
      setPreviewUrl('');
      if (onProductCreated) {
        setTimeout(() => onProductCreated(), 1200);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data || err.message;
      setErrorMsg(`Submission failed: ${typeof serverMessage === 'string' ? serverMessage : 'Backend error (500). Verify database table schema.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 font-sans">
      <div className="bg-[#2874f0] text-white rounded-t-lg p-6 flex items-center justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-yellow-300" />
            <h1 className="text-xl font-bold">Rachnika Seller Hub</h1>
          </div>
          <p className="text-xs text-blue-100 mt-1">
            Artisan & Craft Listing Console — Publish handmade items directly to your store
          </p>
        </div>
        <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Verified Artisan
        </span>
      </div>

      <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg p-6 shadow-sm">
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Craft / Product Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Handmade Madhubani Canvas Painting / Terracotta Vase"
              className="w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#2874f0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#2874f0] bg-white cursor-pointer font-medium"
              >
                {CATEGORIES && CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Inventory Stock Units *
              </label>
              <input
                type="number"
                name="stock"
                min="1"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#2874f0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className="w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#2874f0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Original MRP (₹)
              </label>
              <input
                type="number"
                step="0.01"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="799"
                className="w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#2874f0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="35"
                className="w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#2874f0]"
              />
            </div>
          </div>

          {/* Local File Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Upload Craft Photo from Local Device
            </label>

            {!previewUrl ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-[#2874f0] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-slate-700">Click to browse craft photo</span>
                <span className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG, WEBP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative w-44 h-44 rounded-lg border border-slate-300 overflow-hidden shadow-inner group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                </button>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-bold text-[#2874f0]">
                    Compressing...
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Craft Description, Materials & Specifications *
            </label>
            <textarea
              name="description"
              rows="3"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe materials used (e.g., natural clay, acrylic on canvas), dimensions, artisan techniques, and care instructions..."
              className="w-full border border-slate-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#2874f0]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full bg-[#fb641b] hover:bg-[#e85a15] text-white font-bold py-3 rounded text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow transition disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Submitting Craft...' : 'Publish Craft to Rachnika Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}