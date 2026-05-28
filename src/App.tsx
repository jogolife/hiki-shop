/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, SlidersHorizontal, ArrowRight, Star, TrendingUp, 
  Clock, Share2, Check, ArrowUpRight, ShieldAlert, Award
} from 'lucide-react';

import Header from './components/Header';
import PromoBanner from './components/PromoBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import SEOSection from './components/SEOSection';
import AdvancedFilters, { FilterState } from './components/AdvancedFilters';
import OwnerLoginModal from './components/OwnerLoginModal';
import UserProfileModal from './components/UserProfileModal';
import CheckoutPortalModal from './components/CheckoutPortalModal';

import { defaultProducts, defaultBanners } from './data/defaultProducts';
import { Product, PromoBanner as BannerType, CartItem, AffiliateClick, Review } from './types';

export default function App() {
  // --- APP STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);

  // Wishlist & Client Profile States
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  // Official Store Redirection Settings
  const [officialStoreLink, setOfficialStoreLink] = useState('https://shopee.com.br/hiki-ofertas');
  const [redirectionType, setRedirectionType] = useState<'product' | 'global'>('global');

  // Owner Auth & Security States
  const [isOwner, setIsOwner] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // UI Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Advanced Filter Settings state
  const [filterState, setFilterState] = useState<FilterState>({
    brands: [],
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    attributes: {},
  });
  
  // Modals & Panels Toggles
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Affiliate Redirect Overlay state
  const [redirectingProduct, setRedirectingProduct] = useState<Product | null>(null);
  const [redirectTimer, setRedirectTimer] = useState(3);

  // --- INITIALIZE FROM LOCAL STORAGE OR DEFAULTS ---
  useEffect(() => {
    // Products
    const storedProducts = localStorage.getItem('vitrine_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('vitrine_products', JSON.stringify(defaultProducts));
    }

    // Banners
    const storedBanners = localStorage.getItem('vitrine_banners');
    if (storedBanners) {
      setBanners(JSON.parse(storedBanners));
    } else {
      setBanners(defaultBanners);
      localStorage.setItem('vitrine_banners', JSON.stringify(defaultBanners));
    }

    // Cart
    const storedCart = localStorage.getItem('vitrine_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Saved
    const storedSaved = localStorage.getItem('vitrine_saved');
    if (storedSaved) {
      setSavedProducts(JSON.parse(storedSaved));
    }

    // Wishlist
    const storedWishlist = localStorage.getItem('vitrine_wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }

    // Clicks
    const storedClicks = localStorage.getItem('vitrine_clicks');
    if (storedClicks) {
      setClicks(JSON.parse(storedClicks));
    }

    // Owner Auth
    const isOwnerAuth = localStorage.getItem('vitrine_owner_auth') === 'true';
    setIsOwner(isOwnerAuth);

    // Official Store Redirection Settings
    const storedStoreLink = localStorage.getItem('vitrine_official_store_link');
    if (storedStoreLink) {
      setOfficialStoreLink(storedStoreLink);
    } else {
      localStorage.setItem('vitrine_official_store_link', 'https://shopee.com.br/hiki-ofertas');
    }

    const storedRedirType = localStorage.getItem('vitrine_redirection_type');
    if (storedRedirType) {
      setRedirectionType(storedRedirType as 'product' | 'global');
    } else {
      localStorage.setItem('vitrine_redirection_type', 'global');
      setRedirectionType('global');
    }
  }, []);

  // --- LOCAL PERSISTENCE HELPERS ---
  const handleUpdateOfficialStoreLink = (link: string) => {
    setOfficialStoreLink(link);
    localStorage.setItem('vitrine_official_store_link', link);
  };

  const handleUpdateRedirectionType = (type: 'product' | 'global') => {
    setRedirectionType(type);
    localStorage.setItem('vitrine_redirection_type', type);
  };

  const saveProductsToLocal = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem('vitrine_products', JSON.stringify(updatedProds));
  };

  const saveBannersToLocal = (updatedBanners: BannerType[]) => {
    setBanners(updatedBanners);
    localStorage.setItem('vitrine_banners', JSON.stringify(updatedBanners));
  };

  const saveCartToLocal = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('vitrine_cart', JSON.stringify(updatedCart));
  };

  const saveSavedToLocal = (updatedSaved: Product[]) => {
    setSavedProducts(updatedSaved);
    localStorage.setItem('vitrine_saved', JSON.stringify(updatedSaved));
  };

  const saveClicksToLocal = (updatedClicks: AffiliateClick[]) => {
    setClicks(updatedClicks);
    localStorage.setItem('vitrine_clicks', JSON.stringify(updatedClicks));
  };

  // --- CART CONTROLS ---
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { product, quantity: 1 }];
    }

    saveCartToLocal(updatedCart);
    
    // Quick success pulse message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-50 bg-gray-950 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 border border-gray-800';
    toast.innerHTML = `<span>🛒</span> Adicionado ao carrinho!`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2500);
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQty } : item
    );
    saveCartToLocal(updated);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCartToLocal(updated);
  };

  const handleSaveForLater = (product: Product) => {
    // Remove from cart
    const updatedCart = cart.filter((item) => item.product.id !== product.id);
    saveCartToLocal(updatedCart);

    // Add to saved
    if (!savedProducts.find((p) => p.id === product.id)) {
      const updatedSaved = [...savedProducts, product];
      saveSavedToLocal(updatedSaved);
    }
  };

  const handleRemoveFromSaved = (productId: string) => {
    const updated = savedProducts.filter((p) => p.id !== productId);
    saveSavedToLocal(updated);
  };

  const handleMoveToCart = (product: Product) => {
    // Remove from saved
    const updatedSaved = savedProducts.filter((p) => p.id !== product.id);
    saveSavedToLocal(updatedSaved);

    // Add to cart
    handleAddToCart(product);
  };

  // --- WISHLIST & ORDERS HANDLERS ---
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    let updated: Product[];
    if (exists) {
      updated = wishlist.filter((p) => p.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('vitrine_wishlist', JSON.stringify(updated));

    // Dynamic clean toast alert
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-[120] bg-gray-950 text-white font-black text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-gray-800 animate-slide-in';
    toast.innerHTML = exists 
      ? `<span>💔</span> Removido da sua Wishlist!` 
      : `<span>❤️</span> Adicionado à sua Wishlist!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const handleSuccessPurchase = (newOrder: any) => {
    try {
      const stored = localStorage.getItem('user_orders');
      let orders = stored ? JSON.parse(stored) : [];
      orders = [newOrder, ...orders];
      localStorage.setItem('user_orders', JSON.stringify(orders));
      
      // Update local orders list state if profile open
      saveCartToLocal([]);
    } catch (e) {
      console.error(e);
    }
  };

  // --- AFFILIATE CLICK-OUT & REDIRECT FLOW ---
  const triggerAffiliateRedirect = (product: Product) => {
    // Close modal details just in case
    setSelectedProductDetails(null);
    setIsCartOpen(false);

    // Track statistics
    const existingClickIdx = clicks.findIndex((c) => c.productId === product.id);
    let updatedClicks: AffiliateClick[] = [];

    const nowStr = new Date().toLocaleString('pt-BR');

    if (existingClickIdx > -1) {
      updatedClicks = clicks.map((c, idx) =>
        idx === existingClickIdx
          ? { ...c, clickCount: c.clickCount + 1, lastClicked: nowStr }
          : c
      );
    } else {
      updatedClicks = [
        ...clicks,
        {
          productId: product.id,
          productTitle: product.title,
          clickCount: 1,
          lastClicked: nowStr
        }
      ];
    }
    saveClicksToLocal(updatedClicks);

    // Show Beautiful Redirect Screen Interceptor
    setRedirectingProduct(product);
    setRedirectTimer(2);
  };

  // Timer Countdown for redirection
  useEffect(() => {
    if (!redirectingProduct) return;

    if (redirectTimer === 0) {
      // Execute final absolute marketplace redirect as mandated
      const finalLink = redirectionType === 'global' && officialStoreLink 
        ? officialStoreLink 
        : (redirectingProduct.affiliateLink || officialStoreLink || 'https://shopee.com.br/hiki-ofertas');
      window.location.href = finalLink;
      setRedirectingProduct(null);
      return;
    }

    const interval = setTimeout(() => {
      setRedirectTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(interval);
  }, [redirectTimer, redirectingProduct]);

  // Bulk Checkout / Cart Checkout redirect
  const handleBulkCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutProduct(null);
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  // --- ADMIN FUNCTIONALITY CORES ---
  const handleAddProductAdmin = (newProd: Omit<Product, 'rating' | 'reviewsCount' | 'reviews'>) => {
    const fullProd: Product = {
      ...newProd,
      rating: 4.5 + Math.random() * 0.5, // simulate initial highly positive affiliate reviews
      reviewsCount: Math.floor(10 + Math.random() * 50),
      reviews: [
        {
          id: `rev-sim-${Date.now()}`,
          userName: 'Vitrine Bot',
          rating: 5,
          comment: 'Rápida ativação do cupom de desconto. Indico o vendedor!',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };
    saveProductsToLocal([fullProd, ...products]);
  };

  const handleEditProductAdmin = (editedProd: Product) => {
    const updated = products.map((p) => p.id === editedProd.id ? editedProd : p);
    saveProductsToLocal(updated);
  };

  const handleDeleteProductAdmin = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProductsToLocal(updated);
  };

  const handleUpdateBannersAdmin = (newBanners: BannerType[]) => {
    saveBannersToLocal(newBanners);
  };

  const handleResetCatalogToDefault = () => {
    const confirm = window.confirm('Deseja realmente redefinir o catálogo para os produtos e banners originais da vitrine?');
    if (confirm) {
      setProducts(defaultProducts);
      setBanners(defaultBanners);
      localStorage.setItem('vitrine_products', JSON.stringify(defaultProducts));
      localStorage.setItem('vitrine_banners', JSON.stringify(defaultBanners));
      alert('✓ Vitrine restaurada com sucesso!');
    }
  };

  // --- SIMULATOR: ADD CLIENT RATING INSIDE MODAL ---
  const handleAddModalReview = (productId: string, newReview: Review) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const fallbackReviews = p.reviews || [];
        const nextReviews = [newReview, ...fallbackReviews];
        
        // Recalculate average rating
        const sum = nextReviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = parseFloat((sum / nextReviews.length).toFixed(1));

        return {
          ...p,
          reviews: nextReviews,
          reviewsCount: nextReviews.length,
          rating: avg
        };
      }
      return p;
    });

    saveProductsToLocal(updated);

    // Sync active details state
    const currentDetail = updated.find((p) => p.id === productId);
    if (currentDetail) {
      setSelectedProductDetails(currentDetail);
    }
  };

  // Clean filters when selectedCategory shifts
  useEffect(() => {
    setFilterState({
      brands: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      attributes: {},
    });
  }, [selectedCategory]);

  const handleClearFilters = () => {
    setFilterState({
      brands: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      attributes: {},
    });
  };

  const handleOwnerLoginSuccess = (email: string) => {
    setIsOwner(true);
    localStorage.setItem('vitrine_owner_auth', 'true');
    setIsLoginModalOpen(false);
    setIsAdminMode(true);
  };

  const handleOwnerLogout = () => {
    setIsOwner(false);
    setIsAdminMode(false);
    localStorage.removeItem('vitrine_owner_auth');
  };

  // --- FILTER & SEARCH IMPLEMENTATION ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    if (!matchesSearch || !matchesCategory) return false;

    // Brands multi-select filter
    if (filterState.brands.length > 0 && (!p.brand || !filterState.brands.includes(p.brand))) {
      return false;
    }

    // Price range filters
    if (filterState.minPrice !== '' && p.price < filterState.minPrice) {
      return false;
    }
    if (filterState.maxPrice !== '' && p.price > filterState.maxPrice) {
      return false;
    }

    // Minimum ratings filter
    if (filterState.minRating > 0 && p.rating < filterState.minRating) {
      return false;
    }

    // Category-specific dynamic attributes filter
    let matchesAttributes = true;
    for (const [attrKey, selectedVals] of Object.entries(filterState.attributes)) {
      const vals = selectedVals as string[];
      if (vals.length > 0) {
        const pVal = p.attributes?.[attrKey];
        if (!pVal || !vals.includes(pVal)) {
          matchesAttributes = false;
          break;
        }
      }
    }

    return matchesAttributes;
  });

  const dailyDeals = filteredProducts.filter((p) => p.isDailyDeal);
  const regularProducts = filteredProducts.filter((p) => !p.isDailyDeal);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans" id="app-root-element">
      
      {/* Dynamic Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(catId) => {
          setSelectedCategory(catId);
          setIsAdminMode(false); // return to catalog view automatically
        }}
        cartCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => setIsAdminMode(!isAdminMode)}
        isAdminMode={isAdminMode}
        isOwner={isOwner}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleOwnerLogout}
        onProfileClick={() => setIsProfileOpen(true)}
        onHomeClick={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          setIsAdminMode(false);
        }}
      />

      {/* --- MAIN BODY WORKSPACE --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        
        {/* Catalog container - Always Visible */}
        <div className="space-y-10" id="catalog-workspace-panel-anchor">
          {/* Highlight promotional active banner */}
          <PromoBanner 
            banners={banners} 
            onBannerClick={(b) => {
              if (b.link?.startsWith('#')) {
                const cleanCat = b.link.replace('#', '');
                setSelectedCategory(cleanCat);
              }
            }}
          />

          {/* SECTION: DAILY DEALS (Shopee "Ofertas do Dia" style) */}
          {dailyDeals.length > 0 && (
            <section className="space-y-4" id="daily-deals-section-view">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border-l-4 border-orange-600 rounded-lg p-4 sm:p-5 text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">⚡</span>
                  <div>
                    <h2 className="text-sm sm:text-base font-black tracking-widest uppercase flex items-center gap-1.5 font-sans">
                      Ofertas Relâmpago do Dia
                    </h2>
                    <p className="text-xs text-slate-300 font-bold">
                      Preços inéditos de parceiros oficiais. Links promocionais expiram em breve!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-sm border border-slate-700 text-[10.5px] font-mono font-black uppercase tracking-wider shrink-0 self-end sm:self-auto text-orange-400">
                  <Clock className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span>Descontos Verificados</span>
                </div>
              </div>

              {/* Grid product items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {dailyDeals.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    onViewDetails={(p) => setSelectedProductDetails(p)}
                    onAffiliateRedirect={(p) => {
                      setCheckoutProduct(p);
                      setIsCheckoutOpen(true);
                    }}
                    isInWishlist={wishlist.some((w) => w.id === prod.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* SECTION: GENERAL PRODUCTS GRID */}
          <section className="space-y-4" id="regular-catalog-section-view">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  Recomendados Para Você
                </h2>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">As melhores oportunidades com base nos links de hoje.</p>
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-sm">
                {filteredProducts.length} Produtos
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Dynamic Sidebar Filters - Column 1 */}
              <div className="lg:col-span-1 lg:sticky lg:top-44">
                <AdvancedFilters
                  products={products}
                  currentCategory={selectedCategory}
                  filters={filterState}
                  onChange={setFilterState}
                  onClear={handleClearFilters}
                />
              </div>

              {/* Main Product Showcase - Column 3 */}
              <div className="lg:col-span-3">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
                    <span className="text-4xl block">🔎</span>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Nenhum produto em destaque encontrado</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Não encontramos correspondência para os filtros e pesquisa informados. Tente limpar os filtros avançados ou alterar sua busca!
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-md transition-all cursor-pointer border border-transparent"
                    >
                      Limpar Filtros Avançados
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {regularProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onAddToCart={handleAddToCart}
                        onViewDetails={(p) => setSelectedProductDetails(p)}
                        onAffiliateRedirect={(p) => {
                          setCheckoutProduct(p);
                          setIsCheckoutOpen(true);
                        }}
                        isInWishlist={wishlist.some((w) => w.id === prod.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION: INTEGRATED GOOGLE SEO OPTIMIZER DEMONSTRATION PANEL */}
          <section id="integrated-seo-demonstration">
            <SEOSection products={products} />
          </section>
        </div>

        {/* --- DISCREET ADMIN PANEL AT THE BOTTOM OF THE PAGE --- */}
        <AnimatePresence mode="wait">
          {isAdminMode && isOwner && (
            <motion.div
              key="admin-workspace-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pt-10 border-t border-slate-200 mt-10"
              id="admin-workspace-panel-anchor"
            >
              <AdminPanel
                products={products}
                banners={banners}
                clicks={clicks}
                onAddProduct={handleAddProductAdmin}
                onEditProduct={handleEditProductAdmin}
                onDeleteProduct={handleDeleteProductAdmin}
                onUpdateBanners={handleUpdateBannersAdmin}
                onResetCatalog={handleResetCatalogToDefault}
                officialStoreLink={officialStoreLink}
                onUpdateOfficialStoreLink={handleUpdateOfficialStoreLink}
                redirectionType={redirectionType}
                onUpdateRedirectionType={handleUpdateRedirectionType}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* --- FOOTER BANNER --- */}
      <footer className="bg-slate-900 text-slate-200 border-t border-slate-800 py-10" id="global-vitrine-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-base font-black tracking-widest text-orange-500 font-sans uppercase">
              Hiki Shop
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-[10.5px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Award className="w-4 h-4" /> Distribuidor Recomendado Autorizado Shopee & Amazon
            </span>
          </div>
          
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed font-bold">
            Todos os preços apresentados nesta vitrine são obtidos por meio de parcerias com as respectivas lojas hospedeiras (Shopee, Amazon, Magazine Luiza, AliExpress). A responsabilidade de expedição, entrega e suporte pós-venda recai integralmente sobre a loja marketplace final onde a compra é concluída.
          </p>

          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center flex-wrap gap-2">
            <span>&copy; 2026 Hiki Shop - Desenvolvido para máxima conversão e SEO otimizado no Google Brasil</span>
            <span className="text-slate-700">|</span>
            
            {!isOwner ? (
              <span
                onClick={() => {
                  const val = prompt('Insira a chave de acesso do desenvolvedor:');
                  if (val === 'dtvhdmiSTI1!') {
                    handleOwnerLoginSuccess('narutofamilyhinata@gmail.com');
                    setIsAdminMode(true);
                  } else if (val !== null) {
                    alert('Chave de acesso incorreta.');
                  }
                }}
                className="text-slate-600 hover:text-slate-500 font-bold ml-1 transition-all cursor-pointer lowercase select-none"
                style={{ fontSize: '10.5px' }}
                id="footer-admin-login-disguised-trigger"
                title="hiki shop"
              >
                hiki shop
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsAdminMode(!isAdminMode);
                    if (!isAdminMode) {
                      setTimeout(() => {
                        document.getElementById('admin-workspace-panel-anchor')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }
                  }}
                  className="text-slate-400 hover:text-orange-500 transition-all font-bold cursor-pointer select-none font-sans lowercase tracking-wide"
                  id="discreet-footer-admin-trigger-btn"
                  title="Área de Controle Administrativo"
                >
                  ⚙️ {isAdminMode ? 'fechar painel admin' : 'abrir painel admin'}
                </button>
                <button
                  onClick={handleOwnerLogout}
                  className="text-slate-600 hover:text-red-500 font-bold text-[9px] uppercase tracking-wider transition-colors"
                >
                  [Sair]
                </button>
              </span>
            )}
          </p>
        </div>
      </footer>

      {/* --- SIDE DRAWER: INTELLIGENT CART PANEL --- */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        savedProducts={savedProducts}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onSaveForLater={handleSaveForLater}
        onRemoveSaved={handleRemoveFromSaved}
        onMoveToCart={handleMoveToCart}
        onCheckout={handleBulkCheckout}
      />

      {/* --- MODAL DETAILED SINGLE VIEW --- */}
      <ProductDetailModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onAddToCart={(p) => handleAddToCart(p)}
        onAffiliateRedirect={(p) => {
          setCheckoutProduct(p);
          setIsCheckoutOpen(true);
          setSelectedProductDetails(null);
        }}
        onAddNewReview={handleAddModalReview}
      />

      {/* --- CUSTOMER PROFILE & WISHLIST MODAL --- */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p)}
        onBuyNow={(p) => {
          setCheckoutProduct(p);
          setIsCheckoutOpen(true);
          setIsProfileOpen(false);
        }}
      />

      {/* --- EMBEDDED CHECKOUT & STRIPE GATEWAY PORTAL --- */}
      <CheckoutPortalModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={checkoutProduct}
        cartItems={cart}
        onSuccessPurchase={handleSuccessPurchase}
        officialStoreLink={officialStoreLink}
        redirectionType={redirectionType}
      />

      {/* --- REDIRECTING OVERLAY LOADING INDICATOR --- */}
      <AnimatePresence>
        {redirectingProduct && (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6 text-center" id="redirection-wait-interceptor">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md space-y-6"
            >
              {/* Spinning Loader */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">⚡</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-black text-gray-900">Aplicando Seu Desconto Especial...</h2>
                <p className="text-xs text-emerald-600 font-extrabold bg-emerald-50 px-3 py-1.5 rounded-lg w-fit mx-auto">
                  ✓ Melhor Oferta Selecionada
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-left space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Redirecionando para</span>
                <p className="text-xs font-bold text-gray-950 truncate">
                  {redirectionType === 'global' ? 'Vitrine de Ofertas Hiki Shop' : redirectingProduct.title}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {redirectionType === 'global' && officialStoreLink ? officialStoreLink : redirectingProduct.affiliateLink}
                </p>
              </div>

              <p className="text-[11px] text-gray-400 font-medium">
                Sua navegação é segura e assegura descontos reais. Redirecional automático em <strong>{redirectTimer} segundos</strong> ou clique abaixo para aproveitar imediatamente...
              </p>

              <button
                onClick={() => {
                  window.location.href = redirectionType === 'global' && officialStoreLink ? officialStoreLink : redirectingProduct.affiliateLink;
                }}
                className="px-6 py-2.5 bg-gray-950 hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 mx-auto"
              >
                Aproveitar Agora <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- OWNER SECURITY AUTHENTICATION MODAL GATE --- */}
      <OwnerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleOwnerLoginSuccess}
      />

    </div>
  );
}
