import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UtensilsCrossed, Coffee, Plus, Minus, ShoppingCart, Trash2,
  ArrowRight, Search, Gift, MessageCircle, Wallet, Layers, Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/layout/PublicLayout';
import Skeleton from '../../components/common/Skeleton';
import { publicService } from '../../api/publicService';
import { orderService } from '../../api/orderService';
import { sessionService } from '../../api/sessionService';
import { rewardService } from '../../api/rewardService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resolveImageUrl, formatRupiah } from '../../utils/format';

export default function FoodMenuPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [availableFoodReward, setAvailableFoodReward] = useState(null);
  const [useReward, setUseReward] = useState(false);

  useEffect(() => {
    setLoading(true);
    publicService.getProducts()
      .then(({ data }) => setProducts(data.data || []))
      .catch((err) => console.error('Gagal mengambil menu kafe:', err))
      .finally(() => setLoading(false));

    if (user?.role === 'CUSTOMER') {
      sessionService.getAll({ status: 'active' })
        .then(({ data }) => {
          const sessions = data.data || [];
          setActiveSessions(sessions);
          if (sessions.length > 0) {
            setSelectedSessionId(String(sessions[0].id));
          }
        })
        .catch((err) => console.error('Gagal mengambil sesi aktif:', err));

      rewardService.getMyRewards()
        .then(({ data }) => {
          const rewards = data.rewards || [];
          const foodRwd = rewards.find((r) => r.type === 'free_food' && r.status === 'available');
          setAvailableFoodReward(foodRwd || null);
        })
        .catch((err) => console.error('Gagal mengambil reward:', err));
    }
  }, [user]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category?.name === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category?.name || 'Lainnya';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const totalCategoriesCount = Object.keys(categoryCounts).length;

  const priceRange = useMemo(() => {
    if (products.length === 0) return null;
    const prices = products.map((p) => Number(p.price));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
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

  const rewardCalculation = useMemo(() => {
    if (!useReward || !availableFoodReward || cartItems.length === 0) {
      return { eligibleItem: null, discount: 0, reason: null };
    }

    const title = (availableFoodReward.title || '').toLowerCase();
    const isDrinkReward = title.includes('minum') || title.includes('kopi');
    const isNoodleReward = title.includes('mie');

    let eligible = null;
    if (isDrinkReward) {
      eligible = cartItems.find((item) => {
        const cat = (item.product.category?.name || '').toLowerCase();
        const name = item.product.name.toLowerCase();
        return (
          cat === 'minuman' ||
          cat === 'kopi' ||
          name.includes('kopi') ||
          name.includes('teh') ||
          name.includes('minerale') ||
          name.includes('jus')
        );
      });
      if (!eligible) {
        return {
          eligibleItem: null,
          discount: 0,
          reason: 'Voucher ini berlaku untuk menu Minuman / Kopi. Tambahkan minuman ke keranjang.',
        };
      }
    } else if (isNoodleReward) {
      eligible = cartItems.find((item) => {
        const name = item.product.name.toLowerCase();
        return name.includes('mie');
      });
      if (!eligible) {
        return {
          eligibleItem: null,
          discount: 0,
          reason: 'Voucher ini berlaku untuk menu Mie. Tambahkan menu mie ke keranjang.',
        };
      }
    } else {
      eligible = cartItems[0];
    }

    const discountAmount = eligible ? eligible.product.price : 0;
    return {
      eligibleItem: eligible,
      discount: discountAmount,
      reason: null,
    };
  }, [useReward, availableFoodReward, cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItems]);

  const discount = rewardCalculation.discount;
  const finalTotal = Math.max(0, subtotal - discount);

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) return;

    if (useReward && availableFoodReward && rewardCalculation.reason) {
      toast.error(rewardCalculation.reason);
      return;
    }

    setSubmitting(true);
    try {
      await orderService.create({
        session_id: selectedSessionId ? Number(selectedSessionId) : null,
        items: cartItems.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
        reward_id: useReward && availableFoodReward && rewardCalculation.eligibleItem ? availableFoodReward.id : null,
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

      <section className="relative bg-black text-white overflow-hidden border-b border-zinc-800 -mt-[72px] sm:-mt-[80px] pt-36 sm:pt-44 pb-20 sm:pb-24">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-100 pointer-events-none"
          style={{ backgroundImage: "url('/images/kitchen.jpeg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50 pointer-events-none" />
        <div className="pointer-events-none absolute -top-40 right-10 w-[500px] h-[500px] bg-cust-red/15 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-10 w-[400px] h-[400px] bg-cust-red/10 rounded-full blur-[140px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-6 shadow-md text-white">
            <Radio size={13} className="text-cust-red animate-pulse" />
            <span className="text-[11px] font-mono-tech uppercase tracking-widest font-bold text-white/90">
              Elysium Cafe & Runner · Antar Langsung ke Station
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono-tech text-emerald-300 font-extrabold uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
              Fast Table Delivery
            </span>
          </div>

          <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-[76px] uppercase tracking-tight mb-4 leading-none drop-shadow-md">
            FOOD & <span className="text-cust-red">BEVERAGE</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Refuel energimu tanpa jeda bermain. Pesan makanan, snack, dan minuman dingin langsung dari ponsel, pesanan akan diantar langsung ke mejamu.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                <UtensilsCrossed size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Menu Tersedia</p>
                <p className="font-display font-black text-zinc-950 text-xl sm:text-2xl truncate">{products.length} Menu</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-600 font-semibold truncate">Makanan & Minuman</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-amber-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Coffee size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Kategori Cafe</p>
                <p className="font-display font-black text-amber-600 text-xl sm:text-2xl truncate">{totalCategoriesCount} Jenis</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-amber-700 font-semibold truncate">Snack & Refreshment</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Layers size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Rentang Harga</p>
                <p className="font-display font-black text-emerald-800 text-xl sm:text-2xl truncate">
                  {priceRange ? `${Math.round(priceRange.min / 1000)}K - ${Math.round(priceRange.max / 1000)}K` : '-'}
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-emerald-700 font-bold truncate">Hemat & Bersahabat</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-blue-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Wallet size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Metode Bayar</p>
                <p className="font-display font-black text-zinc-950 text-xl sm:text-2xl truncate">Kasir / QRIS</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-600 font-semibold truncate">Gabung Billing Sesi</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-8 flex flex-col gap-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2.5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1">
                {categoryFilters.map((f) => {
                  const active = activeCategory === f;
                  const count = f === 'All' ? products.length : categoryCounts[f];
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveCategory(f)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                        active
                          ? 'bg-cust-red text-white shadow-md'
                          : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                      }`}
                    >
                      <span>{f === 'All' ? 'Semua Menu' : f}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${active ? 'bg-black/20 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-64 p-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Cari makanan / minuman..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs pl-10 pr-4 py-2.5 outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-mono-tech font-medium shadow-2xs"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="rounded-3xl bg-white border border-zinc-200 p-4 space-y-3 shadow-xs">
                    <Skeleton className="h-36 w-full rounded-2xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white border border-dashed border-zinc-300 rounded-3xl shadow-sm">
                <UtensilsCrossed size={48} className="mx-auto text-zinc-300 mb-4" />
                <h3 className="font-display font-black text-zinc-950 text-2xl uppercase mb-2">Menu Tidak Ditemukan</h3>
                <p className="text-zinc-600 text-sm max-w-sm mx-auto mb-6 font-medium">
                  Tidak ada makanan atau minuman yang cocok dengan pencarian "{search}".
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearch(''); }}
                  className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase rounded-xl transition font-mono-tech shadow-2xs"
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
                    <div
                      key={product.id}
                      className={`relative bg-white border rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_6px_20px_-3px_rgba(0,0,0,0.06)] group ${
                        outOfStock
                          ? 'border-zinc-200 opacity-60'
                          : 'border-zinc-200/90 hover:border-cust-red/50 hover:shadow-[0_16px_30px_-5px_rgba(0,0,0,0.1),0_8px_16px_rgba(227,30,36,0.08)] hover:-translate-y-1'
                      }`}
                    >

                      <div className="relative h-32 sm:h-40 bg-zinc-100 overflow-hidden border-b border-zinc-100">
                        {product.image ? (
                          <img
                            src={resolveImageUrl(product.image)}
                            alt={product.name}
                            className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out ${outOfStock ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-100">
                            <UtensilsCrossed size={32} className="text-zinc-300" />
                            <span className="text-[10px] font-mono-tech text-zinc-400 uppercase font-bold">Elysium Cafe</span>
                          </div>
                        )}

                        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between">
                          <span className="text-[9px] sm:text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/95 backdrop-blur-md border border-zinc-200 text-zinc-800 shadow-xs">
                            {product.category?.name}
                          </span>
                          {outOfStock && (
                            <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-cust-red text-white shadow-xs">
                              Habis
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2.5 sm:gap-3 bg-white">
                        <div>
                          <h4 className="font-display font-black text-zinc-950 text-sm sm:text-base leading-snug uppercase line-clamp-1 group-hover:text-cust-red transition-colors">
                            {product.name}
                          </h4>
                          <p className={`font-display font-black text-base sm:text-lg mt-0.5 ${outOfStock ? 'text-zinc-400 line-through' : 'text-zinc-950'}`}>
                            {formatRupiah(product.price)}
                          </p>
                        </div>

                        {itemInCartQty > 0 ? (
                          <div className="flex items-center justify-between p-1 rounded-xl bg-zinc-100 border border-zinc-200">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-zinc-200 text-zinc-900 flex items-center justify-center transition shadow-2xs"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="font-mono-tech text-xs font-black text-zinc-950 px-1 sm:px-2">
                              {itemInCartQty}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cust-red hover:bg-cust-red-dark text-white flex items-center justify-center transition shadow-xs"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            disabled={outOfStock}
                            className={`w-full py-2 sm:py-2.5 rounded-xl font-mono-tech text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                              outOfStock
                                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                                : 'bg-zinc-100 hover:bg-cust-red text-zinc-900 hover:text-white border border-zinc-200 hover:border-transparent shadow-2xs hover:shadow-md'
                            }`}
                          >
                            <Plus size={13} className="shrink-0" />
                            <span className="sm:hidden">Tambah</span>
                            <span className="hidden sm:inline">Tambah Pesanan</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div id="cart-checkout-console" className="lg:col-span-4 sticky top-24">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08)] flex flex-col justify-between">

              <div className="flex items-center justify-between pb-5 mb-5 border-b border-zinc-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shadow-2xs">
                    <ShoppingCart size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide leading-none">
                      Keranjang Pesanan
                    </h3>
                    <p className="text-zinc-500 text-[11px] font-mono-tech mt-1 font-semibold">Direct Room Runner</p>
                  </div>
                </div>

                <span className="font-mono-tech text-xs font-extrabold px-3 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
                  {cartItems.length} Item
                </span>
              </div>

              {user?.role === 'CUSTOMER' && activeSessions.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 mb-5">
                  <label className="block text-zinc-700 text-[11px] font-mono-tech uppercase tracking-wider mb-2 font-bold">
                    🎯 Antar Langsung ke Station:
                  </label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-950 text-xs px-3 py-2.5 outline-none focus:border-cust-red transition font-mono-tech font-bold shadow-2xs"
                  >
                    <option value="">Take-away (Ambil di Kasir)</option>
                    {activeSessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.device?.code} ({s.device?.device_type?.name})
                      </option>
                    ))}
                  </select>
                  {!selectedSessionId && (
                    <p className="text-amber-700 text-[11px] leading-relaxed mt-2 font-mono-tech font-semibold">
                      ⚠️ Pilih station kamu agar tagihan otomatis disatukan ke billing sesi bermain.
                    </p>
                  )}
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-300 rounded-2xl mb-6 bg-zinc-50/50">
                  <Coffee size={36} className="mx-auto text-zinc-300 mb-3" />
                  <p className="text-zinc-600 text-xs font-mono-tech font-medium">
                    Keranjang masih kosong.<br />Pilih menu di samping untuk memesan.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 mb-6 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-zinc-950 text-xs font-black uppercase truncate font-display">
                          {item.product.name}
                        </p>
                        <p className="text-zinc-600 text-[11px] font-mono-tech font-semibold">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center transition shadow-2xs"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-mono-tech text-xs font-black text-zinc-950 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-cust-red hover:bg-cust-red-dark text-white flex items-center justify-center transition shadow-2xs"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => setCart((prev) => { const n = { ...prev }; delete n[item.product.id]; return n; })}
                          className="w-7 h-7 rounded-lg text-cust-red hover:bg-red-50 flex items-center justify-center transition ml-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-5 border-t border-zinc-200 flex flex-col gap-4">

                {user?.role === 'CUSTOMER' && availableFoodReward && (
                  <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300 shadow-2xs">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useReward}
                        onChange={(e) => setUseReward(e.target.checked)}
                        className="mt-1 accent-emerald-600 rounded w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs uppercase font-mono-tech">
                            <Gift size={14} className="text-emerald-600" />
                            <span>Klaim Reward: {availableFoodReward.title || 'Voucher Kafe'}</span>
                          </div>
                          <span className="text-[10px] font-mono-tech font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            Tersedia
                          </span>
                        </div>
                        <p className="text-zinc-600 text-[11px] leading-relaxed mt-1 font-medium">
                          Gunakan voucher loyalitas untuk menggratiskan 1 item menu yang memenuhi syarat.
                        </p>
                      </div>
                    </label>

                    {useReward && (
                      <div className="pt-2 border-t border-emerald-200/60">
                        {rewardCalculation.eligibleItem ? (
                          <div className="flex items-center justify-between text-xs bg-emerald-100/90 text-emerald-950 px-2.5 py-1.5 rounded-lg font-mono-tech border border-emerald-300">
                            <span className="font-bold flex items-center gap-1">
                              ✓ 1x {rewardCalculation.eligibleItem.product.name}
                            </span>
                            <span className="font-black text-emerald-800">
                              GRATIS (-{formatRupiah(rewardCalculation.discount)})
                            </span>
                          </div>
                        ) : rewardCalculation.reason ? (
                          <div className="text-[11px] bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-lg font-medium">
                            ⚠️ {rewardCalculation.reason}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-1.5">
                  {discount > 0 && (
                    <>
                      <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-500">
                        <span>Subtotal Menu</span>
                        <span className="font-bold">{formatRupiah(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono-tech text-emerald-700 font-bold">
                        <span>Diskon Voucher ({availableFoodReward?.title || 'Reward'})</span>
                        <span>-{formatRupiah(discount)}</span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-zinc-500 text-[10px] font-mono-tech uppercase tracking-widest block font-bold">
                        Total Tagihan
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-black text-zinc-950 text-2xl">
                          {formatRupiah(finalTotal)}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs line-through text-zinc-400 font-mono-tech font-semibold">
                            {formatRupiah(subtotal)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono-tech px-2.5 py-1 rounded-md font-bold border ${
                      finalTotal === 0
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'text-zinc-700 bg-zinc-100 border-zinc-200'
                    }`}>
                      {finalTotal === 0 ? 'Lunas (Gratis Voucher)' : 'Bayar di Kasir'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={cartItems.length === 0 || submitting}
                  className={`w-full py-4 rounded-2xl font-mono-tech text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    cartItems.length === 0 || submitting
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                      : 'bg-cust-red hover:bg-cust-red-dark text-white shadow-[0_4px_16px_rgba(227,30,36,0.35)] hover:shadow-[0_8px_25px_rgba(227,30,36,0.5)] hover:-translate-y-0.5'
                  }`}
                >
                  <span>
                    {submitting ? 'Memproses Pesanan...' : !user ? 'Masuk untuk Memesan' : 'Konfirmasi & Kirim Pesanan'}
                  </span>
                  {!submitting && <ArrowRight size={14} />}
                </button>

                <p className="text-zinc-500 text-[10px] font-mono-tech leading-relaxed text-center font-medium">
                  Staf kafe akan langsung menyiapkan & mengantar pesanan ke mejamu.
                </p>

              </div>

            </div>
          </div>

        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.06)] bg-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/[0.04] rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-xs">
              <MessageCircle size={26} />
            </div>
            <div>
              <h3 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-wide mb-1">
                Pemesanan Makanan untuk Rombongan Mabar?
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
                Punya sesi turnamen atau mabar ramai-ramai? Hubungi kasir/admin untuk pre-order snack & paket pitcher hemat.
              </p>
            </div>
          </div>

          <Link
            to="/feedback"
            className="shrink-0 relative z-10 px-7 py-3.5 bg-zinc-100 hover:bg-cust-red hover:text-white border border-zinc-200 hover:border-transparent text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech shadow-xs hover:shadow-md"
          >
            Hubungi Kasir Kafe
          </Link>
        </div>
      </section>

      {cartItems.length > 0 && (
        <aside
          aria-label="Floating Mobile Cart"
          className="lg:hidden fixed bottom-4 left-3 right-3 z-40 bg-white/95 backdrop-blur-2xl border border-zinc-300 rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.15)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cust-red flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShoppingCart size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-mono-tech text-[10px] text-zinc-600 uppercase tracking-wider truncate font-bold">
                {cartItems.length} Menu Terpilih
              </p>
              <p className="font-display font-black text-zinc-950 text-base truncate">
                {formatRupiah(finalTotal)}
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
