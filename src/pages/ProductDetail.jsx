import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail({ fabric, setCurrentPage, setSelectedProduct }) {
  const { lang, t, addToCart, fabrics, categories } = useApp();
  const [length, setLength] = useState(1.0); // Default to 1.0 meter
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  
  // Gallery active image state
  const [activeImage, setActiveImage] = useState(fabric?.image);

  if (!fabric) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <button onClick={() => setCurrentPage('shop')} className="btn bg-primary-600 text-white px-6 py-2 rounded-xl">
          {t('backToShop')}
        </button>
      </div>
    );
  }

  const name = lang === 'ar' ? fabric.nameAr : fabric.nameFr;
  const desc = lang === 'ar' ? fabric.descriptionAr : fabric.descriptionFr;
  
  const composition = lang === 'ar' ? fabric.compositionAr : fabric.compositionFr;

  // Retrieve category info
  const catObj = categories.find(c => c.id === fabric.category);
  const categoryName = catObj ? (lang === 'ar' ? catObj.nameAr : catObj.nameFr) : fabric.category;

  // Related products of the same type (excluding current product)
  const relatedFabrics = fabrics
    .filter(f => f.category === fabric.category && f.id !== fabric.id)
    .slice(0, 4); // Limit to 4

  const handleLengthChange = (value) => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setLength('');
      return;
    }
    setLength(val);
    if (val < 0.5) {
      setErrorMsg(t('minOrderAlert'));
    } else {
      setErrorMsg('');
    }
  };

  const handleIncrement = (amount) => {
    const current = parseFloat(length) || 0;
    const next = parseFloat((current + amount).toFixed(2));
    if (next >= 0.5) {
      setLength(next);
      setErrorMsg('');
    }
  };

  const handleDecrement = (amount) => {
    const current = parseFloat(length) || 0;
    const next = parseFloat((current - amount).toFixed(2));
    if (next >= 0.5) {
      setLength(next);
      setErrorMsg('');
    } else {
      setErrorMsg(t('minOrderAlert'));
    }
  };

  const handleAddToCart = () => {
    const parsedLength = parseFloat(length);
    if (isNaN(parsedLength) || parsedLength < 0.5) {
      setErrorMsg(t('minOrderAlert'));
      return;
    }

    addToCart(fabric, parsedLength);
    setSuccessMsg(true);
    setErrorMsg('');
    
    // Auto reset success message after 3 seconds
    setTimeout(() => {
      setSuccessMsg(false);
    }, 3000);
  };

  const totalPrice = ((parseFloat(length) || 0) * fabric.price).toFixed(2);

  // Switch product when clicking a related fabric
  const handleSelectRelated = (relatedFabric) => {
    setSelectedProduct(relatedFabric);
    setActiveImage(relatedFabric.image);
    setLength(1.0);
    setErrorMsg('');
    setSuccessMsg(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back navigation */}
      <button
        onClick={() => setCurrentPage('shop')}
        className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors space-x-1.5 rtl:space-x-reverse"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={lang === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
        <span>{t('backToShop')}</span>
      </button>

      {/* Main product presentation */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Product Images & Gallery */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          
          {/* Main active image */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand-50 border border-sand-200 relative flex items-center justify-center shadow-inner">
            {activeImage ? (
              <img
                src={activeImage}
                alt={name}
                className="object-cover w-full h-full transition-all duration-300"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold opacity-80"
                style={{ backgroundColor: fabric.colorHex || '#cfa556' }}
              >
                {t('brandName')}
              </div>
            )}
            
            {/* Width Badge */}
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-sand-950/80 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md">
              {t('widthLabel')} {fabric.width}m
            </div>
          </div>
          
          {/* Main Gallery Thumbnails: Roll + Texture */}
          <div className="flex gap-3">
            {/* Primary Roll Thumbnail */}
            <button
              onClick={() => setActiveImage(fabric.image)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-sand-50 ${
                activeImage === fabric.image ? 'border-primary-600 scale-105 shadow-sm' : 'border-sand-200'
              }`}
            >
              <img 
                src={fabric.image} 
                alt={lang === 'ar' ? `رول قماش بالمتر - ${name}` : `Rouleau de tissu au mètre - ${name}`} 
                className="w-full h-full object-cover" 
              />
            </button>

            {/* Texture Thumbnail (Zoomed close up) */}
            {fabric.imageTexture && (
              <button
                onClick={() => setActiveImage(fabric.imageTexture)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-sand-50 flex flex-col relative ${
                  activeImage === fabric.imageTexture ? 'border-primary-600 scale-105 shadow-sm' : 'border-sand-200'
                }`}
              >
                <img 
                  src={fabric.imageTexture} 
                  alt={lang === 'ar' ? `تفاصيل قوام القماش - ${name}` : `Texture zoomée du tissu - ${name}`} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute bottom-0 inset-x-0 bg-primary-900/80 text-white text-[9px] py-0.5 font-bold text-center">
                  {lang === 'ar' ? 'عن قرب' : 'Texture'}
                </span>
              </button>
            )}

            {/* Inspiration bed sheet rendering Thumbnail */}
            {fabric.imageInspiration && (
              <button
                onClick={() => setActiveImage(fabric.imageInspiration)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-sand-50 flex flex-col relative ${
                  activeImage === fabric.imageInspiration ? 'border-primary-600 scale-105 shadow-sm' : 'border-sand-200'
                }`}
              >
                <img 
                  src={fabric.imageInspiration} 
                  alt={lang === 'ar' ? `شكل القماش مخيط على السرير - ${name}` : `Rendu inspirant après couture - ${name}`} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute bottom-0 inset-x-0 bg-gold-900/80 text-white text-[9px] py-0.5 font-bold text-center">
                  {lang === 'ar' ? 'على السرير' : 'Inspiration'}
                </span>
              </button>
            )}
          </div>
          
          {/* Dynamic Notice depending on selected image type */}
          {activeImage === fabric.imageInspiration && (
            <div className="p-3 bg-gold-50 border border-gold-200 rounded-xl text-xs text-gold-900 font-extrabold text-center flex items-center justify-center space-x-2 rtl:space-x-reverse animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-gold-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {lang === 'ar' 
                  ? '⚠️ صورة توضيحية للموديل بعد الخياطة. المنتج المباع هو القماش بالمتر فقط.' 
                  : '⚠️ Rendu indicatif après confection. Le produit vendu est uniquement le tissu au mètre.'}
              </span>
            </div>
          )}
          
          {activeImage !== fabric.imageInspiration && (
            <div className="p-3 bg-sand-50 rounded-xl text-xs text-sand-500 font-semibold text-center border border-sand-100 flex justify-center items-center space-x-2 rtl:space-x-reverse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {lang === 'ar' 
                  ? 'ملاحظة: قد تختلف الألوان قليلاً حسب إضاءة الشاشة. البيع مقصوص بالمتر.' 
                  : 'Note : Les nuances de couleur réelles peuvent légèrement varier selon les écrans.'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Order details and length selector */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category / Badge type de tissu */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-800 border border-gold-200">
                {categoryName}
              </span>
              <span className="text-xs text-sand-400 font-bold">
                {lang === 'ar' ? 'عرض اللفة (Laize):' : 'Laize :'} {fabric.width}m
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sand-950 font-cairo">
              {name}
            </h1>

            {/* Price section */}
            <div className="py-3 px-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
              <span className="text-sm font-bold text-sand-700">{t('unitPrice')} :</span>
              <span className="text-xl font-black text-primary-600">
                {fabric.price} <span className="text-sm font-bold text-sand-600">{t('pricePerMeter')}</span>
              </span>
            </div>

            {/* Specifications / Composition */}
            <div className="bg-sand-50 rounded-2xl p-4 border border-sand-200 space-y-2">
              <h3 className="text-xs font-bold text-sand-400 uppercase tracking-widest block">
                {lang === 'ar' ? 'مواصفات القماش وجودته' : 'Caractéristiques du tissu'}
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-sand-700">
                <div>
                  <span className="font-bold text-sand-500">{lang === 'ar' ? 'التركيبة:' : 'Composition :'}</span> {composition || (lang === 'ar' ? 'قطن عالي الجودة' : 'Coton de qualité')}
                </div>
                <div>
                  <span className="font-bold text-sand-500">{lang === 'ar' ? 'عرض القماش:' : 'Largeur (Laize) :'}</span> {fabric.width}m
                </div>
                <div>
                  <span className="font-bold text-sand-500">{lang === 'ar' ? 'نوع البيع:' : 'Type de coupe :'}</span> {lang === 'ar' ? 'متر طولي' : 'Au mètre linéaire'}
                </div>
                <div>
                  <span className="font-bold text-sand-500">{lang === 'ar' ? 'أقل طلب:' : 'Minimum :'}</span> 0.5 {t('meters')}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-sand-400 uppercase tracking-widest">
                {t('description')}
              </h3>
              <p className="text-sm text-sand-600 font-medium leading-relaxed">
                {desc}
              </p>
            </div>

          </div>

          {/* Length selection and Price calc */}
          <div className="space-y-5 pt-6 border-t border-sand-100">
            
            {/* Quantity Length Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-sand-800">
                  {t('quantityMeters')} ({t('meters')}) :
                </label>
                <span className="text-xs text-red-500 font-bold">
                  {errorMsg}
                </span>
              </div>
              
              {/* Selector layout */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => handleDecrement(0.5)}
                  className="w-12 h-12 bg-white border border-sand-300 rounded-xl flex items-center justify-center text-sand-700 hover:border-primary-500 hover:text-primary-600 font-black text-xl transition-all"
                >
                  -
                </button>
                <div className="relative flex-grow">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={length}
                    onChange={(e) => handleLengthChange(e.target.value)}
                    className="w-full h-12 border border-sand-300 rounded-xl text-center font-extrabold text-lg text-sand-950 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-xs text-sand-400 font-bold rtl:left-auto rtl:right-4">
                    {t('meters')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleIncrement(0.5)}
                  className="w-12 h-12 bg-white border border-sand-300 rounded-xl flex items-center justify-center text-sand-700 hover:border-primary-500 hover:text-primary-600 font-black text-xl transition-all"
                >
                  +
                </button>
              </div>

              {/* Increments shortcuts */}
              <div className="flex gap-2 justify-center pt-1">
                {[1, 2.5, 5, 10].map(shortcut => (
                  <button
                    key={shortcut}
                    type="button"
                    onClick={() => {
                      setLength(shortcut);
                      setErrorMsg('');
                    }}
                    className="px-3 py-1 text-[11px] font-extrabold rounded-lg bg-sand-100 hover:bg-primary-50 hover:text-primary-600 border border-sand-200 transition-colors"
                  >
                    {shortcut} {t('meters')}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Price Calculator Display */}
            <div className="flex items-center justify-between p-4 bg-sand-950 text-white rounded-2xl shadow-sm border border-sand-900">
              <span className="text-sm font-semibold text-sand-400">{t('priceTotal') || (lang === 'ar' ? 'السعر الإجمالي' : 'Total Estimé')} :</span>
              <span className="text-xl font-black text-gold-400">
                {totalPrice} <span className="text-xs font-bold text-white">DA</span>
              </span>
            </div>

            {/* Add to Cart button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={parseFloat(length) < 0.5 || isNaN(parseFloat(length))}
                className={`w-full py-4 text-center font-black rounded-xl transition-all duration-200 flex justify-center items-center space-x-2.5 rtl:space-x-reverse shadow-lg ${
                  parseFloat(length) >= 0.5 && !isNaN(parseFloat(length))
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/10 hover:shadow-primary-600/20'
                    : 'bg-sand-200 text-sand-400 cursor-not-allowed shadow-none'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>{t('addToCart')}</span>
              </button>
              
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold border border-emerald-100 transition-all duration-300 animate-pulse">
                  {lang === 'ar' ? '✅ تمت الإضافة إلى السلة بنجاح !' : '✅ Ajouté au panier avec succès !'}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Related Products Section ("أقمشة أخرى من نفس النوع") */}
      {relatedFabrics.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-sand-200">
          <div className="text-right rtl:text-right ltr:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sand-950 font-cairo">
              {lang === 'ar' ? 'أقمشة أخرى من نفس النوع' : 'Autres tissus du même type'}
            </h2>
            <p className="text-xs text-sand-500 font-bold mt-1">
              {lang === 'ar' ? 'تشكيلة أقمشة مشابهة متوفرة في المحل' : 'Découvrez d\'autres motifs de la même gamme'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedFabrics.map((related) => (
              <div key={related.id} className="relative">
                <ProductCard
                  fabric={related}
                  onSelect={handleSelectRelated}
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
