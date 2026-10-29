import { useState, useEffect, useCallback } from 'react';
import { Plus, Tag, X, UtensilsCrossed, PackageOpen, Layers } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProductCard from './ProductCard';
import ProductFormModal from './ProductFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-[4px_4px_0px_0px_#18181b]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-bold">
              Kategori Menu
            </span>
            <h3 className="text-zinc-950 font-black text-xl font-display uppercase tracking-tight">
              Kelola Kategori
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-5">
          <input
            placeholder="Nama kategori baru..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-cust-red hover:bg-cust-red-dark text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-4 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50"
          >
            Tambah
          </button>
        </form>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
          {categories.length === 0 ? (
            <p className="text-zinc-500 text-xs text-center py-4 font-medium">Belum ada kategori.</p>
          ) : (
            categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-zinc-50 border border-zinc-950 rounded-xl px-3.5 py-2.5 shadow-[2px_2px_0px_0px_#18181b]"
              >
                <span className="text-zinc-950 text-xs sm:text-sm font-bold">{c.name}</span>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-rose-600 hover:text-rose-700 text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
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

  const filters = ['All', ...categories.map((c) => c.name)];

  return (
    <DashboardLayout onSearch={setSearch}>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <UtensilsCrossed size={14} />
            <span>Katalog Kafe & Inventaris</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
            Menu & Inventaris Makanan
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Kelola katalog menu makanan/minuman, penyesuaian harga, serta monitoring stok berkala.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {user.role !== 'STAFF_CAFE' && (
            <button
              onClick={() => setCategoriesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition"
            >
              <Tag size={15} /> Kelola Kategori
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition"
          >
            <Plus size={16} /> Tambah Menu
          </button>
        </div>
      </div>

      <div className="mb-6 flex overflow-x-auto pb-2 scrollbar-none">
        <div className="bg-white border border-zinc-950 rounded-xl p-1 flex gap-1 shadow-[2px_2px_0px_0px_#18181b]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider whitespace-nowrap transition ${
                activeFilter === f
                  ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                  : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              {f === 'All' ? 'Semua Menu' : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Memuat katalog menu...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-300 rounded-2xl bg-white shadow-[2px_2px_0px_0px_#18181b]">
          <PackageOpen size={40} className="mx-auto text-zinc-400 mb-3" />
          <p className="text-zinc-950 font-bold text-sm">Belum ada produk dalam kategori ini.</p>
          <p className="text-zinc-500 text-xs mt-1">Tambahkan menu pertama kamu untuk mulai berjualan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onDelete={setDeletingProduct}
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

      <ConfirmDialog
        open={!!deletingProduct}
        title="Hapus Produk?"
        message={`Yakin ingin menghapus ${deletingProduct?.name}? Data pesanan masa lalu akan tetap tercatat.`}
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
