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
  RotateCcw
} from 'lucide-react';
import { Product, NavLink } from '../types';
import { allCategories } from '../data';
import imageCompression from 'browser-image-compression';

export default function Admin() {
  const { products, addProduct, removeProduct, editProduct, resetToDefaults: resetProducts } = useProducts();
  const { links, addLink, removeLink, editLink, resetToDefaults: resetLinks } = useNavLinks();
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
        text: 'Unsupported file format. Please upload a valid image file (JPG, PNG, WEBP).'
      });
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      setStatusMessage({
        type: 'error',
        text: 'Image size exceeds maximum limit of 5MB.'
      });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const options = {
        maxSizeMB: 0.25,
        maxWidthOrHeight: 1000,
        useWebWorker: false,
      };
      
      const compressedFile = await imageCompression(file, options);
      const base64String = await imageCompression.getDataUrlFromFile(compressedFile);
      
      setFormData(prev => ({ ...prev, imageUrl: base64String })); 
      setStatusMessage({ type: 'success', text: 'Image uploaded and processed successfully.' });
    } catch (err) {
      console.error("Upload failed", err);
      let errorMessage = "Failed to process image. Please try another image.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setStatusMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
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
        maxSizeMB: 0.2,
        maxWidthOrHeight: 900,
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
      e.target.value = '';
    }
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
    setStatusMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.imageUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Please upload a product image.' });
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
      const newProduct: Product = {
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
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLinkId) {
      editLink({
        id: editingLinkId,
        ...linkFormData
      });
      setEditingLinkId(null);
      setStatusMessage({ type: 'success', text: 'Navigation link updated successfully.' });
    } else {
      const newLink: NavLink = {
        id: Date.now().toString(),
        ...linkFormData
      };
      addLink(newLink);
      setStatusMessage({ type: 'success', text: 'Navigation link added successfully.' });
    }

    setLinkFormData({
      label: '',
      url: '',
      section: 'explore'
    });
  };

  const handleEditClick = (product: Product) => {
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
    setStatusMessage(null);
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

  const handleResetProducts = () => {
    if (window.confirm("Restore original full collection products? Any custom additions will be replaced with defaults.")) {
      resetProducts();
      setStatusMessage({ type: 'success', text: 'All products restored to original website theme collection.' });
    }
  };

  const handleResetLinks = () => {
    if (window.confirm("Restore default navigation links?")) {
      resetLinks();
      setStatusMessage({ type: 'success', text: 'Navigation links restored to defaults.' });
    }
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
              <button type="submit" className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors cursor-pointer">
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
        <div className="flex items-center justify-between border-b border-stone-200/50 mb-8 pb-1">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('products')} 
              className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${activeTab === 'products' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
            >
              Manage Products ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab('links')} 
              className={`pb-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${activeTab === 'links' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
            >
              Manage Navigation Links ({links.length})
            </button>
          </div>
          <div>
            {activeTab === 'products' ? (
              <button
                type="button"
                onClick={handleResetProducts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                title="Restore default collection products"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Theme Defaults</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetLinks}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                title="Restore default navigation links"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Links</span>
              </button>
            )}
          </div>
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
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="E.g. Walnut Desk Shelf" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Product Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${formData.type === 'affiliate' ? 'border-stone-900 bg-stone-50 text-stone-900' : 'border-stone-200 hover:bg-stone-50 text-stone-600'}`}>
                        <input type="radio" name="type" value="affiliate" checked={formData.type === 'affiliate'} onChange={handleChange} className="hidden" />
                        <span className="text-sm font-medium">Affiliate Link</span>
                      </label>
                      <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${formData.type === 'buy' ? 'border-stone-900 bg-stone-50 text-stone-900' : 'border-stone-200 hover:bg-stone-50 text-stone-600'}`}>
                        <input type="radio" name="type" value="buy" checked={formData.type === 'buy'} onChange={handleChange} className="hidden" />
                        <span className="text-sm font-medium">Direct Purchase</span>
                      </label>
                    </div>
                  </div>

                  {formData.type === 'affiliate' && (
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Affiliate Link (URL)</label>
                      <input required type="url" name="affiliateUrl" value={formData.affiliateUrl} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="https://amazon.com/..." />
                    </div>
                  )}

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

                  {/* Clean Device Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Product Image</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg cursor-pointer transition-colors">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-stone-600" /> : <Upload className="w-4 h-4 text-stone-600" />}
                        <span className="text-sm font-medium text-stone-700">{isUploading ? 'Uploading...' : 'Choose Image'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {formData.imageUrl && (
                        <div className="relative group">
                          <div className="h-12 w-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/999999?text=Error' }} />
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                            className="absolute -top-1.5 -right-1.5 bg-stone-800 text-white rounded-full p-0.5 shadow hover:bg-rose-600 transition-colors"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    {!formData.imageUrl && (
                      <p className="text-xs text-stone-400 mt-1">Select an image file from your device (JPG, PNG, WEBP, up to 5MB).</p>
                    )}
                  </div>

                  {/* Additional Images (Upload only) */}
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Additional Images (Optional)</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg cursor-pointer transition-colors text-xs font-medium text-stone-700">
                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>Add Image</span>
                        <input type="file" accept="image/*" onChange={handleAdditionalImageUpload} className="hidden" />
                      </label>
                      {formData.additionalImages?.map((img, idx) => (
                        <div key={idx} className="relative h-12 w-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-50 group">
                          <img src={img} alt={`Additional ${idx + 1}`} className="w-full h-full object-cover" />
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Image Background Tint</label>
                    <select name="imageBgColor" value={formData.imageBgColor} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                      <option value="bg-stone-100">Stone 100 (Default Neutral)</option>
                      <option value="bg-[#F2EFE9]">Warm Sand / Ivory (#F2EFE9)</option>
                      <option value="bg-[#EDEDED]">Cool Grey (#EDEDED)</option>
                      <option value="bg-[#F5F2ED]">Soft Cream (#F5F2ED)</option>
                      <option value="bg-[#F4F0EB]">Warm Linen (#F4F0EB)</option>
                      <option value="bg-[#ECE8E1]">Muted Khaki (#ECE8E1)</option>
                      <option value="bg-[#F2EFEA]">Oatmeal (#F2EFEA)</option>
                      <option value="bg-[#EFECE8]">Pebble (#EFECE8)</option>
                      <option value="bg-[#EAE8E3]">Muted Taupe (#EAE8E3)</option>
                      <option value="bg-white">Pure White</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="hasSizes" name="hasSizes" checked={formData.hasSizes} onChange={handleChange} className="rounded border-stone-300 text-stone-900 focus:ring-stone-900/20" />
                    <label htmlFor="hasSizes" className="text-sm font-medium text-stone-600">Product has clothing sizes</label>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button 
                      type="submit" 
                      disabled={isUploading || !formData.imageUrl} 
                      className="flex-1 h-10 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
                        className="px-4 h-10 border border-stone-200 hover:bg-stone-100 text-stone-600 font-medium rounded-lg text-sm transition-colors cursor-pointer"
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-stone-800">Products ({products.length})</h2>
              </div>
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
                        <button onClick={() => handleEditClick(product)} className="p-2 text-stone-400 hover:text-stone-700 transition-colors ml-auto sm:ml-0 cursor-pointer" title="Edit Product">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeProduct(product.id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer" title="Delete Product">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                  {products.length === 0 && (
                    <li className="p-8 text-center text-stone-500 text-sm">No products in collection.</li>
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

                  <button type="submit" className="w-full h-10 mt-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
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
              <h2 className="text-xl font-medium text-stone-800 mb-6">Manage Links ({links.length})</h2>
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
                        <button onClick={() => handleEditLinkClick(link)} className="p-2 text-stone-400 hover:text-stone-700 transition-colors ml-auto sm:ml-0 cursor-pointer" title="Edit Link">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeLink(link.id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer" title="Delete Link">
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
