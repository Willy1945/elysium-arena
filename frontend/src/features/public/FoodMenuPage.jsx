import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
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

  const filters = ['All', ...categories.map((c) => c.name)];

  return (
    <PublicLayout>
      {/* ── HEADER ── */}
      <section
        className="relative overflow-hidden min-h-[380px] flex items-center"
        style={{ backgroundImage: "url('/images/gaming-hall.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-cust-bg/75" />
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri — Menu */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-cust-border">
              <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveCategory(f)}
                    className={`px-4 py-2.5 text-xs font-bold uppercase transition ${
                      activeCategory === f
                        ? 'bg-cust-red text-white shadow-lg shadow-cust-red/20'
                        : 'bg-cust-bg border border-cust-border text-cust-text-secondary hover:border-cust-red hover:text-cust-text-primary'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="relative sm:w-56">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cust-text-secondary" />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm pl-9 pr-3 py-2.5 outline-none focus:border-cust-red transition"
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
                  const outOfStock = product.stock <= 0;
                  return (
                    <div key={product.id} className="bg-cust-elevated border border-cust-border overflow-hidden">
                      <div className="h-28 bg-cust-bg">
                        {product.image ? (
                          <img src={resolveImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UtensilsCrossed size={26} className="text-cust-text-secondary opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-cust-text-primary text-sm font-bold line-clamp-1 mb-1">{product.name}</p>
                        <p className="text-cust-red font-black text-sm mb-2">{formatRupiah(product.price)}</p>
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

          {/* Kolom Kanan — Cart */}
          <div className="lg:col-span-1">
            <div className="bg-cust-elevated border border-cust-border p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingCart size={18} className="text-cust-red" />
                <h3 className="text-cust-text-primary font-black uppercase text-base">Pesanan Kamu</h3>
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
                  <span className="text-cust-red font-black text-xl">{formatRupiah(total)}</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={cartItems.length === 0 || submitting}
                  className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm py-3.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Memproses...' : !user ? 'Masuk untuk Pesan' : 'Buat Pesanan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}