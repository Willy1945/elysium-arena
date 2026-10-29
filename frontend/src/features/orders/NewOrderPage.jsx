import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, UtensilsCrossed, Monitor, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { userService } from '../../api/userService';
import { sessionService } from '../../api/sessionService';
import { orderService } from '../../api/orderService';
import { formatRupiah, resolveImageUrl } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

export default function NewOrderPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [cart, setCart] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    productService.getAll().then(({ data }) => setProducts(data.data));
    categoryService.getAll().then(({ data }) => setCategories(data.data));
    sessionService.getActive().then(({ data }) => setActiveSessions(data.data));
  }, []);

  useEffect(() => {
    userService.search({ role: 'CUSTOMER', search: customerSearch }).then(({ data }) => setCustomers(data.data));
  }, [customerSearch]);

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    const session = activeSessions.find((s) => String(s.id) === String(sessionId));
    if (session) setSelectedUserId(String(session.user.id));
  };

  const addToCart = (product) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[productId] || 0) + delta;
      if (newQty <= 0) {
        delete next[productId];
      } else {
        next[productId] = newQty;
      }
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

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category?.name === activeCategory);

  const handleSubmit = async () => {
    if (!selectedUserId || cartItems.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      await orderService.create({
        user_id: Number(selectedUserId),
        session_id: selectedSessionId ? Number(selectedSessionId) : null,
        items: cartItems.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      });
      toast.success('Pesanan kafe berhasil dibuat.');
      navigate('/admin/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  const filters = ['All', ...categories.map((c) => c.name)];

  return (
    <DashboardLayout>

      <div className="mb-6">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider mb-3 transition"
        >
          <ArrowLeft size={14} /> Kembali ke Kitchen Pipeline
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
              <ShoppingCart size={14} />
              <span>Kasir & Point of Sale</span>
            </div>
            <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
              Order Baru Kafe
            </h1>
            <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
              Pilih menu, tentukan pemesan (stasiun atau take-away), dan masukkan ke dapur.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 flex flex-col gap-4">

          <div className="overflow-x-auto pb-1 scrollbar-none">
            <div className="bg-white border border-zinc-950 rounded-xl p-1 inline-flex gap-1 shadow-[2px_2px_0px_0px_#18181b]">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveCategory(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider whitespace-nowrap transition ${
                    activeCategory === f
                      ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  {f === 'All' ? 'Semua Kategori' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="text-left bg-white border border-zinc-950 rounded-2xl overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#18181b] shadow-[2px_2px_0px_0px_#18181b] transition-all flex flex-col disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
              >
                <div className="relative h-28 bg-zinc-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                      <UtensilsCrossed size={28} className="text-zinc-400" />
                    </div>
                  )}
                  {product.category && (
                    <div className="absolute top-2 left-2 bg-white text-zinc-950 border border-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#18181b]">
                      {product.category.name}
                    </div>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between gap-1 bg-white">
                  <div>
                    <p className="text-zinc-950 text-xs font-bold line-clamp-1 group-hover:text-cust-red transition">
                      {product.name}
                    </p>
                    <p className="text-zinc-950 font-black text-xs font-mono-tech mt-0.5">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-600 font-mono-tech font-bold">Sisa: {product.stock}</span>
                    {product.stock <= 0 ? (
                      <span className="text-rose-600 font-bold font-mono-tech">Habis</span>
                    ) : (
                      <span className="text-emerald-700 font-black font-mono-tech">+ Tambah</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">

          <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b]">
            <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display mb-4 flex items-center gap-2">
              <User size={15} className="text-cust-red" />
              <span>Tujuan Pemesan</span>
            </h3>

            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Monitor size={13} className="text-zinc-600" /> Sesi Stasiun Aktif (Opsional)
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => handleSelectSession(e.target.value)}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition mb-4 font-bold"
            >
              <option value="" className="text-zinc-400">Tanpa sesi (Pesanan Luar / Take-away)</option>
              {activeSessions.map((s) => (
                <option key={s.id} value={s.id} className="text-zinc-950">
                  {s.device?.code} — {s.user?.name}
                </option>
              ))}
            </select>

            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Customer Pemesan</label>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition mb-2"
            />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition font-bold"
            >
              <option value="" className="text-zinc-400">Pilih akun customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="text-zinc-950">
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div id="cart-section" className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b] flex flex-col scroll-mt-24">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-cust-red" />
                <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display">
                  Keranjang Pesanan
                </h3>
              </div>
              <span className="font-mono-tech text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-950 text-zinc-950 shadow-[1px_1px_0px_0px_#18181b]">
                {cartItems.length} Item
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs font-medium">
                Keranjang masih kosong. Klik menu di katalog untuk menambahkan.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between bg-zinc-50 border border-zinc-950 rounded-xl p-3 shadow-[1px_1px_0px_0px_#18181b]"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-zinc-950 text-xs font-bold line-clamp-1">{item.product.name}</p>
                      <p className="text-zinc-600 text-[11px] font-mono-tech font-bold">{formatRupiah(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 rounded-lg border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 transition"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-zinc-950 font-mono-tech text-xs font-black w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 rounded-lg border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 transition"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => setCart((prev) => { const n = { ...prev }; delete n[item.product.id]; return n; })}
                        className="p-1 ml-1 text-rose-600 hover:text-rose-700 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-zinc-200 pt-4 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-600 text-xs uppercase tracking-wider font-mono-tech font-bold">
                  Total Bayar
                </span>
                <span className="text-zinc-950 font-black text-xl font-mono-tech">
                  {formatRupiah(total)}
                </span>
              </div>

              {error && (
                <div className="p-3 mb-3 bg-rose-50 border border-zinc-950 rounded-xl text-rose-800 text-xs font-bold shadow-[2px_2px_0px_0px_#18181b]">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!selectedUserId || cartItems.length === 0 || submitting}
                className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase tracking-wider py-3 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
              >
                {submitting ? 'Memproses Order...' : 'Kirim Pesanan ke Dapur'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-zinc-950 rounded-2xl p-3.5 shadow-[4px_4px_0px_0px_#18181b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-zinc-950 flex items-center justify-center text-cust-red shrink-0 shadow-[1px_1px_0px_0px_#18181b]">
              <ShoppingCart size={16} />
            </div>
            <div>
              <span className="text-[11px] text-zinc-600 font-bold block">
                {cartItems.reduce((acc, it) => acc + it.quantity, 0)} Item dipilih
              </span>
              <span className="text-zinc-950 font-mono-tech font-black text-sm">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition cursor-pointer"
          >
            Review Order &gt;
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
