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

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function AdminSettings() {
  const { adminPassword, changePassword, logout, orders } = useAdmin();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChangePass = () => {
    if (oldPass !== adminPassword) { setMsg({ text: 'Ancien mot de passe incorrect.', type: 'error' }); return; }
    if (newPass.length < 6) { setMsg({ text: 'Le nouveau mot de passe doit avoir au moins 6 caractères.', type: 'error' }); return; }
    if (newPass !== confirmPass) { setMsg({ text: 'Les mots de passe ne correspondent pas.', type: 'error' }); return; }
    changePassword(newPass);
    setOldPass(''); setNewPass(''); setConfirmPass('');
    setMsg({ text: '✅ Mot de passe modifié avec succès.', type: 'success' });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const totalRevenue = orders
    .filter(o => o.status !== 'annulee')
    .reduce((sum, o) => sum + (o.total || 0), 0);

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
