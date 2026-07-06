import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Shop({ setCurrentPage, setSelectedProduct, shopFilter, setShopFilter }) {
  const { t, lang, fabrics, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Secondary Filters State
  const [selectedMotif, setSelectedMotif] = useState('all');

  // Available motifs list based on user request: Enfentin-Garçon, Enfentin-fillette, Adult
  const motifsList = [
    { id: 'all', nameAr: 'كل الفئات العمرية / النقوش', nameFr: 'Tous publics / motifs' },
    { id: 'kids-boy', nameAr: 'أولادي (Enfantin-Garçon)', nameFr: 'Enfantin-Garçon' },
    { id: 'kids-girl', nameAr: 'بناتي (Enfantin-Fillette)', nameFr: 'Enfantin-Fillette' },
    { id: 'adult', nameAr: 'الكبار (Adulte)', nameFr: 'Adult' }
  ];

  // Filter fabrics based on category filter, search query and secondary filters
  const filteredFabrics = useMemo(() => {
    return fabrics.filter(fabric => {
      // Category filter check
      const matchesCategory = shopFilter === 'all' || fabric.category === shopFilter;

      // Search query check
      const name = (lang === 'ar' ? fabric.nameAr : fabric.nameFr).toLowerCase();
      const desc = (lang === 'ar' ? fabric.descriptionAr : fabric.descriptionFr).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || desc.includes(query) || fabric.category.includes(query);

      // Motif filter check
      const matchesMotif = selectedMotif === 'all' || fabric.motif === selectedMotif;

      return matchesCategory && matchesSearch && matchesMotif;
    });
  }, [shopFilter, searchQuery, selectedMotif, lang]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const resetAllFilters = () => {
    setShopFilter('all');
    setSearchQuery('');
    setSelectedMotif('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sand-950 font-cairo">
          {lang === 'ar' ? 'معرض الأقمشة والسكاي' : 'Boutique de Tissus au Mètre'}
        </h1>
        <p className="text-sm text-sand-500 font-medium max-w-xl mx-auto">
          {lang === 'ar' 
            ? 'تصفح تشكيلتنا الممتازة من الأقمشة، اختر الطول المناسب لك وسنقوم بقصه وتوصيله إليك.' 
            : 'Faites votre choix parmi nos différentes matières. Achetez la longueur exacte requise.'}
        </p>
      </div>

      {/* Main Filter Section */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-6">
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto ltr:pl-4">
            <svg className="h-5 w-5 text-sand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pr-12 pl-4 py-3.5 rtl:pr-12 rtl:pl-4 ltr:pl-12 ltr:pr-4 rounded-2xl border border-sand-300 bg-white text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm font-semibold transition-all"
          />
        </div>

        {/* Category List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-sand-400 uppercase tracking-widest block border-b border-sand-100 pb-1">
            {lang === 'ar' ? 'فئات التنشيط الرئيسية' : 'Catégories Principales'}
          </span>
          <div className="flex flex-wrap gap-2 pt-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setShopFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                shopFilter === 'all'
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-sand-50 text-sand-700 border-sand-200 hover:border-sand-300'
              }`}
            >
              {t('allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setShopFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  shopFilter === cat.id
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-sand-50 text-sand-700 border-sand-200 hover:border-sand-300'
                }`}
              >
                {lang === 'ar' ? cat.nameAr : cat.nameFr}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters Section */}
        <div className="pt-4 border-t border-sand-100">
          
          {/* Filter by Motif / Public cible */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-sand-400 uppercase tracking-widest block">
              {lang === 'ar' ? 'الفئة المستهدفة' : 'Public cible / Genre'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {motifsList.map((motif) => (
                <button
                  key={motif.id}
                  onClick={() => setSelectedMotif(motif.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedMotif === motif.id
                      ? 'bg-gold-600 text-white border-gold-600 shadow-sm'
                      : 'bg-white text-sand-600 border-sand-200 hover:border-sand-300'
                  }`}
                >
                  {lang === 'ar' ? motif.nameAr : motif.nameFr}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Clear Filters Indicator */}
        {(selectedMotif !== 'all' || searchQuery !== '') && (
          <div className="flex justify-between items-center pt-2 border-t border-sand-100 text-xs">
            <span className="text-sand-500 font-bold">
              {lang === 'ar' 
                ? `وجدت ${filteredFabrics.length} أقمشة تطابق الفلاتر` 
                : `${filteredFabrics.length} tissus trouvés`}
            </span>
            <button
              onClick={resetAllFilters}
              className="text-primary-600 hover:text-primary-700 font-extrabold underline flex items-center space-x-1 rtl:space-x-reverse"
            >
              <span>{lang === 'ar' ? 'إعادة تعيين الفلاتر' : 'Réinitialiser les filtres'}</span>
            </button>
          </div>
        )}

      </div>

      {/* Products Grid */}
      {filteredFabrics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFabrics.map((fabric) => (
            <ProductCard
              key={fabric.id}
              fabric={fabric}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-sand-200 p-8 max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-sand-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sand-600 font-bold text-base font-cairo">
            {t('noProducts')}
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-4 px-4.5 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 text-xs font-bold rounded-lg transition-colors"
          >
            {lang === 'ar' ? 'عرض كل الأقمشة' : 'Voir tout le catalogue'}
          </button>
        </div>
      )}

    </div>
  );
}
