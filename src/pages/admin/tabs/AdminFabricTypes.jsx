import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

// ─── Modal for Add / Edit ────────────────────────────────────────────────────
function FabricTypeModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    nameAr: initial?.nameAr || '',
    nameFr: initial?.nameFr || '',
    description: initial?.description || '',
    image: initial?.image || '',
    active: initial?.active !== false,
  });

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-lg">{initial ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Nom en arabe</label>
            <input dir="rtl" value={form.nameAr} onChange={e => set('nameAr', e.target.value)}
              placeholder="فيطنام" className="admin-input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Nom en français</label>
            <input value={form.nameFr} onChange={e => set('nameFr', e.target.value)}
              placeholder="Drap Vietnam" className="admin-input w-full" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Description (optionnelle)</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={2} placeholder="Description courte de cette catégorie..." className="admin-input w-full resize-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Image de la catégorie (Lien local ou Upload)</label>
          <div className="flex gap-2 items-center">
            <input
              value={form.image}
              onChange={e => set('image', e.target.value)}
              placeholder="/photo_exemple.jpg ou https://..."
              className="admin-input flex-1 text-xs"
            />
            
            <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Sélectionner</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      set('image', event.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>

            {form.image && (
              <button
                type="button"
                onClick={() => set('image', '')}
                className="p-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                title="Vider l'image"
              >
                🗑️
              </button>
            )}
          </div>
          {form.image && (
            <img src={form.image} alt="aperçu" className="h-20 object-cover rounded-xl mt-2 border border-slate-700" onError={e => e.target.style.display='none'} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set('active', !form.active)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-amber-500' : 'bg-slate-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm text-slate-300">{form.active ? 'Active' : 'Inactive'}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">
            Annuler
          </button>
          <button
            onClick={() => { if (form.nameAr && form.nameFr) { onSave(form); onClose(); } }}
            disabled={!form.nameAr || !form.nameFr}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-black transition-colors"
          >
            {initial ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminFabricTypes() {
  const { fabricTypes, addFabricType, updateFabricType, deleteFabricType, reorderFabricTypes } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = (formData) => {
    if (editingType) {
      updateFabricType(editingType.id, formData);
    } else {
      addFabricType(formData);
    }
    setEditingType(null);
  };

  const sorted = [...fabricTypes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Types de Tissu</h2>
          <p className="text-slate-400 text-sm">{fabricTypes.length} catégorie(s)</p>
        </div>
        <button
          onClick={() => { setEditingType(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle catégorie
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((type, index) => (
          <div key={type.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden group">
            {/* Image */}
            <div className="h-32 bg-slate-900 relative overflow-hidden">
              {type.image ? (
                <img src={type.image} alt={type.nameFr} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={e => e.target.style.display='none'} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-slate-700">🧵</div>
              )}
              {/* Active badge */}
              <span className={`absolute top-2 right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${type.active !== false ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                {type.active !== false ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-black">{type.nameFr}</p>
                  <p className="text-slate-400 text-sm" dir="rtl">{type.nameAr}</p>
                </div>
              </div>
              {type.description && (
                <p className="text-slate-500 text-xs line-clamp-2">{type.description}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <div className="flex gap-1">
                  <button
                    onClick={() => index > 0 && reorderFabricTypes(index, index - 1)}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                    title="Monter"
                  >↑</button>
                  <button
                    onClick={() => index < sorted.length - 1 && reorderFabricTypes(index, index + 1)}
                    disabled={index === sorted.length - 1}
                    className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                    title="Descendre"
                  >↓</button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingType(type); setShowModal(true); }}
                    className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 rounded-lg transition-colors font-bold"
                  >✏️ Modifier</button>
                  <button
                    onClick={() => setConfirmDelete(type.id)}
                    className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-lg transition-colors font-bold"
                  >🗑️</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <FabricTypeModal
          initial={editingType}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingType(null); }}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-white font-black">Supprimer cette catégorie ?</h3>
            <p className="text-slate-400 text-sm">Les produits liés ne seront pas supprimés, mais ils n'auront plus de catégorie.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700">Annuler</button>
              <button onClick={() => { deleteFabricType(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
