import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

// ─── Status badge config ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  en_attente: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  confirmee:  { label: 'Confirmée',  color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  expediee:   { label: 'Expédiée',   color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  livree:     { label: 'Livrée',     color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  annulee:    { label: 'Annulée',    color: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder, exportOrdersCSV } = useAdmin();
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.client?.fullName?.toLowerCase().includes(q) ||
      o.client?.phone?.includes(q) ||
      o.id?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: orders.length,
    en_attente: orders.filter(o => o.status === 'en_attente').length,
    confirmee: orders.filter(o => o.status === 'confirmee').length,
    expediee: orders.filter(o => o.status === 'expediee').length,
    livree: orders.filter(o => o.status === 'livree').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Gestion des Commandes</h2>
          <p className="text-slate-400 text-sm">{orders.length} commande(s) au total</p>
        </div>
        <button
          onClick={() => exportOrdersCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter CSV ({filtered.length})
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'en_attente', label: 'En attente', icon: '⏳', color: 'from-yellow-600/20 to-yellow-700/10 border-yellow-500/20' },
          { key: 'confirmee',  label: 'Confirmées', icon: '✅', color: 'from-blue-600/20 to-blue-700/10 border-blue-500/20' },
          { key: 'expediee',   label: 'Expédiées',  icon: '🚚', color: 'from-purple-600/20 to-purple-700/10 border-purple-500/20' },
          { key: 'livree',     label: 'Livrées',    icon: '📦', color: 'from-emerald-600/20 to-emerald-700/10 border-emerald-500/20' },
        ].map(s => (
          <div key={s.key} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02]`}
            onClick={() => setFilterStatus(filterStatus === s.key ? 'all' : s.key)}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-white">{stats[s.key]}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone ou ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-semibold">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
              {/* Order header */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="mt-0.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className={`w-5 h-5 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{order.id}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[order.status]?.color || 'bg-slate-700 text-slate-300'}`}>
                        {STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                    </div>
                    <p className="text-white font-bold text-sm mt-0.5">{order.client?.fullName}</p>
                    <p className="text-slate-400 text-xs">{order.client?.phone} · {order.client?.wilaya?.nameFr || order.client?.wilaya} · {order.client?.commune}</p>
                    <p className="text-slate-500 text-[11px]">{new Date(order.date).toLocaleString('fr-DZ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-8 sm:ml-0">
                  <div className="text-right">
                    <p className="text-amber-400 font-black text-lg">{order.total?.toFixed(0)} DA</p>
                    <p className="text-slate-500 text-xs">{order.deliveryType === 'home' ? '🏠 Domicile' : '📍 Stop Desk'}</p>
                  </div>

                  {/* Status change */}
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="text-xs bg-slate-700 border border-slate-600 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500"
                  >
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setConfirmDelete(order.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Détails des articles</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-slate-300">{item.fabric?.nameFr || item.fabric?.nameAr}</span>
                        <span className="text-slate-400">{item.length}m × {item.fabric?.price} DA</span>
                        <span className="text-white font-bold">{(item.length * item.fabric?.price).toFixed(0)} DA</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-sm">
                    <span className="text-slate-400">Sous-total</span>
                    <span className="text-white">{order.subtotal?.toFixed(0)} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Livraison ZR Express</span>
                    <span className="text-white">{order.shippingFee} DA</span>
                  </div>
                  <div className="flex justify-between text-base font-black mt-1">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400">{order.total?.toFixed(0)} DA</span>
                  </div>
                  {order.client?.address && (
                    <p className="mt-3 text-xs text-slate-500">📍 Adresse : {order.client.address}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">🗑️</div>
            <h3 className="text-white font-black">Supprimer cette commande ?</h3>
            <p className="text-slate-400 text-sm">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">
                Annuler
              </button>
              <button onClick={() => { deleteOrder(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
