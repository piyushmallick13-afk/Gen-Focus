import React, { useState } from 'react';
import { CategoryDetail, CategoryGroup } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Layers, 
  Check, 
  X, 
  RotateCcw, 
  Upload, 
  Loader2, 
  Sparkles,
  ArrowRight,
  FolderPlus
} from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface AdminCategoriesProps {
  categories: CategoryDetail[];
  onAddCategory: (category: Omit<CategoryDetail, 'id'> & { id?: string }) => Promise<void>;
  onEditCategory: (id: string, updated: Partial<CategoryDetail>) => Promise<void>;
  onRemoveCategory: (id: string) => Promise<void>;
  onResetDefaults: () => Promise<void>;
}

export default function AdminCategories({
  categories,
  onAddCategory,
  onEditCategory,
  onRemoveCategory,
  onResetDefaults
}: AdminCategoriesProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryDetail | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Form states for active editor
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);

  // Inputs for adding new items
  const [newTagInput, setNewTagInput] = useState('');
  const [newGroupTitleInput, setNewGroupTitleInput] = useState('');
  const [newGroupItemInputs, setNewGroupItemInputs] = useState<Record<number, string>>({});

  const showSuccess = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorNotice(msg);
    setTimeout(() => setErrorNotice(null), 4000);
  };

  const startEdit = (cat: CategoryDetail) => {
    setIsCreating(false);
    setEditingCategory(cat);
    setName(cat.name);
    setTagline(cat.tagline || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setOrder(cat.order ?? 0);
    setPopularTags([...(cat.popularTags || [])]);
    setGroups(JSON.parse(JSON.stringify(cat.groups || [])));
    setNewTagInput('');
    setNewGroupTitleInput('');
    setNewGroupItemInputs({});
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingCategory({
      name: '',
      tagline: '',
      description: '',
      image: '',
      popularTags: [],
      groups: []
    });
    setName('');
    setTagline('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop');
    setOrder(categories.length);
    setPopularTags(['Featured', 'Essentials']);
    setGroups([
      { title: 'Core Collection', items: ['Staples', 'New Arrivals'] }
    ]);
    setNewTagInput('');
    setNewGroupTitleInput('');
    setNewGroupItemInputs({});
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setIsCreating(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 800,
        useWebWorker: false
      };
      const compressedFile = await imageCompression(file, options);
      const base64String = await imageCompression.getDataUrlFromFile(compressedFile);
      setImage(base64String);
    } catch (err) {
      console.error("Image upload failed", err);
      showError("Failed to process image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Popular Tag Handlers
  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (!popularTags.includes(trimmed)) {
      setPopularTags([...popularTags, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    setPopularTags(popularTags.filter((_, i) => i !== index));
  };

  // Subcategory Group Handlers
  const handleAddGroup = () => {
    const trimmed = newGroupTitleInput.trim();
    if (!trimmed) return;
    setGroups([...groups, { title: trimmed, items: [] }]);
    setNewGroupTitleInput('');
  };

  const handleRemoveGroup = (groupIndex: number) => {
    setGroups(groups.filter((_, i) => i !== groupIndex));
  };

  const handleGroupTitleChange = (groupIndex: number, val: string) => {
    setGroups(groups.map((g, i) => i === groupIndex ? { ...g, title: val } : g));
  };

  const handleAddGroupItem = (groupIndex: number) => {
    const val = (newGroupItemInputs[groupIndex] || '').trim();
    if (!val) return;
    setGroups(groups.map((g, i) => {
      if (i === groupIndex) {
        return { ...g, items: [...g.items, val] };
      }
      return g;
    }));
    setNewGroupItemInputs({ ...newGroupItemInputs, [groupIndex]: '' });
  };

  const handleRemoveGroupItem = (groupIndex: number, itemIndex: number) => {
    setGroups(groups.map((g, i) => {
      if (i === groupIndex) {
        return { ...g, items: g.items.filter((_, idx) => idx !== itemIndex) };
      }
      return g;
    }));
  };

  // Save changes to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Category name is required.");
      return;
    }

    const payload: CategoryDetail = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      image: image.trim(),
      order: Number(order) || 0,
      popularTags,
      groups
    };

    if (isCreating) {
      const generatedId = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now().toString();
      await onAddCategory({ ...payload, id: generatedId });
      showSuccess(`Created category "${payload.name}"! Changes are live.`);
    } else if (editingCategory?.id) {
      await onEditCategory(editingCategory.id, payload);
      showSuccess(`Updated "${payload.name}" successfully! Changes are live.`);
    }

    setEditingCategory(null);
    setIsCreating(false);
  };

  const handleDelete = (cat: CategoryDetail) => {
    if (!cat.id) return;
    setConfirmModal({
      title: `Delete Category "${cat.name}"?`,
      message: `Are you sure you want to remove "${cat.name}"? This department will be removed from navigation flyouts, store filters, and product assignments.`,
      onConfirm: async () => {
        await onRemoveCategory(cat.id!);
        showSuccess(`Deleted category "${cat.name}".`);
        if (editingCategory?.id === cat.id) {
          setEditingCategory(null);
        }
        setConfirmModal(null);
      }
    });
  };

  const handleResetDefaults = () => {
    setConfirmModal({
      title: "Reset Catalog to Default Categories?",
      message: "This will restore the curated departments (Men's Fashion, Women's Fashion, Footwear, and Accessories) with their preconfigured subcategories. Any custom departments will be replaced.",
      onConfirm: async () => {
        await onResetDefaults();
        showSuccess("Categories reset to default collections.");
        setEditingCategory(null);
        setConfirmModal(null);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header and control bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4 text-stone-900" />
            <span>Curated Taxonomy Controls</span>
          </div>
          <h2 className="text-xl font-display font-medium text-stone-900">
            Departments & Subcategories Manager
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Rename departments, add new collections, modify subcategories, and customize mega menus in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Restore initial Men's Fashion, Women's Fashion, Footwear, Accessories"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Department</span>
          </button>
        </div>
      </div>

      {/* Live notification feedback */}
      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2 shadow-sm">
          <X className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Main Grid: Categories list on left, Editor on right (or stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Cards Column */}
        <div className={`space-y-4 ${editingCategory ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between text-xs text-stone-400 font-semibold uppercase tracking-wider px-1">
            <span>Current Departments ({categories.length})</span>
            <span>Live on Site</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {categories.map((cat, idx) => {
              const isSelected = editingCategory?.id === cat.id;
              const totalItems = (cat.groups || []).reduce((acc, g) => acc + (g.items?.length || 0), 0);

              return (
                <div
                  key={cat.id || idx}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-sm ${
                    isSelected 
                      ? 'border-stone-900 ring-2 ring-stone-900/10' 
                      : 'border-stone-200/70 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/50">
                      {cat.image ? (
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs font-mono">
                          IMG
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-medium text-stone-900 text-base truncate">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
                          Order #{cat.order ?? idx}
                        </span>
                      </div>
                      
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {cat.tagline || 'No tagline specified'}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-stone-600">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-stone-400" />
                          {cat.popularTags?.length || 0} Quick Tags
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-stone-400" />
                          {cat.groups?.length || 0} Groups ({totalItems} items)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subcategory Pill Preview */}
                  {cat.popularTags && cat.popularTags.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                      {cat.popularTags.slice(0, 5).map(tag => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 bg-stone-50 text-stone-600 rounded-md border border-stone-100">
                          {tag}
                        </span>
                      ))}
                      {cat.popularTags.length > 5 && (
                        <span className="text-[10px] text-stone-400 px-1 py-0.5">
                          +{cat.popularTags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Manage</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor Form Column */}
        {editingCategory && (
          <div className="lg:col-span-7 sticky top-28 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-200/80">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/60 mb-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                  {isCreating ? 'Create New' : 'Edit Department'}
                </span>
                <h3 className="text-xl font-display font-medium text-stone-900">
                  {name ? name : 'Untitled Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={cancelEdit}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Category Core Attributes */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Department / Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Men's Fashion, Winter Edit, Living"
                      className="w-full h-10 px-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Tagline (Headline in Mega Menu)
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Refined essentials & contemporary tailoring"
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief department overview displayed to customers in the hover preview."
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Cover Image URL or Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 h-10 px-3.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                    />
                    <label className="h-10 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Subcategories & Quick Tags */}
              <div className="pt-4 border-t border-stone-200/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-stone-400" />
                    <span>Popular Quick Tags / Subcategories</span>
                  </label>
                  <span className="text-[11px] text-stone-400">Pills displayed in flyouts</span>
                </div>

                {/* Tag chips */}
                <div className="flex flex-wrap gap-1.5 mb-3 min-h-[36px] p-2 bg-stone-50 rounded-xl border border-stone-200/60">
                  {popularTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 text-stone-800 text-xs rounded-lg shadow-2xs"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-stone-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {popularTags.length === 0 && (
                    <span className="text-xs text-stone-400 italic p-1">No tags yet. Add one below.</span>
                  )}
                </div>

                {/* Add new tag input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add subcategory tag (e.g. Heavyweight Tees, Overshirts)..."
                    className="flex-1 h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 h-9 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tag</span>
                  </button>
                </div>
              </div>

              {/* Subcategory Groups (The Mega Flyout Section) */}
              <div className="pt-4 border-t border-stone-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-stone-400" />
                      <span>Subcategory Groups ({groups.length})</span>
                    </label>
                    <p className="text-[11px] text-stone-400">Organized columns in the mega menu</p>
                  </div>
                </div>

                {/* Groups list */}
                <div className="space-y-4">
                  {groups.map((group, groupIdx) => (
                    <div key={groupIdx} className="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={group.title}
                          onChange={(e) => handleGroupTitleChange(groupIdx, e.target.value)}
                          placeholder="Group Title (e.g. Tops & Shirts)"
                          className="font-medium text-xs text-stone-900 bg-white border border-stone-200 rounded-md px-2.5 py-1 w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGroup(groupIdx)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete this group"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Items in this group */}
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-200 text-stone-700 text-xs rounded-md"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveGroupItem(groupIdx, itemIdx)}
                              className="text-stone-400 hover:text-rose-500"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add item to this group */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGroupItemInputs[groupIdx] || ''}
                          onChange={(e) => setNewGroupItemInputs({ ...newGroupItemInputs, [groupIdx]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddGroupItem(groupIdx);
                            }
                          }}
                          placeholder="Add subcategory item (e.g. Linen Shirts)..."
                          className="flex-1 h-8 px-2.5 rounded-md border border-stone-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddGroupItem(groupIdx)}
                          className="px-2.5 h-8 bg-stone-200/70 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-md transition-colors"
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add new group section */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newGroupTitleInput}
                      onChange={(e) => setNewGroupTitleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGroup();
                        }
                      }}
                      placeholder="New group title (e.g. Seasonal Drops, Accessories)..."
                      className="flex-1 h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                    />
                    <button
                      type="button"
                      onClick={handleAddGroup}
                      className="px-3 h-9 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Add Group</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-6 border-t border-stone-200/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreating ? 'Publish Category' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200/80 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-stone-900">
              {confirmModal.title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
