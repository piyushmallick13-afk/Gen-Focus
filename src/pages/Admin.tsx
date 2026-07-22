import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useNavLinks } from '../hooks/useNavLinks';
import { Plus, Trash2, Lock, Edit2, Link as LinkIcon } from 'lucide-react';
import { NavLink } from '../types';

export default function Admin() {
  const { products, addProduct, removeProduct, editProduct } = useProducts();
  const { links, addLink, removeLink, editLink } = useNavLinks();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'links'>('products');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    discount: '',
    imageUrl: '',
    affiliateUrl: '',
    category: '',
    imageBgColor: 'bg-stone-100',
    rating: ''
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
      imageBgColor: 'bg-stone-100',
      rating: ''
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
      imageBgColor: product.imageBgColor || 'bg-stone-100',
      rating: product.rating ? product.rating.toString() : ''
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
                      <option value="bg-stone-100">Stone</option>
                      <option value="bg-rose-50">Rose</option>
                      <option value="bg-teal-50">Teal</option>
                      <option value="bg-sky-50">Sky</option>
                      <option value="bg-amber-50">Amber</option>
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
              <h2 className="text-xl font-medium text-stone-800 mb-6">Manage Products</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden">
                <ul className="divide-y divide-stone-100">
                  {products.map(product => (
                    <li key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-stone-50 transition-colors">
                      <div className={`w-16 h-16 rounded-lg ${product.imageBgColor || 'bg-stone-100'} flex-shrink-0 overflow-hidden relative`}>
                        <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-medium text-stone-800 truncate">{product.name}</h3>
                        <p className="text-xs text-stone-500 truncate">
                          {product.category} • {product.price} {product.mrp && <span className="line-through opacity-70 ml-1">{product.mrp}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-stone-500 hover:text-stone-800 underline truncate max-w-[150px]">
                          View Link
                        </a>
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
