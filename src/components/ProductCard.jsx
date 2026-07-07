import React from 'react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ fabric, onSelect }) {
  const { lang, t, categories, getAssetUrl } = useApp();

  const name = lang === 'ar' ? fabric.nameAr : fabric.nameFr;
  const desc = lang === 'ar' ? fabric.descriptionAr : fabric.descriptionFr;

  // Retrieve localized category name
  const catObj = categories.find(c => c.id === fabric.category);
  const categoryName = catObj ? (lang === 'ar' ? catObj.nameAr : catObj.nameFr) : fabric.category;

  return (
    <div
      onClick={() => onSelect(fabric)}
      className="group bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-xl hover:border-primary-300 transition-all duration-300 flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
    >
      
      {/* Product Image / Color block fallback */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100 flex items-center justify-center">
        {fabric.image ? (
          <img
            src={getAssetUrl(fabric.image)}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold opacity-80"
            style={{ backgroundColor: fabric.color || '#c56e4e' }}
          >
            {t('brandName')}
          </div>
        )}
        
        {/* Price Tag Badge — Terracotta accent */}
        <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 bg-primary-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md border border-primary-500">
          <span className="text-white font-extrabold text-sm">{fabric.price}</span> {t('pricePerMeter')}
        </div>

        {/* Width / Laize Badge — Sage green */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-gold-600/90 text-white px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm">
          {t('widthLabel')} {fabric.width}m
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Type de tissu badge (visible, styled pill) */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold-100 text-gold-800 border border-gold-200 tracking-wider">
            {categoryName}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-sand-950 group-hover:text-primary-600 transition-colors line-clamp-1 mb-2 font-cairo">
          {name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-sand-500 font-medium line-clamp-2 leading-relaxed mb-4 flex-grow">
          {desc}
        </p>

        {/* Action Button */}
        <div className="pt-2 border-t border-sand-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-sand-400">
            {lang === 'ar' ? 'أقل كمية: 0.5م' : 'Min. 0.5m'}
          </span>
          <span className="text-xs font-extrabold text-primary-600 group-hover:text-primary-700 transition-colors flex items-center space-x-1 rtl:space-x-reverse">
            <span>{lang === 'ar' ? 'عرض التفاصيل' : 'Détails'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={lang === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </span>
        </div>
      </div>

    </div>
  );
}
