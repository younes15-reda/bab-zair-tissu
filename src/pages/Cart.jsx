import React from 'react';
import { useApp } from '../context/AppContext';

export default function Cart({ setCurrentPage, setSelectedProduct }) {
  const { cart, lang, t, updateCartItemLength, removeFromCart, categories } = useApp();

  const handleLengthChange = (fabricId, value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;
    updateCartItemLength(fabricId, val);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.fabric.price * item.length, 0).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="border-b border-sand-200 pb-5 mb-8 text-right rtl:text-right ltr:text-left">
        <h1 className="text-3xl font-extrabold text-sand-950 font-cairo">
          {t('cartTitle')}
        </h1>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart items list */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const name = lang === 'ar' ? item.fabric.nameAr : item.fabric.nameFr;
              const lineTotal = (item.fabric.price * item.length).toFixed(2);
              const catObj = categories.find(c => c.id === item.fabric.category);
              const categoryName = catObj ? (lang === 'ar' ? catObj.nameAr : catObj.nameFr) : item.fabric.category;

              return (
                <div
                  key={item.fabric.id}
                  className="bg-white rounded-2xl border border-sand-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-primary-300 transition-all duration-200"
                >
                  {/* Left part: Image & info */}
                  <div className="flex items-center space-x-4 rtl:space-x-reverse w-full sm:w-auto">
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden bg-sand-100 flex-shrink-0 cursor-pointer border border-sand-200"
                      onClick={() => handleProductSelect(item.fabric)}
                    >
                      {item.fabric.image ? (
                        <img src={item.fabric.image} alt={name} className="object-cover w-full h-full" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: item.fabric.colorHex || '#cfa556' }}
                        >
                          {t('brandName')}
                        </div>
                      )}
                    </div>
                    <div className="text-right rtl:text-right ltr:text-left">
                      <h3
                        className="font-bold text-sand-950 hover:text-primary-600 cursor-pointer font-cairo line-clamp-1"
                        onClick={() => handleProductSelect(item.fabric)}
                      >
                        {name}
                      </h3>
                      {/* Type de tissu badge */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gold-100 text-gold-800 border border-gold-200 mt-1 uppercase tracking-wider">
                        {categoryName}
                      </span>
                      <span className="text-xs text-sand-500 font-semibold block mt-1">
                        {t('unitPrice')}: <span className="font-bold text-sand-800">{item.fabric.price} DA</span> / {lang === 'ar' ? 'متر' : 'm'}
                      </span>
                    </div>
                  </div>

                  {/* Middle part: Quantity selector */}
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-xs text-sand-500 font-bold sm:hidden">{t('quantityMeters')}:</span>
                    <div className="flex items-center border border-sand-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => updateCartItemLength(item.fabric.id, item.length - 0.5)}
                        className="px-2.5 py-1.5 bg-sand-50 hover:bg-sand-100 text-sand-700 font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        value={item.length}
                        onChange={(e) => handleLengthChange(item.fabric.id, e.target.value)}
                        className="w-16 text-center text-sm font-extrabold text-sand-900 border-none outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => updateCartItemLength(item.fabric.id, item.length + 0.5)}
                        className="px-2.5 py-1.5 bg-sand-50 hover:bg-sand-100 text-sand-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-sand-600 font-extrabold">{t('meters')}</span>
                  </div>

                  {/* Right part: Price and remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-sand-100">
                    <div className="text-right rtl:text-right ltr:text-left">
                      <span className="text-xs text-sand-400 block font-semibold">{t('subtotal')}</span>
                      <span className="font-black text-primary-600 text-base">{lineTotal} DA</span>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.fabric.id)}
                      className="p-2 text-sand-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title={lang === 'ar' ? 'حذف' : 'Supprimer'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Cart Summary Sidebox */}
          <div className="lg:col-span-4 bg-white border border-sand-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-sand-950 border-b border-sand-100 pb-3 font-cairo text-right rtl:text-right ltr:text-left">
              {t('summaryTitle')}
            </h3>

            <div className="space-y-4 text-sm font-semibold">
              <div className="flex justify-between text-sand-600">
                <span>{lang === 'ar' ? 'عدد الأقمشة' : 'Nombre de tissus'} :</span>
                <span className="text-sand-900 font-extrabold">{cart.length}</span>
              </div>
              
              <div className="flex justify-between text-sand-600">
                <span>{lang === 'ar' ? 'إجمالي الأمتار' : 'Métrage total'} :</span>
                <span className="text-sand-900 font-extrabold">
                  {cart.reduce((sum, item) => sum + item.length, 0).toFixed(1)} {t('meters')}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-sand-950 pt-4 border-t border-sand-100">
                <span>{t('subtotal')} :</span>
                <span className="text-primary-600">{getSubtotal()} DA</span>
              </div>
            </div>

            {/* Note on Shipping */}
            <div className="p-3 bg-sand-50 border border-sand-100 rounded-xl text-xs text-sand-500 font-semibold text-center leading-relaxed">
              {lang === 'ar' 
                ? '⚠️ مصاريف الشحن تُحسب في الصفحة الموالية حسب الولاية وطريقة التسليم.' 
                : 'Les frais de livraison seront calculés à l\'étape suivante selon votre wilaya.'}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => setCurrentPage('checkout')}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-center rounded-xl shadow-lg shadow-primary-600/10 hover:shadow-primary-600/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t('checkout')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={lang === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-sand-200 rounded-3xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-5">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-sand-900 font-cairo mb-2">{t('cartEmpty')}</h2>
          <button
            onClick={() => setCurrentPage('shop')}
            className="mt-4 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-primary-600/10"
          >
            {t('backToShop')}
          </button>
        </div>
      )}

    </div>
  );
}
