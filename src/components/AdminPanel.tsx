/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Trash2, Edit, Save, ToggleLeft, ToggleRight, Sparkles, 
  BarChart3, Image as ImageIcon, ShoppingBag, FolderHeart, Activity,
  ChevronDown, Settings, Upload, Loader2
} from 'lucide-react';
import { Product, PromoBanner, AffiliateClick } from '../types';

interface AdminPanelProps {
  products: Product[];
  banners: PromoBanner[];
  clicks: AffiliateClick[];
  onAddProduct: (product: Omit<Product, 'rating' | 'reviewsCount' | 'reviews'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateBanners: (banners: PromoBanner[]) => void;
  onResetCatalog: () => void;
  officialStoreLink: string;
  onUpdateOfficialStoreLink: (link: string) => void;
  redirectionType: 'product' | 'global';
  onUpdateRedirectionType: (type: 'product' | 'global') => void;
}

export default function AdminPanel({
  products,
  banners,
  clicks,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateBanners,
  onResetCatalog,
  officialStoreLink,
  onUpdateOfficialStoreLink,
  redirectionType,
  onUpdateRedirectionType
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'banners' | 'analytics' | 'settings'>('products');

  // Official Store States
  const [officialStoreLinkState, setOfficialStoreLinkState] = useState(officialStoreLink);
  const [redirectionTypeState, setRedirectionTypeState] = useState(redirectionType);

  // Mercado Pago Configuration States
  const [mpAccessToken, setMpAccessToken] = React.useState('');
  const [mpPublicKey, setMpPublicKey] = React.useState('');

  React.useEffect(() => {
    setMpAccessToken(localStorage.getItem('vitrine_mp_access_token') || '');
    setMpPublicKey(localStorage.getItem('vitrine_mp_public_key') || '');
  }, []);

  // Sync state if values change
  React.useEffect(() => {
    setOfficialStoreLinkState(officialStoreLink);
  }, [officialStoreLink]);

  React.useEffect(() => {
    setRedirectionTypeState(redirectionType);
  }, [redirectionType]);

  const handleSaveSettings = () => {
    onUpdateOfficialStoreLink(officialStoreLinkState);
    onUpdateRedirectionType(redirectionTypeState);
    localStorage.setItem('vitrine_mp_access_token', mpAccessToken.trim());
    localStorage.setItem('vitrine_mp_public_key', mpPublicKey.trim());
    
    // Alert success beautifully
    alert('✓ Configurações da Loja e Chaves do Mercado Pago salvas com sucesso!');
  };

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newCategory, setNewCategory] = useState('gamer');
  const [newAffiliateLink, setNewAffiliateLink] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isDailyDeal, setIsDailyDeal] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Quick image options
  const quickImages = [
    { name: 'Gamer Mouse', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600' },
    { name: 'Headset RGB', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Teclado Mecânico', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Air Fryer', url: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=600' },
    { name: 'Smartwatch', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600' },
    { name: 'Mochila Urbana', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600' },
  ];

  // Inline editing product IDs
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState('');
  const [editingOriginalPrice, setEditingOriginalPrice] = useState('');
  const [editingAffiliateLink, setEditingAffiliateLink] = useState('');

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to highly compact JPEG with 85% quality
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setNewImage(resizedDataUrl);
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        setIsUploading(false);
        alert('Erro ao processar imagem para o formato correto.');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Erro ao ler o arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim() || !newAffiliateLink.trim()) return;

    onAddProduct({
      id: `custom-${Date.now()}`,
      title: newTitle,
      price: parseFloat(newPrice),
      originalPrice: newOriginalPrice ? parseFloat(newOriginalPrice) : undefined,
      category: newCategory,
      affiliateLink: newAffiliateLink,
      description: newDescription || 'Sem descrição fornecida.',
      image: newImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
      tags: newTags ? newTags.split(',').map(t => t.trim()) : [],
      isDailyDeal,
      isFeatured
    });

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewAffiliateLink('');
    setNewDescription('');
    setNewImage('');
    setNewTags('');
    setIsDailyDeal(false);
    setIsFeatured(false);
    alert('✓ Produto criado com sucesso na vitrine de afiliados!');
  };

  const startEditing = (p: Product) => {
    setEditingProductId(p.id);
    setEditingPrice(p.price.toString());
    setEditingOriginalPrice(p.originalPrice?.toString() || '');
    setEditingAffiliateLink(p.affiliateLink);
  };

  const saveProductEdit = (p: Product) => {
    if (!editingAffiliateLink.trim()) {
      alert('O link de afiliado não pode estar vazio.');
      return;
    }
    onEditProduct({
      ...p,
      price: parseFloat(editingPrice),
      originalPrice: editingOriginalPrice ? parseFloat(editingOriginalPrice) : undefined,
      affiliateLink: editingAffiliateLink,
    });
    setEditingProductId(null);
  };

  const toggleBanner = (bannerId: string) => {
    const updated = banners.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b);
    onUpdateBanners(updated);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8" id="admin-panel-container">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-500 animate-spin-slow" />
            Painel do Divulgador Afiliado
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Gerencie seu catálogo de promoções, links externos de afiliado Shopee/Amazon e visualize estatísticas de redirecionamento.
          </p>
        </div>
        <button
          onClick={onResetCatalog}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-full transition-all cursor-pointer"
          id="reset-catalog-btn"
        >
          Apagar Customizados & Reset para Padrão
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-100 pb-0.5 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products' ? 'border-orange-500 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
          id="admin-tab-products"
        >
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            Produtos da Vitrine ({products.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'banners' ? 'border-orange-500 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
          id="admin-tab-banners"
        >
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            Banners de Destaque ({banners.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics' ? 'border-orange-500 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
          id="admin-tab-analytics"
        >
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            Relatórios de Cliques ({clicks.reduce((acc, c) => acc + c.clickCount, 0)} cliques)
          </span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings' ? 'border-orange-500 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
          id="admin-tab-settings"
        >
          <span className="flex items-center gap-1.5">
            <Settings className="w-4 h-4" />
            Loja Oficial & Redirecionamento
          </span>
        </button>
      </div>

      {/* PRODUCTS TAB CONTENT */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" id="admin-products-tab-content">
          
          {/* New Product Form */}
          <form onSubmit={handleCreateProduct} className="lg:col-span-2 space-y-4 bg-gray-50/70 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-orange-500" />
              Novo Produto Afiliado
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Título do Produto *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Notebook Gamer Avançado 16GB"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Preço Atual (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="89.90"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Preço Normal (Slashed)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="149.90"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Categoria *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="gamer">Gamer</option>
                    <option value="casa">Casa</option>
                    <option value="celulares">Celulares</option>
                    <option value="cozinha">Cozinha</option>
                    <option value="moda">Moda</option>
                    <option value="informatica">Informática</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Tags (Vírgula)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Gamer, RGB, Promo"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-1">Link de Afiliado Seguro (Shopee/Amazon) *</label>
                <input
                  type="url"
                  value={newAffiliateLink}
                  onChange={(e) => setNewAffiliateLink(e.target.value)}
                  placeholder="https://shopee.com.br/meu-link-afiliado"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-1">Imagem do Produto</label>
                
                {/* Drag and Drop File Upload Area */}
                <div className="border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50/5 rounded-2xl p-4 text-center cursor-pointer transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                        <span className="font-bold text-gray-600">Dimensionando e otimizando imagem...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-orange-500" />
                        <span className="font-black text-gray-700">Escolha um arquivo do seu computador</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">A imagem será ajustada e cortada perfeitamente</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview and Manual URL field */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 bg-white p-2 border border-gray-150 rounded-xl">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-150 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      {newImage ? (
                        <img 
                          src={newImage} 
                          alt="Previsualização" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previsualização</p>
                      <p className="text-[11px] text-gray-600 font-medium truncate">
                        {newImage ? "Imagem carregada e pronta!" : "Nenhuma imagem selecionada"}
                      </p>
                      {newImage && (
                        <button
                          type="button"
                          onClick={() => setNewImage('')}
                          className="text-[10px] text-red-600 font-bold hover:underline"
                        >
                          Remover imagem
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ou cole uma URL externa:</label>
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://exemplo.com/imagem.png"
                      className="w-full p-2 bg-white border border-gray-200 text-xs rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="mt-3 text-[10px] text-gray-400">
                  <p className="mb-1 font-bold">Imagens prontas para testar:</p>
                  <div className="grid grid-cols-3 gap-1">
                    {quickImages.map((qi, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewImage(qi.url)}
                        className="p-1 border border-gray-150 rounded-sm hover:border-orange-500 text-left bg-white truncate font-medium text-[9.5px]"
                        title={qi.name}
                      >
                        {qi.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-1">Descrição do Produto</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Escreva detalhes do produto, facilidades de uso..."
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 h-20 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDailyDeal}
                    onChange={(e) => setIsDailyDeal(e.target.checked)}
                    className="rounded-sm border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Oferta do Dia</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded-sm border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Ver em Destaque</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 font-extrabold text-white rounded-xl hover:bg-orange-700 transition-all shadow-xs cursor-pointer"
                id="create-product-admin-submit"
              >
                Adicionar Produto à Loja
              </button>
            </div>
          </form>

          {/* Catalog Operations List */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider">Produtos Cadastrados ({products.length})</h3>
            
            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
              {products.map((p) => {
                const isEditing = editingProductId === p.id;

                return (
                  <div key={p.id} className="p-4 bg-white border border-gray-150 rounded-2xl flex gap-3.5 items-center justify-between" id={`admin-cat-item-${p.id}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1 py-0.5 rounded-sm">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-bold text-gray-950 truncate max-w-[180px] sm:max-w-xs mt-1">
                          {p.title}
                        </h4>
                        
                        {isEditing ? (
                          <div className="flex flex-col gap-1.5 mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Preço (R$)</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editingPrice}
                                  onChange={(e) => setEditingPrice(e.target.value)}
                                  className="w-20 p-1 text-xs border border-gray-300 rounded-sm font-bold text-slate-800"
                                  placeholder="Preço"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Anterior (R$)</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editingOriginalPrice}
                                  onChange={(e) => setEditingOriginalPrice(e.target.value)}
                                  className="w-20 p-1 text-xs border border-gray-300 rounded-sm font-bold text-slate-400"
                                  placeholder="Original"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col mt-1">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Link de Afiliado</span>
                              <input
                                type="url"
                                value={editingAffiliateLink}
                                onChange={(e) => setEditingAffiliateLink(e.target.value)}
                                className="w-full max-w-[200px] sm:max-w-xs p-1 text-[11px] border border-gray-300 rounded-sm text-blue-700 font-mono"
                                placeholder="https://shopee.com.br/link"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-orange-600">
                                R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                              {p.originalPrice && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  R$ {p.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              )}
                            </div>
                            <div className="text-[9.5px] text-slate-500 mt-1 max-w-[180px] sm:max-w-xs truncate flex items-center gap-1">
                              <span className="font-extrabold uppercase text-[8px] bg-slate-100 px-1 py-0.2 rounded-sm text-slate-600">Link:</span>
                              <a
                                href={p.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline font-mono truncate"
                                title={p.affiliateLink}
                              >
                                {p.affiliateLink}
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isEditing ? (
                        <button
                          onClick={() => saveProductEdit(p)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-all"
                          title="Salvar alterações"
                          id={`save-edit-btn-${p.id}`}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(p)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer transition-all"
                          title="Editar preços"
                          id={`start-edit-btn-${p.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all"
                        title="Deletar produto"
                        id={`delete-prod-btn-${p.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* BANNERS TAB CONTENT */}
      {activeTab === 'banners' && (
        <div className="space-y-6" id="admin-banners-tab-content">
          <div className="bg-orange-50/50 p-4 border border-orange-100 rounded-2xl flex items-center gap-2">
            <Sparkles className="text-orange-500 w-5 h-5 shrink-0" />
            <p className="text-xs text-orange-850">
              Gerencie quais campanhas promocionais estão ativas no cabeçalho rotativo de banners do site afiliado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {banners.map((ban) => (
              <div key={ban.id} className="bg-white border border-gray-150 rounded-2xl overflow-hidden flex flex-col h-full shadow-xs">
                <div className="relative aspect-video w-full bg-gray-50">
                  <img
                    src={ban.image}
                    alt={ban.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-2.5 right-2.5 px-2 py-1 text-[10px] font-bold uppercase rounded-md text-white ${
                    ban.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}>
                    {ban.isActive ? 'Ativo' : 'Pausado'}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2.5">
                  <h4 className="text-xs font-bold text-gray-950 line-clamp-1">{ban.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{ban.subtitle}</p>

                  <button
                    onClick={() => toggleBanner(ban.id)}
                    className={`mt-auto w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      ban.isActive 
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    id={`toggle-banner-btn-${ban.id}`}
                  >
                    {ban.isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                        Pausar Banner
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-gray-400" />
                        Ativar Banner
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB CONTENT */}
      {activeTab === 'analytics' && (
        <div className="space-y-6" id="admin-analytics-tab-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl text-orange-600 shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total de Cliques</span>
                <span className="text-2.5xl font-black text-gray-900">{clicks.reduce((acc, c) => acc + c.clickCount, 0)}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
                <FolderHeart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Produto Mais Clicado</span>
                <span className="text-xs font-black text-gray-950 truncate max-w-[160px] block lg:max-w-[200px]">
                  {clicks.sort((a,b) => b.clickCount - a.clickCount)[0]?.productTitle || 'Nenhum clique ainda'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Garantia Afiliada</span>
                <span className="text-xs font-bold text-gray-600 mt-1 block">100% de Redirecionamento Ativo</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-50/70 p-4 border-b border-gray-100 text-xs font-bold text-gray-600 grid grid-cols-3 sm:grid-cols-4 gap-4">
              <span className="col-span-2">Produto de Origem</span>
              <span className="text-center">Quantidade de Redirecionamentos</span>
              <span className="hidden sm:block text-right">Último Clique Registrado</span>
            </div>

            {clicks.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-10">Aguardando as primeiras interações de compra nos links dos afiliados.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {clicks.map((clk) => (
                  <div key={clk.productId} className="p-4 text-xs font-medium text-gray-700 grid grid-cols-3 sm:grid-cols-4 gap-4 items-center">
                    <span className="col-span-2 text-gray-950 font-bold truncate">{clk.productTitle}</span>
                    <span className="text-center font-black text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-sm mx-auto">{clk.clickCount} cliques</span>
                    <span className="hidden sm:block text-right text-gray-400 text-[11px]">{clk.lastClicked}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS / OFFICIAL STORE TAB CONTENT */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in" id="admin-settings-tab-content">
          <div className="bg-orange-50/50 p-5 border border-orange-100 rounded-2xl flex items-start gap-3">
            <Settings className="text-orange-600 w-5 h-5 shrink-0 mt-0.5 animate-spin-slow" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-orange-950 uppercase tracking-wide">Configurações de Redirecionamento de Clientes</h3>
              <p className="text-xs text-orange-800 leading-relaxed font-semibold">
                Defina o link oficial da sua <strong>Loja Oficial</strong> e escolha como os clientes serão redirecionados quando clicarem nos botões de compra ou finalizarem carrinho.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-50/50 border border-gray-150 p-6 rounded-2xl space-y-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">Link de Afiliado da Loja Oficial Principal</label>
                <p className="text-[11px] text-gray-400 font-medium">Insira o link global de afiliado da sua loja (Ex: sua coleção oficial da Shopee, link geral de associado Amazon, ou página agregadora).</p>
                <input
                  type="url"
                  value={officialStoreLinkState}
                  onChange={(e) => setOfficialStoreLinkState(e.target.value)}
                  placeholder="https://shopee.com.br/minha-colecao-oficial"
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono text-blue-700"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">Comportamento de Redirecionamento</label>
                <p className="text-[11px] text-gray-400 font-medium">Configure para onde os clientes serão enviados ao clicar em comprar ou finalizar pedidos:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Product Specific */}
                  <div 
                    onClick={() => setRedirectionTypeState('product')}
                    className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-32 select-none ${
                      redirectionTypeState === 'product'
                        ? 'border-orange-500 bg-orange-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Por Produto</span>
                      <h4 className="text-xs font-black text-slate-800 uppercase">Link do Produto Individual</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug font-medium">O cliente será levado diretamente para o link de afiliado cadastrado na página daquele produto.</p>
                  </div>

                  {/* Option 2: Global Official Link */}
                  <div 
                    onClick={() => setRedirectionTypeState('global')}
                    className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-32 select-none ${
                      redirectionTypeState === 'global'
                        ? 'border-orange-500 bg-orange-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Geral / Único</span>
                      <h4 className="text-xs font-black text-slate-800 uppercase">Link da Loja Oficial Geral</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug font-medium">Qualquer clique em comprar levará o cliente para o seu link principal configurado acima.</p>
                  </div>
                </div>
              </div>

              {/* Mercado Pago API Configuration */}
              <div className="pt-5 border-t border-gray-150 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Integração do Mercado Pago (PIX)</span>
                  <span className="bg-blue-100 text-blue-700 font-extrabold text-[8.5px] px-2 py-0.5 rounded uppercase font-mono">PIX INSTANTÂNEO</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed font-sans">
                  Insira suas credenciais abaixo para gerar QR Codes e Copia e Cola reales do Mercado Pago via PIX. Caso deixe em branco, o sistema utilizará o <strong>Motor de Simulação Resiliente</strong> inteligente, mantendo o fluxo de transação 100% testável.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Access Token (Prod ou Dev)</label>
                    <input
                      type="password"
                      value={mpAccessToken}
                      onChange={(e) => setMpAccessToken(e.target.value)}
                      placeholder="APP_USR-xxxxxxxxxxxxxxxx-xxxx"
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Public Key (Opcional)</label>
                    <input
                      type="text"
                      value={mpPublicKey}
                      onChange={(e) => setMpPublicKey(e.target.value)}
                      placeholder="APP_USR-xxxxxxxx-xxxx"
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-150 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  id="save-official-settings-btn"
                >
                  Salvar Configurações
                </button>
              </div>

            </div>

            <div className="bg-orange-50/10 p-5 rounded-2xl border border-orange-100 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-widest text-orange-600">Simulação de Rota de Venda</span>
                <h4 className="text-xs font-black text-slate-900 leading-snug uppercase">Fluxo Ativo de Redireção</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                  Com as atuais definições da loja, qualquer botão de redirecionamento enviará os clientes para:
                </p>
                <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">URL Destino Final:</span>
                  <p className="text-[10px] font-mono font-black text-orange-600 truncate" title={redirectionTypeState === 'global' ? officialStoreLinkState : 'Link inserido na ficha de cada produto'}>
                    {redirectionTypeState === 'global' ? (officialStoreLinkState || 'https://shopee.com.br/hiki-ofertas') : 'Link do produto correspondente'}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 leading-snug space-y-1 bg-white p-3 border border-slate-150 rounded-xl font-medium">
                <p className="font-bold text-slate-700 uppercase">💡 Dica de Afiliado:</p>
                <p>Usar a redirection global é ideal quando você quer centralizar o engajamento em sua página de cupons ou agregador principal!</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
