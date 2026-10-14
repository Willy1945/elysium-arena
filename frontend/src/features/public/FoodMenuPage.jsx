import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, Search, Plus, Minus, Trash2, ShoppingCart, MessageCircle,
  Wallet, Radio, Coffee, Gift, ArrowRight, Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/layout/PublicLayout';
import Skeleton from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { publicService } from '../../api/publicService';
import { sessionService } from '../../api/sessionService';
import { orderService } from '../../api/orderService';
import { rewardService } from '../../api/rewardService';
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

  const [availableFoodReward, setAvailableFoodReward] = useState(null);
  const [useReward, setUseReward] = useState(false);

  useEffect(() => {
    if (activeSessions.length === 1) {
      setSelectedSessionId(String(activeSessions[0].id));
    }
  }, [activeSessions]);

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

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      rewardService.getMyRewards().then(({ data }) => {
        const reward = data.rewards.find((r) => r.status === 'available' && r.type === 'free_food');
        setAvailableFoodReward(reward || null);
      });
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

  const totalCategoriesCount = categories.length > 0 ? categories.length : Object.keys(categoryCounts).length;

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
        reward_id: useReward && availableFoodReward ? availableFoodReward.id : null,
      });
      toast.success('Pesanan berhasil dibuat! Staf akan segera mengantarkan ke mejamu.');
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
      {/* ── HEADER BANNER ── */}
      <section className="relative overflow-hidden py-24 sm:py-28 border-b border-white/[0.06] bg-[#070709]">
        {/* Background Image Kitchen / Cafe dengan Cinematic Dark Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/kitchen.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/70 via-transparent to-[#070709] pointer-events-none" />

        {/* Atmosphere Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-15%,rgba(227,30,36,0.22),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Radio size={13} className="text-cust-red animate-pulse" />
            <span className="text-[11px] font-mono-tech text-white/90 uppercase tracking-widest font-semibold">
              Elysium Cafe & Runner · Antar Langsung ke Station
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase">
              Fast Table Delivery
            </span>
          </div>

          <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-[76px] uppercase tracking-tight mb-4 leading-none">
            FOOD & <span className="text-cust-red">BEVERAGE</span>
          </h1>

          <p className="text-cust-text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Refuel energimu tanpa jeda bermain. Pesan makanan, snack, dan minuman dingin langsung dari ponsel, pesanan akan diantar langsung ke mejamu.
          </p>
        </div>
      </section>

      {/* ── TELEMETRY STRIP ── */}
      <section className="border-b border-white/[0.06] bg-[#0c0c0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                <UtensilsCrossed size={20} className="sm:hidden" />
                <UtensilsCrossed size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Menu Tersedia</p>
                <p className="font-display font-black text-white text-xl sm:text-2xl truncate">{products.length} Menu</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-white/60 truncate">Makanan & Minuman</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Coffee size={20} className="sm:hidden" />
                <Coffee size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Kategori Cafe</p>
                <p className="font-display font-black text-amber-400 text-xl sm:text-2xl truncate">{totalCategoriesCount} Jenis</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-amber-400/80 truncate">Snack & Refreshment</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Layers size={20} className="sm:hidden" />
                <Layers size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Rentang Harga</p>
                <p className="font-display font-black text-emerald-400 text-xl sm:text-2xl truncate">
                  {priceRange ? `${Math.round(priceRange.min / 1000)}K - ${Math.round(priceRange.max / 1000)}K` : '-'}
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-emerald-500/80 truncate">Hemat & Bersahabat</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Wallet size={20} className="sm:hidden" />
                <Wallet size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Metode Bayar</p>
                <p className="font-display font-black text-white text-xl sm:text-2xl truncate">Kasir / QRIS</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-white/60 truncate">Gabung Billing Sesi</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT: MENU CATALOG & STICKY CART CONSOLE ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Kolom Kiri: Menu Catalog (Spans 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Filter Dock & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-[#0c0c0f] border border-white/[0.08] rounded-2xl">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1">
                {categoryFilters.map((f) => {
                  const active = activeCategory === f;
                  const count = f === 'All' ? products.length : categoryCounts[f];
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveCategory(f)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all whitespace-nowrap ${active
                        ? 'bg-cust-red text-white shadow-sm'
                        : 'text-cust-text-secondary hover:text-white hover:bg-white/[0.04]'
                        }`}
                    >
                      <span>{f === 'All' ? 'Semua Menu' : f}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-64 p-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Cari makanan / minuman..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#131317] border border-white/[0.08] rounded-xl text-white text-xs pl-10 pr-4 py-2.5 outline-none focus:border-cust-red transition placeholder:text-white/30 font-mono-tech"
                />
              </div>
            </div>

            {/* Menu Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="rounded-3xl bg-[#0c0c0f] border border-white/[0.06] p-4 space-y-3">
                    <Skeleton className="h-36 w-full rounded-2xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-[#0c0c0f] border border-dashed border-white/[0.1] rounded-3xl">
                <UtensilsCrossed size={48} className="mx-auto text-white/20 mb-4" />
                <h3 className="font-display font-black text-white text-2xl uppercase mb-2">Menu Tidak Ditemukan</h3>
                <p className="text-cust-text-secondary text-sm max-w-sm mx-auto mb-6">
                  Tidak ada makanan atau minuman yang cocok dengan pencarian "{search}".
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearch(''); }}
                  className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold uppercase rounded-xl transition font-mono-tech"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                {filteredProducts.map((product) => {
                  const outOfStock = product.stock <= 0 || !product.is_active;
                  const itemInCartQty = cart[product.id] || 0;

                  return (
                    <motion.div
                      key={product.id}
                      whileHover={outOfStock ? {} : { y: -4 }}
                      transition={{ duration: 0.2 }}
                      className={`relative bg-[#0c0c0f] border rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group ${outOfStock
                        ? 'border-white/[0.04] opacity-60'
                        : 'border-white/[0.08] hover:border-cust-red/40 hover:shadow-[0_8px_30px_rgba(227,30,36,0.15)]'
                        }`}
                    >
                      {/* Product Visual */}
                      <div className="relative h-32 sm:h-40 bg-[#121217] overflow-hidden">
                        {product.image ? (
                          <img
                            src={resolveImageUrl(product.image)}
                            alt={product.name}
                            className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out ${outOfStock ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#121217]">
                            <UtensilsCrossed size={32} className="text-white/20 sm:hidden" />
                            <UtensilsCrossed size={36} className="text-white/20 hidden sm:block" />
                            <span className="text-[10px] font-mono-tech text-white/40 uppercase">Elysium Cafe</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-black/40" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between">
                          <span className="text-[9px] sm:text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white/80">
                            {product.category?.name}
                          </span>
                          {outOfStock && (
                            <span className="text-[9px] sm:text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-cust-red text-white shadow-md">
                              Habis
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Content & Action */}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5 sm:gap-3">
                        <div>
                          <h4 className="font-display font-bold text-white text-sm sm:text-base leading-snug uppercase line-clamp-1 group-hover:text-cust-red transition-colors">
                            {product.name}
                          </h4>
                          <p className={`font-display font-black text-base sm:text-lg mt-0.5 ${outOfStock ? 'text-white/40 line-through' : 'text-white'}`}>
                            {formatRupiah(product.price)}
                          </p>
                        </div>

                        {/* Interactive Add or Qty Controller */}
                        {itemInCartQty > 0 ? (
                          <div className="flex items-center justify-between p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center transition"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="font-mono-tech text-xs font-bold text-white px-1 sm:px-2">
                              {itemInCartQty}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cust-red hover:bg-cust-red-dark text-white flex items-center justify-center transition shadow-[0_0_10px_rgba(227,30,36,0.4)]"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            disabled={outOfStock}
                            className={`w-full py-2 sm:py-2.5 rounded-xl font-mono-tech text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${outOfStock
                              ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                              : 'bg-white/[0.05] hover:bg-cust-red text-white hover:shadow-[0_0_20px_rgba(227,30,36,0.35)]'
                              }`}
                          >
                            <Plus size={13} className="shrink-0" />
                            <span className="sm:hidden">Tambah</span>
                            <span className="hidden sm:inline">Tambah Pesanan</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kolom Kanan: Sticky Cart Console (Spans 4 cols) */}
          <div id="cart-checkout-console" className="lg:col-span-4 sticky top-24">
            <div className="bg-[#0c0c0f]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between">

              {/* Cart Header */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cust-red/10 border border-cust-red/25 flex items-center justify-center text-cust-red">
                    <ShoppingCart size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-white text-xl uppercase tracking-wide leading-none">
                      Keranjang Pesanan
                    </h3>
                    <p className="text-white/40 text-[11px] font-mono-tech mt-1">Direct Room Runner</p>
                  </div>
                </div>

                <span className="font-mono-tech text-xs font-bold px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
                  {cartItems.length} Item
                </span>
              </div>

              {/* Station Delivery Selector (If customer is playing) */}
              {user?.role === 'CUSTOMER' && activeSessions.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-5">
                  <label className="block text-white/60 text-[11px] font-mono-tech uppercase tracking-wider mb-2">
                    🎯 Antar Langsung ke Station:
                  </label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full bg-[#131317] border border-white/[0.1] rounded-xl text-white text-xs px-3 py-2.5 outline-none focus:border-cust-red transition font-mono-tech font-bold"
                  >
                    <option value="">Take-away (Ambil di Kasir)</option>
                    {activeSessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.device?.code} ({s.device?.device_type?.name})
                      </option>
                    ))}
                  </select>
                  {!selectedSessionId && (
                    <p className="text-amber-400 text-[11px] leading-relaxed mt-2 font-mono-tech">
                      ⚠️ Pilih station kamu agar tagihan otomatis disatukan ke billing sesi bermain.
                    </p>
                  )}
                </div>
              )}

              {/* Cart Items List */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/[0.08] rounded-2xl mb-6">
                  <Coffee size={36} className="mx-auto text-white/20 mb-3" />
                  <p className="text-white/60 text-xs font-mono-tech">
                    Keranjang masih kosong.<br />Pilih menu di samping untuk memesan.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 mb-6 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-white text-xs font-bold uppercase truncate font-display">
                          {item.product.name}
                        </p>
                        <p className="text-white/50 text-[11px] font-mono-tech">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-white flex items-center justify-center transition"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-mono-tech text-xs font-bold text-white w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-white flex items-center justify-center transition"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => setCart((prev) => { const n = { ...prev }; delete n[item.product.id]; return n; })}
                          className="w-7 h-7 rounded-lg text-cust-red/70 hover:text-cust-red hover:bg-cust-red/10 flex items-center justify-center transition ml-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total & Loyalty Reward Voucher */}
              <div className="pt-5 border-t border-white/[0.08] flex flex-col gap-4">

                {/* Total Bill Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white/40 text-[10px] font-mono-tech uppercase tracking-widest block">
                      Total Pesanan
                    </span>
                    <span className="font-display font-black text-white text-2xl">
                      {formatRupiah(total)}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-tech text-white/50 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-md">
                    Bayar di Kasir
                  </span>
                </div>

                {/* Free Food Loyalty Reward Voucher Card */}
                {user?.role === 'CUSTOMER' && availableFoodReward && (
                  <label className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer hover:border-emerald-500/50 transition shadow-lg">
                    <input
                      type="checkbox"
                      checked={useReward}
                      onChange={(e) => setUseReward(e.target.checked)}
                      className="mt-1 accent-emerald-500 rounded"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase font-mono-tech">
                        <Gift size={14} />
                        <span>Klaim Reward Makanan Gratis</span>
                      </div>
                      <p className="text-white/70 text-[11px] leading-relaxed mt-1">
                        Kamu punya reward loyalitas. Item gratis akan otomatis disertakan ke pesanan ini tanpa biaya tambahan.
                      </p>
                    </div>
                  </label>
                )}

                {/* Submit Checkout Button */}
                <button
                  onClick={handleSubmit}
                  disabled={cartItems.length === 0 || submitting}
                  className={`w-full py-4 rounded-2xl font-mono-tech text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${cartItems.length === 0 || submitting
                    ? 'bg-white/[0.04] text-white/30 cursor-not-allowed border border-white/[0.06]'
                    : 'bg-cust-red hover:bg-cust-red-dark text-white shadow-[0_0_25px_rgba(227,30,36,0.35)] hover:shadow-[0_0_35px_rgba(227,30,36,0.55)]'
                    }`}
                >
                  <span>
                    {submitting ? 'Memproses Pesanan...' : !user ? 'Masuk untuk Memesan' : 'Konfirmasi & Kirim Pesanan'}
                  </span>
                  {!submitting && <ArrowRight size={14} />}
                </button>

                <p className="text-white/40 text-[10px] font-mono-tech leading-relaxed text-center">
                  Staf kafe akan langsung menyiapkan & mengantar pesanan ke mejamu.
                </p>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── BANNER PESANAN BESAR / GRUP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl bg-[#0c0c0f]">
          {/* Background Image Kitchen Cafe */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
            style={{ backgroundImage: "url('/images/kitchen.jpeg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0f] via-[#0c0c0f]/90 to-[#0c0c0f]/80 pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-cust-red/10 border border-cust-red/25 flex items-center justify-center text-cust-red shrink-0 shadow-[0_0_20px_rgba(227,30,36,0.2)]">
              <MessageCircle size={26} />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-2xl uppercase tracking-wide mb-1">
                Pemesanan Makanan untuk Rombongan Mabar?
              </h3>
              <p className="text-cust-text-secondary text-xs sm:text-sm leading-relaxed max-w-xl font-mono-tech">
                Punya sesi turnamen atau mabar ramai-ramai? Hubungi kasir/admin untuk pre-order snack & paket pitcher hemat.
              </p>
            </div>
          </div>

          <Link
            to="/feedback"
            className="shrink-0 relative z-10 px-7 py-3.5 bg-white/[0.04] hover:bg-cust-red border border-white/[0.1] hover:border-transparent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech cursor-pointer"
          >
            Hubungi Kasir Kafe
          </Link>
        </div>
      </section>

      {/* ── FLOATING MOBILE CART BAR (Visible only on < lg screens when cart has items) ── */}
      {cartItems.length > 0 && (
        <aside
          aria-label="Floating Mobile Cart"
          className="lg:hidden fixed bottom-4 left-3 right-3 z-40 bg-[#121216]/95 backdrop-blur-2xl border border-cust-red/40 rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cust-red flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(227,30,36,0.4)]">
              <ShoppingCart size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-mono-tech text-[10px] text-zinc-400 uppercase tracking-wider truncate">
                {cartItems.length} Menu Terpilih
              </p>
              <p className="font-display font-black text-white text-base truncate">
                {formatRupiah(total)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              document.getElementById('cart-checkout-console')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 cursor-pointer"
          >
            <span>Lihat Pesanan</span>
            <ArrowRight size={13} />
          </button>
        </aside>
      )}
    </PublicLayout>
  );
}