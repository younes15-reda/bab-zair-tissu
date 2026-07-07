import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const MOTIF_OPTIONS = ['kids-boy', 'kids-girl', 'adult'];
const MOTIF_LABELS = {
  'kids-boy': 'Enfantin-Garçon (أولادي)',
  'kids-girl': 'Enfantin-Fillette (بناتي)',
  'adult': 'Adulte (الكبار)',
};

// ─── Compression d'image automatique ─────────────────────────────────────────
// Redimensionne et compresse l'image côté client pour rester sous 200KB en Base64
const compressImage = (file, maxWidth = 800, quality = 0.72) => {
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

// ─── Modal ────────────────────────────────────────────────────────────────────
function FabricModal({ initial, fabricTypes, onSave, onClose, isSaving }) {
  const [form, setForm] = useState({
    nameAr: initial?.nameAr || '',
    nameFr: initial?.nameFr || '',
    category: initial?.category || (fabricTypes[0]?.id || ''),
    price: initial?.price || '',
    width: initial?.width || 2.4,
    stock: initial?.stock ?? 100,
    minOrder: initial?.minOrder || 0.5,
    motif: initial?.motif || 'plain',
    descriptionAr: initial?.descriptionAr || '',
    descriptionFr: initial?.descriptionFr || '',
    compositionAr: initial?.compositionAr || '',
    compositionFr: initial?.compositionFr || '',
    image: initial?.image || '',
    imageTexture: initial?.imageTexture || '',
    imageInspiration: initial?.imageInspiration || '',
    active: initial?.active !== false,
  });

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const isValid = form.nameAr && form.nameFr && form.category && form.price > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto py-8">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl space-y-5 my-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-lg">{initial ? 'Modifier le tissu' : 'Nouveau tissu'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Names */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Nom en arabe *</label>
            <input dir="rtl" value={form.nameAr} onChange={e => set('nameAr', e.target.value)} placeholder="اسم القماش" className="admin-input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Nom en français *</label>
            <input value={form.nameFr} onChange={e => set('nameFr', e.target.value)} placeholder="Nom du tissu" className="admin-input w-full" />
          </div>
        </div>

        {/* Category + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Catégorie *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="admin-input w-full">
              {fabricTypes.map(t => <option key={t.id} value={t.id}>{t.nameFr}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Prix/mètre (DA) *</label>
            <input type="number" min="0" value={form.price} onChange={e => set('price', parseFloat(e.target.value))} placeholder="350" className="admin-input w-full" />
          </div>
        </div>

        {/* Width + MinOrder */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Laize/Largeur (m)</label>
            <input type="number" min="0" step="0.1" value={form.width} onChange={e => set('width', parseFloat(e.target.value))} className="admin-input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Min commande (m)</label>
            <input type="number" min="0.5" step="0.5" value={form.minOrder} onChange={e => set('minOrder', parseFloat(e.target.value))} className="admin-input w-full" />
          </div>
        </div>

        {/* Motif / Public cible */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Public cible / Genre</label>
          <div className="flex flex-wrap gap-2">
            {MOTIF_OPTIONS.map(m => (
              <button key={m} type="button" onClick={() => set('motif', m)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                  form.motif === m ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}>{MOTIF_LABELS[m] || m}</button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 block">Images du produit (Liens locaux ou Upload direct)</label>
          {[
            { field: 'image', label: 'Image principale (rouleau) *' },
            { field: 'imageTexture', label: 'Image texture (gros plan)' },
            { field: 'imageInspiration', label: 'Image d\'inspiration (rendu lit)' },
          ].map(({ field, label }) => (
            <div key={field} className="space-y-1">
              <div className="flex gap-2 items-center">
                {/* Text input for URL or relative path */}
                <input
                  value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  placeholder={label}
                  className="admin-input flex-1 text-xs"
                />

                {/* File Upload Selector */}
                <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Sélectionner</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file);
                          set(field, compressed);
                        } catch {
                          // Fallback: lecture directe si Canvas échoue
                          const reader = new FileReader();
                          reader.onload = (ev) => set(field, ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  />
                </label>

                {/* Clear image button */}
                {form[field] && (
                  <button
                    type="button"
                    onClick={() => set(field, '')}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                    title="Vider l'image"
                  >
                    🗑️
                  </button>
                )}

                {/* Preview Thumbnail */}
                {form[field] && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                    <img src={form[field]} alt="Aperçu" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Description (AR)</label>
            <textarea dir="rtl" rows={3} value={form.descriptionAr} onChange={e => set('descriptionAr', e.target.value)} className="admin-input w-full resize-none text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Description (FR)</label>
            <textarea rows={3} value={form.descriptionFr} onChange={e => set('descriptionFr', e.target.value)} className="admin-input w-full resize-none text-xs" />
          </div>
        </div>

        {/* Composition */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Composition (AR)</label>
            <input dir="rtl" value={form.compositionAr} onChange={e => set('compositionAr', e.target.value)} placeholder="100% قطن" className="admin-input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Composition (FR)</label>
            <input value={form.compositionFr} onChange={e => set('compositionFr', e.target.value)} placeholder="100% Coton" className="admin-input w-full" />
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => set('active', !form.active)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-amber-500' : 'bg-slate-600'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm text-slate-300">{form.active ? 'Produit visible' : 'Produit masqué'}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} disabled={isSaving} className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors disabled:opacity-50">Annuler</button>
          <button onClick={() => { if (isValid) { onSave(form); } }}
            disabled={!isValid || isSaving}
            className="flex-grow py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>{initial ? 'Enregistrer' : 'Créer le tissu'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminFabrics() {
  const { fabricsData, fabricTypes, addFabric, updateFabric, deleteFabric } = useAdmin();
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFabric, setEditingFabric] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const filtered = fabricsData.filter(f => {
    const matchCat = filterCategory === 'all' || f.category === filterCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || f.nameFr?.toLowerCase().includes(q) || f.nameAr?.includes(q);
    return matchCat && matchSearch;
  });

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingFabric) {
        await updateFabric(editingFabric.id, formData);
      } else {
        await addFabric(formData);
      }
      setEditingFabric(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du tissu dans Firebase. Vérifiez la taille des photos.");
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryName = (catId) => {
    return fabricTypes.find(t => t.id === catId)?.nameFr || catId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Produits Tissu</h2>
          <p className="text-slate-400 text-sm">{fabricsData.length} produit(s)</p>
        </div>
        <button
          onClick={() => { setEditingFabric(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau tissu
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un tissu..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50">
          <option value="all">Toutes les catégories</option>
          {fabricTypes.map(t => <option key={t.id} value={t.id}>{t.nameFr}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-700/50">
              {['Image', 'Nom', 'Catégorie', 'Prix/m', 'Statut', 'Actions'].map(h => (
                <th key={h} className="pb-3 pr-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filtered.map(fabric => (
              <tr key={fabric.id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="py-3 pr-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                    {fabric.image ? (
                      <img src={fabric.image} alt="" className="w-full h-full object-cover" onError={e => e.target.parentElement.innerHTML='🧵'} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🧵</div>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-white font-bold line-clamp-1">{fabric.nameFr}</p>
                  <p className="text-slate-500 text-xs" dir="rtl">{fabric.nameAr}</p>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-lg font-medium">
                    {getCategoryName(fabric.category)}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-amber-400 font-black">{fabric.price} DA</span>
                </td>
                <td className="py-3 pr-4">
                  <button onClick={() => updateFabric(fabric.id, { active: !fabric.active })}
                    className={`relative w-9 h-5 rounded-full transition-colors ${fabric.active !== false ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${fabric.active !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingFabric(fabric); setShowModal(true); }}
                      className="text-xs px-2.5 py-1.5 bg-slate-700 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 rounded-lg transition-colors font-bold">
                      ✏️
                    </button>
                    <button onClick={() => setConfirmDelete(fabric.id)}
                      className="text-xs px-2.5 py-1.5 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-lg transition-colors font-bold">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-2">🧵</div>
            <p>Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <FabricModal
          initial={editingFabric}
          fabricTypes={fabricTypes}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingFabric(null); }}
          isSaving={isSaving}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">🗑️</div>
            <h3 className="text-white font-black">Supprimer ce tissu ?</h3>
            <p className="text-slate-400 text-sm">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700">Annuler</button>
              <button onClick={() => { deleteFabric(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-black">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
