import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  RotateCcw, 
  Lock,
  Package,
  Clock,
  Sparkles
} from 'lucide-react';
import { ProductItem, CartItem, OrderRecord, UserAccount } from '../../types/qa';
import { DefectToggles } from '../../data/mockDatabase';

interface EcommerceAppProps {
  products: ProductItem[];
  cart: CartItem[];
  orders: OrderRecord[];
  currentUser: UserAccount | null;
  defectToggles: DefectToggles;
  onUpdateDefectToggles: (toggles: DefectToggles) => void;
  onAddToCart: (product: ProductItem) => void;
  onUpdateQuantity: (cartItemId: number, newQty: number) => void;
  onRemoveFromCart: (cartItemId: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderData: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt'>) => OrderRecord;
  onLogin: (email: string, pass: string) => boolean;
  onRegister: (name: string, email: string, pass: string) => boolean;
  onLogout: () => void;
  onResetDatabase: () => void;
  onSelectTestCase?: (testCaseId: string) => void;
}

export const EcommerceApp: React.FC<EcommerceAppProps> = ({
  products,
  cart,
  orders,
  currentUser,
  defectToggles,
  onUpdateDefectToggles,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onPlaceOrder,
  onLogin,
  onRegister,
  onLogout,
  onResetDatabase,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [activeView, setActiveView] = useState<'store' | 'orders'>('store');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);

  // Auth form states
  const [authEmail, setAuthEmail] = useState('sarah.qa@strivelogic.com');
  const [authPassword, setAuthPassword] = useState('Password123!');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Checkout form states
  const [shippingName, setShippingName] = useState(currentUser?.fullName || 'Sarah Jenkins');
  const [shippingStreet, setShippingStreet] = useState(currentUser?.address || '742 Evergreen Terrace');
  const [shippingCity, setShippingCity] = useState(currentUser?.city || 'Springfield');
  const [shippingState, setShippingState] = useState('OR');
  const [shippingZip, setShippingZip] = useState(currentUser?.zipCode || '97477');
  const [shippingPhone, setShippingPhone] = useState(currentUser?.phone || '555-0199');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (ending 4242)');
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [addedAnimationId, setAddedAnimationId] = useState<number | null>(null);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Calculate cart subtotal
  // NOTE: If bugCartTotalGlitch is active (DEF-001), subtotal is calculated from initial unit prices without multiplying by updated quantities!
  const calculateSubtotal = () => {
    if (defectToggles.bugCartTotalGlitch) {
      // Intentional bug simulation: Ignores item quantity when quantity > 1, keeps initial subtotal
      return cart.reduce((sum, item) => sum + item.product.price, 0);
    }
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const rawSubtotal = calculateSubtotal();
  const shippingFee = rawSubtotal >= 150 ? 0 : (cart.length > 0 ? 12.00 : 0);
  const taxAmount = rawSubtotal * 0.08;
  const grandTotal = rawSubtotal + shippingFee + taxAmount;
  const totalCartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleAddToCartWithFeedback = (product: ProductItem) => {
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (authMode === 'signin') {
      const ok = onLogin(authEmail.trim(), authPassword);
      if (!ok) {
        setAuthError('Invalid email or password');
      } else {
        setIsAuthModalOpen(false);
      }
    } else {
      if (!authName || !authEmail || !authPassword) {
        setAuthError('All fields are required');
        return;
      }
      if (authPassword.length < 8) {
        setAuthError('Password must be at least 8 characters');
        return;
      }
      const ok = onRegister(authName.trim(), authEmail.trim(), authPassword);
      if (!ok) {
        setAuthError('An account with this email already exists');
      } else {
        setIsAuthModalOpen(false);
      }
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!shippingName.trim()) errors.name = 'Full name is required';
    if (!shippingStreet.trim()) errors.street = 'Street address is required';
    if (!shippingCity.trim()) errors.city = 'City is required';

    // Zip validation check
    // If defect bugZipValidationBypass is TRUE (DEF-002), we skip the 5-digit US regex check!
    if (!defectToggles.bugZipValidationBypass) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(shippingZip.trim())) {
        errors.zip = 'Please enter a valid 5-digit US postal code (e.g. 97477)';
      }
    } else {
      // In bug mode, only check if non-empty, allowing invalid postal codes like 'ABCDE' or '12'
      if (!shippingZip.trim()) {
        errors.zip = 'ZIP code is required';
      }
    }

    if (Object.keys(errors).length > 0) {
      setCheckoutErrors(errors);
      return;
    }

    setCheckoutErrors({});

    // If duplicate submit bug is active (DEF-003) and user multi-clicks, we don't lock isSubmittingOrder
    if (!defectToggles.bugDuplicateOrderSubmit && isSubmittingOrder) {
      return;
    }

    setIsSubmittingOrder(true);

    const orderData = {
      userId: currentUser?.id || 101,
      subtotal: Number(rawSubtotal.toFixed(2)),
      tax: Number(taxAmount.toFixed(2)),
      shipping: shippingFee,
      total: Number(grandTotal.toFixed(2)),
      shippingAddress: {
        fullName: shippingName,
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zipCode: shippingZip,
        country: 'USA'
      },
      paymentMethod,
      status: 'Processing' as const,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: Number((item.product.price * item.quantity).toFixed(2))
      }))
    };

    const newOrder = onPlaceOrder(orderData);
    setLastPlacedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsSubmittingOrder(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16" data-testid="aut-container">
      {/* CONTROLLED DEFECT INJECTION DRAWER / QA BANNER */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                AUT Test Harness · Controlled Defect Injection
              </span>
              <p className="text-xs text-slate-400">
                Toggle deliberate bugs to reproduce in manual testing or automated Playwright suites.
              </p>
            </div>
          </div>

          {/* Interactive Bug Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700 text-xs cursor-pointer hover:border-slate-600 transition-colors">
              <input
                type="checkbox"
                checked={defectToggles.bugCartTotalGlitch}
                onChange={(e) => onUpdateDefectToggles({ ...defectToggles, bugCartTotalGlitch: e.target.checked })}
                className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-slate-200">Bug #1 (DEF-001): Cart total glitch</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700 text-xs cursor-pointer hover:border-slate-600 transition-colors">
              <input
                type="checkbox"
                checked={defectToggles.bugZipValidationBypass}
                onChange={(e) => onUpdateDefectToggles({ ...defectToggles, bugZipValidationBypass: e.target.checked })}
                className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-slate-200">Bug #2 (DEF-002): ZIP regex bypass</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700 text-xs cursor-pointer hover:border-slate-600 transition-colors">
              <input
                type="checkbox"
                checked={defectToggles.bugDuplicateOrderSubmit}
                onChange={(e) => onUpdateDefectToggles({ ...defectToggles, bugDuplicateOrderSubmit: e.target.checked })}
                className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-slate-200">Bug #3 (DEF-003): Duplicate submit</span>
            </label>

            <button
              onClick={onResetDatabase}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors cursor-pointer"
              title="Reset test data to initial fixture state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>

      {/* STORE HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView('store')}
              className="text-left cursor-pointer"
              data-testid="app-brand"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 block">
                NovaStore
              </span>
              <span className="text-[11px] text-slate-500 font-mono block">
                Application Under Test (AUT)
              </span>
            </button>

            <nav className="hidden sm:flex items-center gap-1 ml-4 border-l border-slate-200 pl-4">
              <button
                onClick={() => setActiveView('store')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeView === 'store' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
                data-testid="nav-store"
              >
                Catalog
              </button>
              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setActiveView('orders');
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeView === 'orders' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
                data-testid="nav-orders"
              >
                Orders ({orders.length})
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User status */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:block text-right">
                  <span className="text-xs font-medium text-slate-900 block" data-testid="user-display-name">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  data-testid="btn-sign-out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                data-testid="btn-signin-modal"
              >
                Sign In
              </button>
            )}

            {/* Shopping Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              data-testid="btn-open-cart"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono shadow-xs"
                  data-testid="cart-badge"
                >
                  {totalCartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN VIEW CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'store' ? (
          <div>
            {/* Search & Category Filter bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              {/* Category Segmented control */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg shrink-0">
                {['All', 'Audio', 'Peripherals', 'Wearables'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-white text-slate-900 shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    data-testid={`filter-cat-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title, sku, or specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  data-testid="input-search"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    data-testid="btn-clear-search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
                <Package className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-900">No products found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No catalog items match your search query &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-4 px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const isAdded = addedAnimationId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col group"
                      data-testid="product-card"
                    >
                      {/* Product Image */}
                      <div 
                        className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide">
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200">
                          {product.stock} in stock
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="font-mono text-[11px]">{product.sku}</span>
                            <span>{product.category}</span>
                          </div>
                          <h3 
                            className="text-sm font-semibold text-slate-900 line-clamp-1 hover:text-slate-700 cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                            title={product.name}
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                          <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                            ${product.price.toFixed(2)}
                          </span>

                          <button
                            onClick={() => handleAddToCartWithFeedback(product)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                              isAdded 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                            data-testid={`btn-add-to-cart-${product.id}`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ORDERS HISTORY VIEW */
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Order History &amp; Auditing</h2>
                <p className="text-xs text-slate-500">
                  Verified orders stored in SQLite database. Used for database and API reconciliation tests.
                </p>
              </div>
              <button
                onClick={() => setActiveView('store')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                &larr; Back to Catalog
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No orders placed yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold font-mono text-slate-900">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()} · Customer: {ord.shippingAddress.fullName} · {ord.paymentMethod}
                      </p>
                      <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span>• {it.productName} &times; {it.quantity}</span>
                            <span className="font-mono text-slate-400">(${it.lineTotal.toFixed(2)})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Total Paid</span>
                      <span className="text-base font-bold text-slate-900 font-mono">
                        ${ord.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-slate-200">
            <div className="relative aspect-4/3 bg-slate-100">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-1.5 bg-white/90 text-slate-700 hover:text-slate-900 rounded-full shadow-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-mono">{selectedProduct.sku}</span>
                <span>{selectedProduct.category}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{selectedProduct.name}</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedProduct.description}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Price</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleAddToCartWithFeedback(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs">
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Shopping Cart ({totalCartItemCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {defectToggles.bugCartTotalGlitch && (
                <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <span className="font-semibold block">⚠️ Controlled Bug Active (DEF-001):</span>
                  Subtotal is frozen to unit prices and will not recalculate when quantity increments.
                </div>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Your cart is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3"
                    data-testid="cart-row"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="text-xs font-semibold text-slate-900 truncate"
                        data-testid="cart-item-title"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        ${item.product.price.toFixed(2)} each
                      </p>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-slate-300 rounded bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            data-testid={`btn-qty-minus-${item.product.id}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span 
                            className="px-2 text-xs font-mono font-medium"
                            data-testid={`qty-val-${item.product.id}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            data-testid={`btn-qty-plus-${item.product.id}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Remove item"
                          data-testid={`btn-remove-${item.product.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-slate-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Calculation */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono" data-testid="cart-subtotal">
                    ${rawSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? 'FREE ($150+ order)' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="font-mono">${grandTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full mt-3 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  data-testid="btn-checkout-nav"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL / SCREEN */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Secure Order Checkout</h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="mt-4 space-y-4" data-testid="checkout-form">
              {defectToggles.bugZipValidationBypass && (
                <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <span className="font-semibold block">⚠️ Controlled Bug Active (DEF-002):</span>
                  ZIP code accepts invalid characters like &lsquo;ABCDE&rsquo; without throwing validation regex error.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 ${
                      checkoutErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-900'
                    }`}
                    data-testid="input-name"
                  />
                  {checkoutErrors.name && (
                    <span className="text-[11px] text-red-500 mt-0.5 block">{checkoutErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 ${
                    checkoutErrors.street ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-900'
                  }`}
                  data-testid="input-street"
                />
                {checkoutErrors.street && (
                  <span className="text-[11px] text-red-500 mt-0.5 block">{checkoutErrors.street}</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 ${
                      checkoutErrors.city ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-900'
                    }`}
                    data-testid="input-city"
                  />
                  {checkoutErrors.city && (
                    <span className="text-[11px] text-red-500 mt-0.5 block">{checkoutErrors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                  <select
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="OR">OR</option>
                    <option value="CA">CA</option>
                    <option value="WA">WA</option>
                    <option value="NY">NY</option>
                    <option value="TX">TX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="97477"
                    className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 ${
                      checkoutErrors.zip ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-900'
                    }`}
                    data-testid="input-zip"
                  />
                  {checkoutErrors.zip && (
                    <span className="text-[11px] text-red-500 mt-0.5 block" data-testid="err-zip">
                      {checkoutErrors.zip}
                    </span>
                  )}
                </div>
              </div>

              {/* Order total summary strip */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Order Total ({totalCartItemCount} items):</span>
                  <span className="font-bold text-slate-900 font-mono ml-2">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
                <span className="text-emerald-700 font-medium">Free returns within 30 days</span>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!defectToggles.bugDuplicateOrderSubmit && isSubmittingOrder}
                  className="px-6 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  data-testid="btn-place-order"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmittingOrder ? 'Placing Order...' : 'Place Order'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {lastPlacedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your order confirmation has been created and verified in SQLite.
            </p>

            <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-bold font-mono text-slate-900" data-testid="order-confirmation-number">
                  {lastPlacedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-mono text-slate-900 font-semibold">${lastPlacedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping To:</span>
                <span className="text-slate-800">{lastPlacedOrder.shippingAddress.fullName} ({lastPlacedOrder.shippingAddress.zipCode})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLastPlacedOrder(null);
                  setActiveView('orders');
                }}
                className="flex-1 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors cursor-pointer"
              >
                View in Order History
              </button>
              <button
                onClick={() => setLastPlacedOrder(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTHENTICATION MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-200" data-testid="modal-auth">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {authMode === 'signin' ? 'Sign In to NovaStore' : 'Create Customer Account'}
              </h3>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-4 space-y-3">
              {authError && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                  {authError}
                </div>
              )}

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  id="login-email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  id="login-pass"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer mt-2"
                data-testid="btn-submit-login"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'register' : 'signin')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  {authMode === 'signin' 
                    ? "Don't have an account? Register here" 
                    : "Already registered? Sign in instead"}
                </button>
              </div>

              {/* Quick Preset for QA */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Quick QA Seed:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthEmail('sarah.qa@strivelogic.com');
                    setAuthPassword('Password123!');
                  }}
                  className="text-emerald-600 hover:underline font-mono"
                >
                  Fill QA Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
