import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, UtensilsCrossed } from 'lucide-react';
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
  const [cart, setCart] = useState({}); // { productId: quantity }
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
      toast.success('Order berhasil dibuat.');
      navigate('/admin/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat order.');
    } finally {
      setSubmitting(false);
    }
  };

  const filters = ['All', ...categories.map((c) => c.name)];

  return (
    <DashboardLayout>
      <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-4 transition">
        <ArrowLeft size={16} /> Kembali ke Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri — Katalog Produk */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveCategory(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${activeCategory === f ? 'bg-accent text-accent-lighter' : 'border border-border text-text-secondary hover:bg-surface-elevated'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="text-left bg-surface-elevated border border-border rounded-lg overflow-hidden hover:border-accent/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="h-24 bg-surface-inset">
                  {product.image ? (
                    <img src={resolveImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed size={24} className="text-text-secondary opacity-30" />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-text-primary text-xs font-medium line-clamp-1">{product.name}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{formatRupiah(product.price)}</p>
                  {product.stock <= 0 && <p className="text-status-occupied text-[10px] mt-1">Stok habis</p>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Kolom Kanan — Cart & Customer */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <label className="block text-text-secondary text-xs mb-2">Session Aktif (opsional)</label>
            <select
              value={selectedSessionId}
              onChange={(e) => handleSelectSession(e.target.value)}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent mb-3"
            >
              <option value="">Tanpa session (take-away)</option>
              {activeSessions.map((s) => (
                <option key={s.id} value={s.id}>{s.device?.code} — {s.user?.name}</option>
              ))}
            </select>

            <label className="block text-text-secondary text-xs mb-2">Customer</label>
            <input
              type="text"
              placeholder="Cari nama/email..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent mb-2"
            />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Pilih customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart size={16} className="text-text-secondary" />
              <h3 className="text-text-primary font-semibold text-sm">Cart</h3>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-text-secondary text-sm flex-1">Belum ada item, klik produk untuk menambahkan.</p>
            ) : (
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-72">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between bg-surface-inset rounded-lg p-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-xs font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-text-secondary text-[11px]">{formatRupiah(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded bg-surface-elevated border border-border text-text-secondary hover:text-text-primary">
                        <Minus size={11} />
                      </button>
                      <span className="text-text-primary text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded bg-surface-elevated border border-border text-text-secondary hover:text-text-primary">
                        <Plus size={11} />
                      </button>
                      <button onClick={() => setCart((prev) => { const n = { ...prev }; delete n[item.product.id]; return n; })} className="p-1 text-status-occupied">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-border mt-3 pt-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-primary font-semibold text-sm">Total</span>
                <span className="text-accent-light font-bold text-lg">{formatRupiah(total)}</span>
              </div>

              {error && <p className="text-status-occupied text-xs mb-2">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!selectedUserId || cartItems.length === 0 || submitting}
                className="w-full bg-accent hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Memproses...' : 'Buat Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}