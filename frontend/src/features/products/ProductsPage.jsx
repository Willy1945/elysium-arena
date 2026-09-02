import { useState, useEffect, useCallback } from 'react';
import { Plus, Tag, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProductCard from './ProductCard';
import ProductFormModal from './ProductFormModal';
import AdjustStockModal from './AdjustStockModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { useToast } from '../../context/ToastContext';

function ManageCategoriesModal({ open, onClose, categories, onRefresh }) {
  const toast = useToast();
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await categoryService.create(newName);
      toast.success('Kategori berhasil ditambahkan.');
      setNewName('');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambah kategori.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kategori ini?')) return;
    try {
      await categoryService.remove(id);
      toast.success('Kategori berhasil dihapus.');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus kategori.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-border rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">Kelola Kategori</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={20} /></button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            placeholder="Nama kategori baru"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" disabled={saving} className="bg-accent text-white text-sm px-3 rounded disabled:opacity-50">Tambah</button>
        </form>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-surface-inset rounded px-3 py-2">
              <span className="text-text-primary text-sm">{c.name}</span>
              <button onClick={() => handleDelete(c.id)} className="text-status-occupied text-xs hover:underline">Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(() => {
    categoryService.getAll().then(({ data }) => setCategories(data.data));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') {
        const cat = categories.find((c) => c.name === activeFilter);
        if (cat) params.category_id = cat.id;
      }
      if (search) params.search = search;
      const { data } = await productService.getAll(params);
      setProducts(data.data);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search, categories]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleOpenCreate = () => { setEditingProduct(null); setModalOpen(true); };
  const handleOpenEdit = (p) => { setEditingProduct(p); setModalOpen(true); };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        toast.success('Produk berhasil diperbarui.');
      } else {
        await productService.create(formData);
        toast.success('Produk berhasil ditambahkan.');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await productService.remove(deletingProduct.id);
      toast.success('Produk berhasil dihapus.');
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus produk.');
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustStock = async (payload) => {
    setSaving(true);
    try {
      await productService.adjustStock(adjustingProduct.id, payload);
      toast.success('Stok berhasil disesuaikan.');
      setAdjustingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyesuaikan stok.');
    } finally {
      setSaving(false);
    }
  };

  const filters = ['All', ...categories.map((c) => c.name)];

  return (
    <DashboardLayout onSearch={setSearch}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-text-primary text-2xl font-semibold">Food & Beverage</h2>
          <p className="text-text-secondary text-sm">Kelola menu, harga, dan stok produk.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${activeFilter === f ? 'bg-accent text-accent-lighter' : 'border border-border text-text-secondary hover:bg-surface-elevated'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCategoriesModalOpen(true)}
            className="flex items-center gap-1 border border-border text-text-secondary text-sm px-3 py-2 rounded-lg hover:bg-surface-elevated transition"
          >
            <Tag size={14} /> Kategori
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1 bg-accent hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            <Plus size={16} /> Tambah Produk
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Memuat data...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-text-secondary text-sm">Belum ada produk. Tambahkan produk pertama kamu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onDelete={setDeletingProduct}
              onAdjustStock={setAdjustingProduct}
            />
          ))}
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingProduct}
        loading={saving}
      />

      <AdjustStockModal
        open={!!adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
        onSubmit={handleAdjustStock}
        product={adjustingProduct}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deletingProduct}
        title="Hapus Produk?"
        message={`Yakin ingin menghapus ${deletingProduct?.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
        loading={saving}
      />

      <ManageCategoriesModal
        open={categoriesModalOpen}
        onClose={() => setCategoriesModalOpen(false)}
        categories={categories}
        onRefresh={fetchCategories}
      />
    </DashboardLayout>
  );
}