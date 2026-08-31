import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useNavLinks } from '../hooks/useNavLinks';
import { useSettings } from '../hooks/useSettings';
import { Plus, Trash2, Lock, Edit2, Link as LinkIcon, Save } from 'lucide-react';
import { NavLink } from '../types';

export default function Admin() {
  const { products, addProduct, removeProduct, editProduct } = useProducts();
  const { links, addLink, removeLink, editLink } = useNavLinks();
  const { settings, updateSettings } = useSettings();
  const [settingsFormData, setSettingsFormData] = useState({ videoUrl: '', showVideo: false });

  React.useEffect(() => {
    setSettingsFormData({
      videoUrl: settings?.videoUrl || '',
      showVideo: settings?.showVideo || false
    });
  }, [settings]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'links' | 'settings'>('products');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    discount: '',
    imageUrl: '',
    affiliateUrl: '',
    category: '',
    imageBgColor: 'bg-stone-50',
    rating: '',
    status: 'available'
  });

  const [linkFormData, setLinkFormData] = useState({
    label: '',
    url: '',
    section: 'explore' as 'explore' | 'legal'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLinkFormData({ ...linkFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      editProduct({
        id: editingId,
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined
      });
      setEditingId(null);
    } else {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined
      };
      addProduct(newProduct);
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
      imageBgColor: 'bg-stone-50',
      rating: '',
      status: 'available'
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
      imageUrl: product.imageUrl,
      affiliateUrl: product.affiliateUrl,
      category: product.category,
      imageBgColor: product.imageBgColor || 'bg-stone-50',
      rating: product.rating ? product.rating.toString() : '',
      status: product.status || 'available'
    });
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

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');
    
    let currentVideoUrl = settingsFormData.videoUrl;

    if (videoFile) {
      const sizeMB = videoFile.size / (1024 * 1024);
      if (sizeMB < 2 || sizeMB > 5) {
        setSettingsError(`Video size is ${sizeMB.toFixed(2)} MB. It must be between 2 MB and 5 MB.`);
        return;
      }
      
      setIsUploading(true);
      const formData = new FormData();
      formData.append('video', videoFile);
      
      try {
        const response = await fetch('/upload-video', {
          method: 'POST',
          body: formData,
        });
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
          }
          currentVideoUrl = data.url;
        } else {
          const text = await response.text();
          if (response.status === 413) {
            throw new Error('File is too large for the server configuration. Please try a smaller video.');
          }
          if (response.status === 404) {
             throw new Error('Upload endpoint not found (404). The server might be still starting up, or this feature is not supported in the current hosting environment.');
          }
          throw new Error(`Upload failed with status ${response.status}. The server may be restarting, please try again in a few seconds.`);
        }
        setSettingsFormData(prev => ({ ...prev, videoUrl: currentVideoUrl }));
        setVideoFile(null); // Clear selected file after upload
      } catch (err: any) {
        setSettingsError(err.message || 'Failed to upload video');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    
    updateSettings({ videoUrl: currentVideoUrl, showVideo: settingsFormData.showVideo });
    setSettingsSuccess('Settings saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
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
      <div className="min-h-screen flex flex-col font-sans bg-stone-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 w-full max-w-md">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-medium text-stone-900">Admin Access</h2>
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
                {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
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
    <div className="min-h-screen flex flex-col font-sans bg-stone-50">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex items-center gap-6 border-b border-stone-200 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'products' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('links')} 
            className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'links' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Manage Navigation Links
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'settings' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Site Settings
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-28">
                <h2 className="text-xl font-medium text-stone-900 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                
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
                      <optgroup label="Electronics & Gadgets">
                        <option value="Smartphones & Accessories">Smartphones & Accessories</option>
                        <option value="Computers & Laptops">Computers & Laptops</option>
                        <option value="Audio & Headphones">Audio & Headphones</option>
                        <option value="Wearable Technology">Wearable Technology</option>
                      </optgroup>
                      <optgroup label="Clothing & Apparel">
                        <option value="Men's Fashion">Men's Fashion</option>
                        <option value="Women's Fashion">Women's Fashion</option>
                        <option value="Kid's Fashion">Kid's Fashion</option>
                        <option value="Boy's Fashion">Boy's Fashion</option>
                        <option value="Girl's Fashion">Girl's Fashion</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Accessories">Accessories</option>
                      </optgroup>
                      <optgroup label="Sports & Fitness">
                        <option value="Activewear & Apparel">Activewear & Apparel</option>
                        <option value="Fitness & Training">Fitness & Training</option>
                        <option value="Outdoor Sports">Outdoor Sports</option>
                        <option value="Team Sports">Team Sports</option>
                      </optgroup>
                      <optgroup label="Home & Living">
                        <option value="Furniture">Furniture</option>
                        <option value="Home Decor">Home Decor</option>
                        <option value="Kitchen & Dining">Kitchen & Dining</option>
                        <option value="Bed & Bath">Bed & Bath</option>
                      </optgroup>
                      <optgroup label="Health & Nutrition">
                        <option value="Supplements & Vitamins">Supplements & Vitamins</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Medical Supplies">Medical Supplies</option>
                      </optgroup>
                      <optgroup label="Hobbies & Entertainment">
                        <option value="Gaming">Gaming</option>
                        <option value="Toys & Collectibles">Toys & Collectibles</option>
                        <option value="Books & Media">Books & Media</option>
                        <option value="Smart Toys & Drones">Smart Toys & Drones</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option value="Coming Soon">Coming Soon</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                      <option value="available">Available</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="Product details..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Image URL</label>
                    <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="https://..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Affiliate Link</label>
                    <input required type="url" name="affiliateUrl" value={formData.affiliateUrl} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="https://amazon.com/..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Background Color Class</label>
                    <select name="imageBgColor" value={formData.imageBgColor} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10">
                      <option value="bg-stone-50">Stone</option>
                      <option value="bg-red-50">Red</option>
                      <option value="bg-slate-50">Slate</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full h-10 mt-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
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
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-medium text-stone-900 mb-6">Manage Products</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <ul className="divide-y divide-stone-100">
                  {products.map(product => (
                    <li key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-stone-50 transition-colors">
                      <div className={`w-16 h-16 rounded-lg ${product.imageBgColor || 'bg-stone-50'} flex-shrink-0 overflow-hidden relative`}>
                        <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-medium text-stone-900 truncate">{product.name}</h3>
                        <p className="text-xs text-stone-500 truncate">
                          {product.category} • {product.price} {product.mrp && <span className="line-through opacity-70 ml-1">{product.mrp}</span>} {product.status === 'coming-soon' ? <span className="text-orange-600 font-medium"> • Coming Soon</span> : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-stone-500 hover:text-stone-900 underline truncate max-w-[150px]">
                          View Link
                        </a>
                        <button onClick={() => handleEditClick(product)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors ml-auto sm:ml-0" title="Edit Product">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeProduct(product.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors" title="Delete Product">
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
        ) : activeTab === 'links' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-28">
                <h2 className="text-xl font-medium text-stone-900 mb-6">{editingLinkId ? 'Edit Link' : 'Add New Link'}</h2>
                
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
              <h2 className="text-xl font-medium text-stone-900 mb-6">Manage Links</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <ul className="divide-y divide-stone-100">
                  {links.map(link => (
                    <li key={link.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-stone-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-stone-900">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-medium text-stone-900 truncate">{link.label}</h3>
                        <p className="text-xs text-stone-500 truncate">
                          {link.url} • {link.section === 'explore' ? 'Explore Section' : 'Legal Section'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <button onClick={() => handleEditLinkClick(link)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors ml-auto sm:ml-0" title="Edit Link">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeLink(link.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors" title="Delete Link">
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-28">
                <h2 className="text-xl font-medium text-stone-900 mb-6">Site Settings</h2>
                
                {settingsError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                    {settingsError}
                  </div>
                )}
                {settingsSuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-700">
                    {settingsSuccess}
                  </div>
                )}

                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Product Showcase Video</label>
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setVideoFile(e.target.files[0]);
                        }
                      }} 
                      className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 focus:outline-none" 
                    />
                    <p className="text-xs text-stone-500 mt-2">Upload a video between 2 MB and 5 MB to show on the front page.</p>
                    {videoFile && (
                      <p className="text-xs text-stone-700 mt-1 font-medium">
                        Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <input 
                      type="checkbox" 
                      id="showVideo" 
                      checked={settingsFormData.showVideo || false} 
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, showVideo: e.target.checked })} 
                      className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-900/20"
                    />
                    <label htmlFor="showVideo" className="text-sm text-stone-700 font-medium">
                      Show Video on Front Page
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className="w-full h-10 mt-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isUploading ? 'Uploading & Saving...' : 'Save Settings'}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl font-medium text-stone-900 mb-6">Video Preview</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden p-6 aspect-video flex items-center justify-center relative">
                {videoFile ? (
                  <video src={URL.createObjectURL(videoFile)} controls className="w-full h-full object-contain rounded-xl bg-stone-900" />
                ) : settingsFormData.videoUrl ? (
                  <video src={settingsFormData.videoUrl} controls className="w-full h-full object-contain rounded-xl bg-stone-900" />
                ) : (
                  <div className="text-center text-stone-400">
                    <p>No video uploaded yet.</p>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="text-stone-900 font-medium flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
