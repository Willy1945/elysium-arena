import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Search, Plus, Minus, Trash2, ShoppingCart, MessageCircle, Wallet } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { publicService } from '../../api/publicService';
import { sessionService } from '../../api/sessionService';
import { orderService } from '../../api/orderService';
import { formatRupiah, resolveImageUrl } from '../../utils/format';

export default function FoodMenuPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [cart, setCart] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await publicService.getProducts();
      setProducts(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    publicService.getCategories().then(({ data }) => setCategories(data.data));
  }, [fetchProducts]);

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      sessionService.getAll({ status: 'active' }).then(({ data }) => setActiveSessions(data.data));
    }
  }, [user]);

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category?.name === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categoryCounts = {};
  products.forEach((p) => {
    const name = p.category?.name;
    if (name) categoryCounts[name] = (categoryCounts[name] || 0) + 1;
  });

  const priceRange = useMemo(() => {
    if (products.length === 0) return null;
    const prices = products.map((p) => Number(p.price));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const addToCart = (product) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[productId] || 0) + delta;
      if (newQty <= 0) delete next[productId];
      else next[productId] = newQty;
      return next;
    });
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === Number(productId));
      return { product, quantity, subtotal: product ? product.price * quantity : 0 };
    }).filter((item) => item.product);
  }, [cart, products]);

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      await orderService.create({
        session_id: selectedSessionId ? Number(selectedSessionId) : null,
        items: cartItems.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      });
      toast.success('Pesanan berhasil dibuat!');
      setCart({});
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryFilters = ['All', ...Object.keys(categoryCounts)];

  return (
    <PublicLayout>
      {/* ── HEADER (tetap seperti sebelumnya) ── */}
      <section
        className="relative overflow-hidden min-h-[380px] flex items-center"
        style={{ backgroundImage: "url('/images/kitchen.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-cust-bg/60" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center w-full">
          <div className="inline-flex items-center gap-2 bg-cust-elevated border border-cust-border px-4 py-2 mb-6 text-xs font-bold uppercase">
            <Link to="/" className="text-cust-text-secondary hover:text-cust-text-primary transition">Beranda</Link>
            <span className="text-cust-text-secondary">›</span>
            <span className="text-cust-red">Menu</span>
          </div>
          <h1 className="text-cust-text-primary font-black text-3xl sm:text-5xl uppercase leading-tight mb-2">
            Food & <span className="text-cust-red">Beverage</span>
          </h1>
          <div className="w-16 h-1 bg-cust-red mx-auto mb-6" />
          <p className="text-cust-text-secondary text-base max-w-xl mx-auto">
            Pesan makanan dan minuman langsung dari HP, tinggal tunggu diantar ke station kamu.
          </p>
        </div>
      </section>

      {/* ── TELEMETRY STRIP — data asli ── */}
      <section className="border-b border-cust-border bg-cust-elevated/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-cust-border">
          <div className="pr-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Menu Tersedia</p>
            <p className="font-display font-black text-cust-text-primary text-3xl">{products.length}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Item</p>
          </div>
          <div className="px-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Kategori</p>
            <p className="font-display font-black text-cust-text-primary text-3xl">{categories.length}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Jenis Menu</p>
          </div>
          <div className="px-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Rentang Harga</p>
            <p className="font-display font-black text-cust-text-primary text-2xl">
              {priceRange ? `${Math.round(priceRange.min / 1000)}K-${Math.round(priceRange.max / 1000)}K` : '-'}
            </p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Per Item</p>
          </div>
          <div className="pl-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Wallet size={11} /> Metode Bayar
            </p>
            <p className="font-display font-black text-cust-text-primary text-lg">Cash / QRIS</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Di Kasir</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri — Menu */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-cust-border">
              <div className="flex gap-2 flex-wrap">
                {categoryFilters.map((f) => {
                  const active = activeCategory === f;
                  const count = f === 'All' ? products.length : categoryCounts[f];
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveCategory(f)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase transition ${
                        active
                          ? 'bg-cust-red text-white shadow-lg shadow-cust-red/20'
                          : 'bg-cust-elevated border border-cust-border text-cust-text-secondary hover:border-cust-red hover:text-cust-text-primary'
                      }`}
                    >
                      {f === 'All' ? 'Semua Menu' : f}
                      <span className={`font-mono-tech text-[10px] ${active ? 'opacity-70' : 'opacity-50'}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
              <div className="relative sm:w-56">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cust-text-secondary" />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-cust-elevated border border-cust-border text-cust-text-primary text-sm pl-9 pr-3 py-2.5 outline-none focus:border-cust-red transition"
                />
              </div>
            </div>

            {loading ? (
              <p className="text-cust-text-secondary text-sm">Memuat menu...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-cust-border">
                <p className="text-cust-text-secondary text-sm">Tidak ada menu yang cocok.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const outOfStock = product.stock <= 0 || !product.is_active;
                  return (
                    <div key={product.id} className={`bg-cust-elevated border border-cust-border overflow-hidden ${outOfStock ? 'opacity-70' : 'hover:border-cust-red transition'}`}>
                      <div className={`relative h-28 bg-cust-bg ${outOfStock ? 'grayscale' : ''}`}>
                        {product.image ? (
                          <img src={resolveImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UtensilsCrossed size={26} className="text-cust-text-secondary opacity-30" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-cust-text-secondary text-[9px] font-bold uppercase px-1.5 py-0.5">
                          {product.category?.name}
                        </span>
                        {outOfStock && (
                          <span className="absolute top-2 right-2 bg-cust-red text-white text-[9px] font-bold uppercase px-1.5 py-0.5">
                            Stok Habis
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-cust-text-primary text-sm font-bold line-clamp-1 mb-1">{product.name}</p>
                        <p className={`font-display font-black text-sm mb-2 ${outOfStock ? 'text-cust-text-secondary line-through' : 'text-cust-red'}`}>
                          {formatRupiah(product.price)}
                        </p>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={outOfStock}
                          className="w-full bg-cust-red hover:bg-cust-red-dark disabled:bg-cust-border disabled:text-cust-text-secondary disabled:cursor-not-allowed text-white text-xs font-bold uppercase py-2 transition"
                        >
                          {outOfStock ? 'Stok Habis' : 'Tambah'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kolom Kanan — Cart Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-cust-elevated border border-cust-border p-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-cust-border">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-cust-red" />
                  <h3 className="text-cust-text-primary font-black uppercase text-base">Pesanan Kamu</h3>
                </div>
                <span className="bg-cust-bg border border-cust-border text-cust-text-secondary text-xs font-bold px-2.5 py-1">
                  {cartItems.length} Item
                </span>
              </div>

              {user?.role === 'CUSTOMER' && activeSessions.length > 0 && (
                <div className="mb-5">
                  <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-2">Antar ke Station</label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-3 py-2.5 outline-none focus:border-cust-red transition"
                  >
                    <option value="">Take-away (tanpa session)</option>
                    {activeSessions.map((s) => (
                      <option key={s.id} value={s.id}>{s.device?.code}</option>
                    ))}
                  </select>
                </div>
              )}

              {cartItems.length === 0 ? (
                <p className="text-cust-text-secondary text-sm mb-6">Belum ada item, pilih menu di samping.</p>
              ) : (
                <div className="flex flex-col gap-3 mb-6 max-h-72 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between bg-cust-bg border border-cust-border p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-cust-text-primary text-xs font-bold line-clamp-1">{item.product.name}</p>
                        <p className="text-cust-text-secondary text-[11px]">{formatRupiah(item.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 bg-cust-elevated border border-cust-border text-cust-text-secondary hover:text-cust-text-primary">
                          <Minus size={11} />
                        </button>
                        <span className="text-cust-text-primary text-xs w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 bg-cust-elevated border border-cust-border text-cust-text-secondary hover:text-cust-text-primary">
                          <Plus size={11} />
                        </button>
                        <button onClick={() => setCart((prev) => { const n = { ...prev }; delete n[item.product.id]; return n; })} className="p-1 text-cust-red">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-cust-border pt-5">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-cust-text-primary font-black uppercase">Total</span>
                  <span className="font-display font-black text-cust-red text-xl">{formatRupiah(total)}</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={cartItems.length === 0 || submitting}
                  className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm py-3.5 transition disabled:opacity-40 disabled:cursor-not-allowed mb-4"
                >
                  {submitting ? 'Memproses...' : !user ? 'Masuk untuk Pesan' : 'Buat Pesanan'}
                </button>

                <p className="text-cust-text-secondary text-[11px] leading-relaxed">
                  Pesanan diantar langsung ke station kamu tanpa mengganggu sesi gaming. Pembayaran dilakukan langsung ke kasir (Cash/QRIS/Transfer).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BANNER BANTUAN ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-cust-elevated border border-cust-border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cust-red/15 flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-cust-red" />
            </div>
            <div>
              <p className="text-cust-text-primary font-black uppercase text-base mb-1">Butuh Pesanan untuk Grup Besar?</p>
              <p className="text-cust-text-secondary text-sm">Hubungi operator kami via WhatsApp untuk pesanan rombongan atau kebutuhan khusus.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-cust-bg border border-cust-border hover:border-cust-red text-cust-text-primary font-bold text-sm px-6 py-3.5 transition whitespace-nowrap"
          >
            WhatsApp Admin: +62 812-3456-7890
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}