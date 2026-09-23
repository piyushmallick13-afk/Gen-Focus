import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useNavLinks } from '../hooks/useNavLinks';
import { 
  Plus, 
  Trash2, 
  Lock, 
  Edit2, 
  Link as LinkIcon, 
  Upload, 
  Loader2, 
  X, 
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { NavLink } from '../types';
import { allCategories } from '../data';
import imageCompression from 'browser-image-compression';

export default function Admin() {
  const { products, addProduct, removeProduct, editProduct } = useProducts();
  const { links, addLink, removeLink, editLink } = useNavLinks();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'links'>('products');

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    mrp: string;
    discount: string;
    imageUrl: string;
    affiliateUrl: string;
    category: string;
    imageBgColor: string;
    rating: string;
    type: 'affiliate' | 'buy';
    hasSizes: boolean;
    additionalImages: string[];
  }>({
    name: '',
    description: '',
    price: '',
    mrp: '',
    discount: '',
    imageUrl: '',
    affiliateUrl: '',
    category: '',
    imageBgColor: 'bg-stone-100',
    rating: '',
    type: 'affiliate',
    hasSizes: false,
    additionalImages: []
  });

  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [additionalImageUrl, setAdditionalImageUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [linkFormData, setLinkFormData] = useState({
    label: '',
    url: '',
    section: 'explore' as 'explore' | 'legal'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({
        type: 'error',
        text: 'Unsupported file format. Please upload a valid image file (e.g. JPG, PNG, WEBP).'
      });
      return;
    }

    // Check size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      setStatusMessage({
        type: 'error',
        text: 'Image size exceeds maximum limit of 5MB.'
      });
      return;
    }

    // Immediately show a local preview to make UI feel instant
    const localPreviewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, imageUrl: localPreviewUrl }));
    setImageLoadError(false);
    setIsUploading(true);
    setStatusMessage(null);

    try {
      // Compress the image to a smaller size to store directly in Firestore
      const options = {
        maxSizeMB: 0.15, // Keep small to fit in Firestore doc limit
        maxWidthOrHeight: 800,
        useWebWorker: false, // Avoid WebWorker issues in sandbox
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Convert to Base64 directly
      const base64String = await imageCompression.getDataUrlFromFile(compressedFile);
      
      setFormData(prev => ({ ...prev, imageUrl: base64String })); 
    } catch (err) {
      console.error("Upload failed", err);
      let errorMessage = "Failed to upload image. Please make sure it is a supported image format and try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setStatusMessage({ type: 'error', text: errorMessage });
      setFormData(prev => ({ ...prev, imageUrl: '' })); // Revert on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Unsupported file format. Please upload a valid image file.' });
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      setStatusMessage({ type: 'error', text: 'Image size exceeds maximum limit of 5MB.' });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const options = {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 800,
        useWebWorker: false,
      };
      const compressedFile = await imageCompression(file, options);
      const base64String = await imageCompression.getDataUrlFromFile(compressedFile);
      
      setFormData(prev => ({ 
        ...prev, 
        additionalImages: [...(prev.additionalImages || []), base64String] 
      })); 
    } catch (err) {
      console.error("Upload failed", err);
      let errorMessage = "Failed to upload image. Please try again.";
      if (err instanceof Error) errorMessage = err.message;
      setStatusMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddAdditionalImageUrl = () => {
    const trimmed = additionalImageUrl.trim();
    if (!trimmed) return;
    setFormData(prev => ({
      ...prev,
      additionalImages: [...(prev.additionalImages || []), trimmed]
    }));
    setAdditionalImageUrl('');
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLinkFormData({ ...linkFormData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      mrp: '',
      discount: '',
      imageUrl: '',
      affiliateUrl: '',
      category: '',
      imageBgColor: 'bg-stone-100',
      rating: '',
      type: 'affiliate',
      hasSizes: false,
      additionalImages: []
    });
    setImageLoadError(false);
    setAdditionalImageUrl('');
    setStatusMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.imageUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide a product image URL or upload an image file.' });
      return;
    }
    
    if (editingId) {
      editProduct({
        id: editingId,
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined
      });
      setStatusMessage({ type: 'success', text: `Product "${formData.name}" updated successfully.` });
      setEditingId(null);
    } else {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined
      };
      addProduct(newProduct);
      setStatusMessage({ type: 'success', text: `Product "${formData.name}" added successfully.` });
    }

    setFormData({
      name: '',
      description: '',
      price: '',
      mrp: '',
      discount: '',
      imageUrl: '',
      affiliateUrl: '',
      category: '',
      imageBgColor: 'bg-stone-100',
      rating: '',
      type: 'affiliate',
      hasSizes: false,
      additionalImages: []
    });
    setImageLoadError(false);
    setAdditionalImageUrl('');
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLinkId) {
      editLink({
        id: editingLinkId,
        ...linkFormData
      });
      setEditingLinkId(null);
    } else {
      addLink({
        id: Date.now().toString(),
        ...linkFormData
      });
    }

    setLinkFormData({
      label: '',
      url: '',
      section: 'explore'
    });
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp || '',
      discount: product.discount || '',
      imageUrl: product.imageUrl || '',
      affiliateUrl: product.affiliateUrl || '',
      category: product.category,
      imageBgColor: product.imageBgColor || 'bg-stone-100',
      rating: product.rating ? product.rating.toString() : '',
      type: product.type || 'affiliate',
      hasSizes: product.hasSizes || false,
      additionalImages: product.additionalImages || []
    });
    setImageLoadError(false);
    setAdditionalImageUrl('');
    setStatusMessage(null);

    // If existing product image is base64 or upload
    if (product.imageUrl?.startsWith('data:')) {
      setImageInputMode('upload');
    } else {
      setImageInputMode('url');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditLinkClick = (link: NavLink) => {
    setEditingLinkId(link.id);
    setLinkFormData({
      label: link.label,
      url: link.url,
      section: link.section
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '@%Ben') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-[#FAFAFA]">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/50 w-full max-w-md">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-medium text-stone-800">Admin Access</h2>
              <p className="text-stone-500 text-sm mt-2">Enter your PIN to access the dashboard.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-stone-200 bg-stone-50 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  placeholder="••••••"
                  autoFocus
                />
                {error && <p className="text-rose-500 text-sm mt-2 text-center">{error}</p>}
              </div>
              <button type="submit" className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors">
                Unlock
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAFAFA]">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex items-center gap-6 border-b border-stone-200/50 mb-8">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'products' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('links')} 
            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'links' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            Manage Navigation Links
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/50 sticky top-28">
                <h2 className="text-xl font-medium text-stone-800 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                
                {statusMessage && (
                  <div className={`mb-4 p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 ${
                    statusMessage.type === 'error' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200/80' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  }`}>
                    {statusMessage.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    )}
                    <span className="flex-1 leading-relaxed">{statusMessage.text}</span>
                    <button 
                      type="button" 
                      onClick={() => setStatusMessage(null)} 
                      className="text-current opacity-60 hover:opacity-100 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Product Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="E.g. Ceramic Mug" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Selling Price</label>
                      <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="₹3,499" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">M.R.P (Optional)</label>
                      <input type="text" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="₹4,999" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Discount % (Optional)</label>
                      <input type="text" name="discount" value={formData.discount} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="30%" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Rating (1-5)</label>
                      <input type="number" step="0.1" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="4.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Category</label>
                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                      <option value="" disabled>Select a category</option>
                      {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="Product details..." />
                  </div>

                  {/* Product Image Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-stone-700">Product Image</label>
                      <span className="text-[11px] text-stone-400 font-medium">URL or Device Upload</span>
                    </div>

                    {/* Mode Toggle */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-lg mb-2.5">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                          imageInputMode === 'url'
                            ? 'bg-white text-stone-900 shadow-xs'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Image URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                          imageInputMode === 'upload'
                            ? 'bg-white text-stone-900 shadow-xs'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    {/* Image URL Input Option */}
                    {imageInputMode === 'url' ? (
                      <div className="space-y-1.5">
                        <div className="relative">
                          <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                            onChange={(e) => {
                              setImageLoadError(false);
                              setFormData(prev => ({ ...prev, imageUrl: e.target.value.trim() }));
                            }}
                            placeholder="https://images.unsplash.com/... or CDN link"
                            className="w-full h-10 pl-3 pr-8 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
                          />
                          {formData.imageUrl && !formData.imageUrl.startsWith('data:') && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, imageUrl: '' }));
                                setImageLoadError(false);
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                              title="Clear URL"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Paste a direct web image link (JPEG, PNG, WEBP, or Unsplash URL).
                        </p>
                      </div>
                    ) : (
                      /* Upload File Option */
                      <div className="space-y-1.5">
                        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 border-dashed rounded-lg cursor-pointer transition-colors w-full">
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                          ) : (
                            <Upload className="w-4 h-4 text-stone-600" />
                          )}
                          <span className="text-xs font-medium text-stone-700">
                            {isUploading ? 'Compressing & uploading...' : 'Choose image file from device'}
                          </span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <p className="text-[11px] text-stone-500">
                          Max 5MB (JPG, PNG, WEBP). Compressed automatically.
                        </p>
                      </div>
                    )}

                    {/* Attached Image Preview Card */}
                    {formData.imageUrl && (
                      <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-lg overflow-hidden border border-stone-200 shrink-0 ${formData.imageBgColor || 'bg-stone-100'} flex items-center justify-center relative`}>
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => setImageLoadError(true)}
                            onLoad={() => setImageLoadError(false)}
                          />
                          {imageLoadError && (
                            <div className="absolute inset-0 bg-rose-50/95 text-rose-600 flex flex-col items-center justify-center p-1 text-[10px] text-center font-medium">
                              <AlertCircle className="w-3.5 h-3.5 mb-0.5" />
                              <span>Invalid link</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${imageLoadError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span className="text-xs font-medium text-stone-800">
                              {imageLoadError ? 'Image failed to load' : 'Image attached'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 truncate mt-0.5">
                            {formData.imageUrl.startsWith('data:') ? 'Uploaded local file (Base64)' : formData.imageUrl}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                            setImageLoadError(false);
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-200/60 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Additional Images Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-stone-700">Additional Images (Optional)</label>
                      <span className="text-[11px] text-stone-400 font-medium">Gallery</span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {/* Add via URL */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={additionalImageUrl}
                          onChange={(e) => setAdditionalImageUrl(e.target.value)}
                          placeholder="Attach extra image by URL..."
                          className="flex-1 h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAdditionalImageUrl();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalImageUrl}
                          disabled={!additionalImageUrl.trim()}
                          className="px-3 h-9 bg-stone-100 hover:bg-stone-200 text-stone-800 disabled:opacity-50 text-xs font-medium rounded-lg border border-stone-200 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add URL</span>
                        </button>
                      </div>

                      {/* Add via File Upload */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-200 transition-colors text-xs font-medium text-stone-700">
                          {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>Upload extra file</span>
                          <input type="file" accept="image/*" onChange={handleAdditionalImageUpload} className="hidden" />
                        </label>
                        <span className="text-[11px] text-stone-400">or paste direct image URL above</span>
                      </div>
                    </div>

                    {/* Attached Gallery Grid */}
                    {formData.additionalImages && formData.additionalImages.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                        {formData.additionalImages.map((img, idx) => (
                          <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-white group shadow-xs">
                            <img
                              src={img}
                              alt={`Additional ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/999999?text=Error' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              className="absolute inset-0 bg-stone-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Product Type</label>
                    <select required name="type" value={formData.type} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                      <option value="affiliate">Affiliate Product (External Link)</option>
                      <option value="buy">Direct Buy (Razorpay Checkout)</option>
                    </select>
                  </div>

                  {formData.type === 'affiliate' && (
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Affiliate Link</label>
                      <input required={formData.type === 'affiliate'} type="url" name="affiliateUrl" value={formData.affiliateUrl} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="https://amazon.com/..." />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Background Color Class</label>
                    <select name="imageBgColor" value={formData.imageBgColor} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                      <option value="bg-stone-100">Stone</option>
                      <option value="bg-rose-50">Rose</option>
                      <option value="bg-teal-50">Teal</option>
                      <option value="bg-sky-50">Sky</option>
                      <option value="bg-amber-50">Amber</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="hasSizes" name="hasSizes" checked={formData.hasSizes} onChange={handleChange} className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
                    <label htmlFor="hasSizes" className="text-sm font-medium text-stone-600">Product has clothing sizes</label>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button 
                      type="submit" 
                      disabled={isUploading || !formData.imageUrl} 
                      className="flex-1 h-10 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {editingId ? (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Update Product
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Product
                        </>
                      )}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 h-10 border border-stone-200 hover:bg-stone-100 text-stone-600 font-medium rounded-lg text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-medium text-stone-800 mb-6">Manage Products ({products.length})</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden">
                <ul className="divide-y divide-stone-100">
                  {products.map(product => (
                    <li key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-stone-50 transition-colors">
                      <div className={`w-16 h-16 rounded-lg ${product.imageBgColor || 'bg-stone-100'} flex-shrink-0 overflow-hidden relative border border-stone-200/60`}>
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/999999?text=Error' }} 
                        />
                        {product.additionalImages && product.additionalImages.length > 0 && (
                          <div className="absolute bottom-0 right-0 bg-stone-900/80 text-white text-[9px] px-1 py-0.5 rounded-tl font-medium">
                            +{product.additionalImages.length}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-stone-800 truncate">{product.name}</h3>
                          {product.imageUrl?.startsWith('http') && (
                            <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-mono shrink-0">
                              URL
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          {product.category} • {product.price} {product.mrp && <span className="line-through opacity-70 ml-1">{product.mrp}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        {product.type === 'buy' ? (
                          <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded">Buy Now</span>
                        ) : (
                          <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-stone-500 hover:text-stone-800 underline truncate max-w-[150px]">
                            View Link
                          </a>
                        )}
                        <button onClick={() => handleEditClick(product)} className="p-2 text-stone-400 hover:text-stone-700 transition-colors ml-auto sm:ml-0" title="Edit Product">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeProduct(product.id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors" title="Delete Product">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                  {products.length === 0 && (
                    <li className="p-8 text-center text-stone-500 text-sm">No products added yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/50 sticky top-28">
                <h2 className="text-xl font-medium text-stone-800 mb-6">{editingLinkId ? 'Edit Link' : 'Add New Link'}</h2>
                
                <form onSubmit={handleLinkSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Label Name</label>
                    <input required type="text" name="label" value={linkFormData.label} onChange={handleLinkChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="E.g. Workspace" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Destination URL</label>
                    <input required type="text" name="url" value={linkFormData.url} onChange={handleLinkChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="/" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Section</label>
                    <select name="section" value={linkFormData.section} onChange={handleLinkChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                      <option value="explore">Explore (Header & Footer)</option>
                      <option value="legal">Legal (Footer only)</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full h-10 mt-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                    {editingLinkId ? (
                      <>
                        <Edit2 className="w-4 h-4" />
                        Update Link
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Link
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-medium text-stone-800 mb-6">Manage Links</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden">
                <ul className="divide-y divide-stone-100">
                  {links.map(link => (
                    <li key={link.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-stone-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-medium text-stone-800 truncate">{link.label}</h3>
                        <p className="text-xs text-stone-500 truncate">
                          {link.url} • {link.section === 'explore' ? 'Explore Section' : 'Legal Section'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <button onClick={() => handleEditLinkClick(link)} className="p-2 text-stone-400 hover:text-stone-700 transition-colors ml-auto sm:ml-0" title="Edit Link">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeLink(link.id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors" title="Delete Link">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                  {links.length === 0 && (
                    <li className="p-8 text-center text-stone-500 text-sm">No links added yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
