import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminFabricTypes from './tabs/AdminFabricTypes';
import AdminFabrics from './tabs/AdminFabrics';
import AdminOrders from './tabs/AdminOrders';

const TABS = [
  { id: 'orders',       label: 'Commandes',      icon: '📦', short: 'CMD' },
  { id: 'fabric-types', label: 'Catégories',     icon: '🗂️', short: 'CAT' },
  { id: 'fabrics',      label: 'Produits Tissu', icon: '🧵', short: 'PROD' },
  { id: 'settings',     label: 'Paramètres',     icon: '⚙️', short: 'SET' },
];

// ─── Compression d'image d'accueil ──────────────────────────────────────────
const compressImage = (file, maxWidth = 600, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = url;
  });
};

// ─── Settings Tab ─────────────────────────────────────────────────────────────────────────────────
function AdminSettings() {
  const { adminPassword, changePassword, logout, orders, homepageSettings, updateHomepageSettings, fabricsData } = useAdmin();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [galleryMsg, setGalleryMsg] = useState('');

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const handleChangePass = () => {
    if (oldPass !== adminPassword) { showMsg('Ancien mot de passe incorrect.', 'error'); return; }
    if (newPass.length < 6) { showMsg('Le nouveau mot de passe doit avoir au moins 6 caractères.', 'error'); return; }
    if (newPass !== confirmPass) { showMsg('Les mots de passe ne correspondent pas.', 'error'); return; }
    changePassword(newPass);
    setOldPass(''); setNewPass(''); setConfirmPass('');
    showMsg('✅ Mot de passe modifié avec succès.');
  };

  const totalRevenue = orders
    .filter(o => o.status !== 'annulee')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Produits actifs disponibles pour le choix du produit vedette
  const activeProducts = (fabricsData || []).filter(f => f.active !== false);
  const featuredProductId = homepageSettings?.featuredProductId || '';
  const featuredProduct = activeProducts.find(f => String(f.id) === String(featuredProductId));

  // Galerie actuelle
  const currentGallery = homepageSettings?.galleryImages || [];

  const handleSelectFeatured = async (productId) => {
    await updateHomepageSettings({ featuredProductId: productId });
    showMsg('✅ Produit vedette mis à jour.');
  };

  const handleAddGalleryImages = async (files) => {
    if (!files || files.length === 0) return;
    const MAX = 6;
    const remaining = MAX - currentGallery.length;
    if (remaining <= 0) {
      setGalleryMsg('⚠️ Maximum 6 photos atteint. Supprimez une photo d\'abord.');
      setTimeout(() => setGalleryMsg(''), 3500);
      return;
    }
    const toProcess = Array.from(files).slice(0, remaining);
    const compressed = [];
    for (const file of toProcess) {
      try {
        const b64 = await compressImage(file, 500, 0.55);
        compressed.push(b64);
      } catch (e) {
        console.error('Compression err:', e);
      }
    }
    if (compressed.length > 0) {
      const newGallery = [...currentGallery, ...compressed];
      await updateHomepageSettings({ galleryImages: newGallery });
      setGalleryMsg(`✅ ${compressed.length} photo(s) ajoutée(s) à la galerie.`);
      setTimeout(() => setGalleryMsg(''), 3500);
    }
  };

  const handleRemoveGalleryImage = async (index) => {
    const newGallery = currentGallery.filter((_, i) => i !== index);
    await updateHomepageSettings({ galleryImages: newGallery });
    setGalleryMsg('✅ Photo supprimée.');
    setTimeout(() => setGalleryMsg(''), 2500);
  };

  const handleResetGallery = async () => {
    const defaultGallery = [
      '/photo_20_2026-07-03_20-52-45.jpg',
      '/photo_21_2026-07-03_20-52-45.jpg',
      '/photo_22_2026-07-03_20-52-45.jpg',
      '/photo_23_2026-07-03_20-52-45.jpg',
      '/photo_24_2026-07-03_20-52-45.jpg',
      '/photo_25_2026-07-03_20-52-45.jpg',
    ];
    await updateHomepageSettings({ galleryImages: defaultGallery });
    setGalleryMsg('✅ Galerie réinitialisée aux photos originales.');
    setTimeout(() => setGalleryMsg(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-black text-white">Paramètres</h2>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Commandes</p>
          <p className="text-3xl font-black text-white">{orders.length}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">CA Estimé</p>
          <p className="text-3xl font-black text-amber-400">{totalRevenue.toFixed(0)} <span className="text-base text-slate-400">DA</span></p>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-bold">Changer le mot de passe admin</h3>
        {['Ancien mot de passe', 'Nouveau mot de passe', 'Confirmer le nouveau'].map((label, i) => {
          const vals = [oldPass, newPass, confirmPass];
          const setters = [setOldPass, setNewPass, setConfirmPass];
          return (
            <div key={i} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">{label}</label>
              <input type="password" value={vals[i]} onChange={e => setters[i](e.target.value)}
                className="admin-input w-full" placeholder="••••••••" />
            </div>
          );
        })}
        {msg.text && (
          <p className={`text-xs font-bold ${msg.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{msg.text}</p>
        )}
        <button onClick={handleChangePass}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white font-black rounded-xl transition-colors text-sm">
          Modifier le mot de passe
        </button>
      </div>

      {/* Configuration page d'accueil */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-bold">Image principale d'accueil (Hero)</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Cette image s'affiche sur la droite de la page d'accueil des visiteurs. Elle doit être attractive.
        </p>
        
        <div className="flex items-center gap-4">
          <div className="w-20 h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
            <img 
              src={homepageSettings?.heroImage || '/photo_9_2026-07-03_20-52-45.jpg'} 
              alt="Accueil" 
              className="w-full h-full object-cover" 
              onError={e => e.target.style.display='none'}
            />
          </div>
          <div className="flex-grow space-y-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all border border-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Changer la photo d'accueil</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const compressed = await compressImage(file);
                      await updateHomepageSettings({ heroImage: compressed });
                      showMsg('✅ Photo d\'accueil mise à jour avec succès.');
                    } catch (err) {
                      showMsg('Erreur lors de la compression de la photo.', 'error');
                    }
                  }
                }}
              />
            </label>
            <p className="text-[10px] text-slate-500 font-medium">Format conseillé: vertical (4:5)</p>
          </div>
        </div>
      </div>

      {/* Produit Vedette */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-white font-bold">⭐ Produit Vedette (Page d'accueil)</h3>
          <p className="text-slate-400 text-xs leading-relaxed mt-1">
            Le produit sélectionné s'affichera en premier dans la section "Sélection Vedette" avec un badge distinctif. Les visiteurs pourront cliquer dessus pour voir ses détails.
          </p>
        </div>

        {/* Aperçu du produit vedette actuel */}
        {featuredProduct && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
              <img
                src={featuredProduct.image || ''}
                alt={featuredProduct.nameFr || ''}
                className="w-full h-full object-cover"
                onError={e => e.target.style.display='none'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-amber-300 font-bold text-xs truncate">{featuredProduct.nameFr || featuredProduct.nameAr}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{featuredProduct.pricePerMeter} DA/m</p>
            </div>
            <span className="text-amber-400 text-lg">⭐</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Sélectionner le produit vedette</label>
          <select
            value={featuredProductId}
            onChange={e => handleSelectFeatured(e.target.value)}
            className="admin-input w-full"
          >
            <option value="">-- Aucun produit vedette --</option>
            {activeProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.nameFr || p.nameAr} — {p.pricePerMeter} DA/m
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Galerie du Magasin */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-white font-bold">🖼️ Galerie du Magasin</h3>
          <p className="text-slate-400 text-xs leading-relaxed mt-1">
            Ces photos s'affichent dans la section galerie en bas de la page d'accueil. Maximum 6 photos.
          </p>
        </div>

        {galleryMsg && (
          <p className={`text-xs font-bold ${galleryMsg.startsWith('⚠️') ? 'text-amber-400' : 'text-emerald-400'}`}>{galleryMsg}</p>
        )}

        {/* Grid des photos actuelles */}
        <div className="grid grid-cols-3 gap-2">
          {currentGallery.map((src, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
              <img
                src={src.startsWith('data:') ? src : src}
                alt={`Galerie ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveGalleryImage(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/60 text-white px-1 rounded">{idx + 1}</span>
            </div>
          ))}
          {/* Slot vide pour ajouter */}
          {currentGallery.length < 6 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-600 hover:border-amber-500 transition-colors flex flex-col items-center justify-center cursor-pointer gap-1 text-slate-500 hover:text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-bold">Ajouter</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleAddGalleryImages(e.target.files)}
              />
            </label>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ajouter photo(s)
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleAddGalleryImages(e.target.files)}
            />
          </label>
          <button
            onClick={handleResetGallery}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réinitialiser photos originales
          </button>
        </div>
        <p className="text-[10px] text-slate-500">
          {currentGallery.length}/6 photos • Les photos sont comprimées automatiquement
        </p>
      </div>

      {/* Danger zone */}
      <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-5 space-y-3">
        <h3 className="text-red-400 font-bold">Zone dangereuse</h3>
        <button onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 font-bold text-sm rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard Shell ──────────────────────────────────────────────────────
export default function AdminDashboard({ setCurrentPage }) {
  const { orders, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingCount = orders.filter(o => o.status === 'en_attente').length;

  const renderTab = () => {
    switch (activeTab) {
      case 'orders':       return <AdminOrders />;
      case 'fabric-types': return <AdminFabricTypes />;
      case 'fabrics':      return <AdminFabrics />;
      case 'settings':     return <AdminSettings />;
      default:             return <AdminOrders />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex" dir="ltr">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-black text-sm">BZ</span>
            </div>
            <div>
              <p className="text-white font-black text-sm">Admin Panel</p>
              <p className="text-slate-500 text-[10px]">Bab Zir Tissu</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {tab.id === 'orders' && pendingCount > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Back to site + Logout */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voir le site
          </button>
          <button
            onClick={() => {
              logout();
              setCurrentPage('home');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-white font-black text-base">
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>
          {pendingCount > 0 && activeTab !== 'orders' && (
            <button onClick={() => setActiveTab('orders')}
              className="ml-auto flex items-center gap-1.5 text-xs bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full font-bold animate-pulse">
              📦 {pendingCount} commande{pendingCount > 1 ? 's' : ''} en attente
            </button>
          )}
        </header>

        {/* Tab content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
