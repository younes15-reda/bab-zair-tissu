import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Home({ setCurrentPage, setSelectedProduct, setShopFilter }) {
  const { t, lang, fabrics, categories, getAssetUrl, homepageSettings } = useApp();

  // Find 3 best fabrics for the home show-case
  const featuredFabrics = fabrics.slice(0, 3);

  const handleCategoryClick = (catId) => {
    setShopFilter(catId);
    setCurrentPage('shop');
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* ─── Hero Banner ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sand-100 via-[#faf3ec] to-sand-50 py-16 sm:py-24 border-b border-sand-200">
        {/* Subtle background textile texture blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-100/40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-100/40 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left/Right: Slogan */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start rtl:lg:justify-start">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700 border border-primary-200">
                  <svg className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {t('originBadge')}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gold-100 text-gold-800 border border-gold-200">
                  <svg className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0l2.5-9H20l1 9h-8z" />
                  </svg>
                  {t('deliveryBadge')}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-sand-950 font-cairo leading-tight">
                {t('heroTitle')}
              </h1>
              
              <p className="text-base sm:text-lg text-sand-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('heroSubtitle')}
              </p>

              {/* Action Buttons — Terracotta + outline */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start rtl:lg:justify-start pt-2">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {t('ctaShop')}
                </button>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="px-8 py-4 bg-white border border-sand-300 hover:border-primary-400 text-sand-800 hover:text-primary-600 font-extrabold text-base rounded-xl shadow-sm transition-all duration-200"
                >
                  {t('ctaContact')}
                </button>
              </div>

              {/* Photo strip — real store photos */}
              <div className="hidden lg:flex space-x-3 rtl:space-x-reverse pt-4">
                {[
                  '/photo_9_2026-07-03_20-52-45.jpg',
                  '/photo_21_2026-07-03_20-52-45.jpg',
                  '/photo_22_2026-07-03_20-52-45.jpg',
                ].map((src, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                    <img 
                      src={getAssetUrl(src)} 
                      alt={lang === 'ar' ? `قماش بالمتر معروض - صورة ${i + 1}` : `Tissu au mètre exposé - image ${i + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
                <div className="w-20 h-20 rounded-xl bg-primary-100 border-2 border-white shadow-md flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-extrabold text-primary-700 text-center leading-tight px-1">
                    {lang === 'ar' ? '+25\nقماش' : '+25\ntissus'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Visual — lié dynamiquement au produit vedette s'il existe */}
            {(() => {
              const featuredId = homepageSettings?.featuredProductId;
              const featuredProduct = featuredId ? fabrics.find(f => String(f.id) === String(featuredId)) : null;
              
              const heroImgSrc = featuredProduct?.image 
                ? featuredProduct.image 
                : (homepageSettings?.heroImage || '/photo_9_2026-07-03_20-52-45.jpg');

              const handleHeroClick = () => {
                if (featuredProduct) {
                  handleSelectProduct(featuredProduct);
                } else {
                  handleCategoryClick('drap-vietnam');
                }
              };

              return (
                <div className="lg:col-span-5 relative flex justify-center items-center">
                  <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-primary-100/50 blur-3xl -z-10"></div>
                  
                  <div 
                    onClick={handleHeroClick}
                    className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:rotate-1 transition-transform duration-500 cursor-pointer group"
                  >
                    <img
                      src={heroImgSrc.startsWith('data:') ? heroImgSrc : getAssetUrl(heroImgSrc)}
                      alt={featuredProduct ? (lang === 'ar' ? featuredProduct.nameAr : featuredProduct.nameFr) : (lang === 'ar' ? 'محل أقمشة وسكاي باب زير 2 تلمسان - واجهة الأقمشة' : 'Boutique Le Tissu Bab Zir 2 Tlemcen - Rouleaux de tissus')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Floating price card */}
                    <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-sand-100 flex justify-between items-center">
                      <div className="text-right rtl:text-right ltr:text-left min-w-0 flex-1">
                        <span className="block text-[10px] font-extrabold text-primary-600 uppercase tracking-wider">
                          {featuredProduct 
                            ? (lang === 'ar' ? 'المنتج المفضل حالياً' : 'Notre coup de cœur')
                            : (lang === 'ar' ? 'اقمشة وسكاي تلمسان' : 'Le Tissu · Tlemcen')}
                        </span>
                        <span className="text-sm font-bold text-sand-900 block truncate">
                          {featuredProduct 
                            ? (lang === 'ar' ? featuredProduct.nameAr : featuredProduct.nameFr)
                            : (lang === 'ar' ? 'دراوات فيتنام ابتداءً من 350دج/م' : 'Drap Vietnam dès 350DA/m')}
                        </span>
                        {featuredProduct && (
                          <span className="text-xs font-black text-primary-600 block mt-0.5">
                            {featuredProduct.pricePerMeter} DA/m
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHeroClick();
                        }}
                        className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shadow hover:bg-primary-700 transition-colors flex-shrink-0 ms-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </section>

      {/* ─── Reassurance Block ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-sand-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Item 1 */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse p-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0l2-4h3m-3.438-5H4m15.5 0H21m-2.5 0l-1.5-3.5h-3.5" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-sand-900 font-cairo">
                {lang === 'ar' ? 'توصيل إلى 58 ولاية' : 'Livraison vers 58 wilayas'}
              </h4>
              <p className="text-xs text-sand-500 mt-1">
                {lang === 'ar' ? 'توصيل سريع لباب المنزل أو للمكتب' : 'Livraison rapide à domicile ou au bureau'}
              </p>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse p-4 border-y md:border-y-0 md:border-x border-sand-100">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-sand-900 font-cairo">
                {lang === 'ar' ? '+9800 زبون راضٍ' : '+9800 clients satisfaits'}
              </h4>
              <p className="text-xs text-sand-500 mt-1">
                {lang === 'ar' ? 'ثقتكم هي سر نجاحنا واستمراريتنا' : 'Votre confiance est notre plus grand succès'}
              </p>
            </div>
          </div>
          {/* Item 3 */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse p-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-sand-900 font-cairo">
                {lang === 'ar' ? 'جودة مضمونة' : 'Qualité garantie'}
              </h4>
              <p className="text-xs text-sand-500 mt-1">
                {lang === 'ar' ? 'أقمشة وسكاي مختارة بعناية فائقة' : 'Tissus et skaï rigoureusement sélectionnés'}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ─── Categories Grid ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-sand-950 font-cairo">
            {lang === 'ar' ? 'تصفح حسب فئات الأقمشة' : 'Achetez par Catégorie de Tissu'}
          </h2>
          <p className="text-sm text-sand-500 font-medium max-w-lg mx-auto">
            {lang === 'ar' ? 'نوفر تشكيلة واسعة تناسب احتياجاتكم من الديكور، الفراش، والخياطة اليدوية.' : 'Trouvez le tissu idéal classé par usage spécifique.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group bg-white border border-sand-200 rounded-2xl p-4 text-center cursor-pointer hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center space-y-2.5"
            >
              {/* Icon — sage green */}
              <div className="w-11 h-11 rounded-xl bg-gold-50 group-hover:bg-gold-500 text-gold-600 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-sand-900 group-hover:text-primary-600 transition-colors font-cairo leading-tight">
                {lang === 'ar' ? cat.nameAr : cat.nameFr}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Fabrics ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 border-b border-sand-200 pb-4">
          <div className="text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-sand-950 font-cairo">
              {lang === 'ar' ? 'أحدث تشكيلة متوفرة بالمحل' : 'Sélection Vedette en Boutique'}
            </h2>
            <p className="text-sm text-sand-500 font-medium">
              {lang === 'ar' ? 'تشكيلة مختارة من الأقمشة الأكثر طلباً حالياً في تلمسان.' : 'Nos tissus les plus populaires vendus à la coupe.'}
            </p>
          </div>
          <button
            onClick={() => handleCategoryClick('all')}
            className="text-sm font-extrabold text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1.5 rtl:space-x-reverse"
          >
            <span>{lang === 'ar' ? 'عرض كل الأقمشة' : 'Découvrir tout le catalogue'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Produit vedette choisi par l'admin + autres produits */}
        {(() => {
          const featuredId = homepageSettings?.featuredProductId;
          const featuredProduct = featuredId ? fabrics.find(f => String(f.id) === String(featuredId)) : null;
          const otherProducts = featuredProduct
            ? fabrics.filter(f => String(f.id) !== String(featuredId)).slice(0, 3)
            : fabrics.slice(0, 3);
          const displayList = featuredProduct ? [featuredProduct, ...otherProducts] : otherProducts;
          return (
            <div className="space-y-4">
              {featuredProduct && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 text-gold-800 text-xs font-bold rounded-full border border-gold-200">
                    ⭐ {lang === 'ar' ? 'المنتج المميز' : 'Produit Vedette'}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayList.map((fabric, idx) => (
                  <div key={fabric.id} className={idx === 0 && featuredProduct ? 'relative' : ''}>
                    {idx === 0 && featuredProduct && (
                      <div className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    <ProductCard
                      fabric={fabric}
                      onSelect={handleSelectProduct}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ─── Gallery Strip (dynamique via admin) ───────────────────── */}
      {(() => {
        const defaultGallery = [
          '/photo_20_2026-07-03_20-52-45.jpg',
          '/photo_21_2026-07-03_20-52-45.jpg',
          '/photo_22_2026-07-03_20-52-45.jpg',
          '/photo_23_2026-07-03_20-52-45.jpg',
          '/photo_24_2026-07-03_20-52-45.jpg',
          '/photo_25_2026-07-03_20-52-45.jpg',
        ];
        const gallery = (homepageSettings?.galleryImages && homepageSettings.galleryImages.length > 0)
          ? homepageSettings.galleryImages
          : defaultGallery;
        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-sand-950 font-cairo text-center">
                {lang === 'ar' ? 'معرض صور المحل — تلمسان باب زير 2' : 'Galerie du Magasin — Tlemcen Bab Zir 2'}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-sand-200 shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleCategoryClick('all')}
                  >
                    <img 
                      src={src.startsWith('data:') ? src : getAssetUrl(src)} 
                      alt={lang === 'ar' ? `قماش بالمتر من متجر تلمسان - معرض صورة ${i + 1}` : `Tissu au mètre de notre magasin - galerie photo ${i + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ─── "Minimum 0.5m" selling pitch ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary-50 to-sand-100 rounded-3xl p-8 sm:p-12 border border-primary-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-right rtl:text-right ltr:text-left">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              {lang === 'ar' ? 'كيفية الطلب والقياس' : 'Comment ça marche ?'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-sand-950 font-cairo">
              {lang === 'ar' ? 'بيع مخصص بالمتر - قص دقيق حسب رغبتكم' : 'Votre tissu coupé au mètre près'}
            </h2>
            <p className="text-sm text-sand-600 font-medium leading-relaxed">
              {lang === 'ar' 
                ? 'جميع منتجاتنا تباع بالمتر الطولي مع توضيح العرض الخاص بكل لفة. يبدأ الطلب من نصف متر (0.5 متر) كحد أدنى. نقوم بقص القماش بعناية وتغليفه جيداً لضمان وصوله بحالة ممتازة إلى باب منزلك عبر ZR Express.' 
                : 'Choisissez la longueur exacte dont vous avez besoin avec un minimum de 0.5 mètre. La largeur de la bobine (laize) est indiquée sur chaque produit. Nous coupons votre commande avec précision et vous la livrons via ZR Express.'}
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-primary-100 shadow-sm shrink-0 w-full md:w-auto text-center">
            <span className="text-4xl font-extrabold text-primary-600 mb-1">0.5m</span>
            <span className="text-xs font-extrabold text-sand-800 uppercase tracking-wide">{lang === 'ar' ? 'الحد الأدنى للطلب' : 'Minimum par tissu'}</span>
            <span className="text-[10px] text-sand-400 mt-2 block">{lang === 'ar' ? 'متاح كسور مثل 1.5م، 2.5م' : 'Incréments de 0.5m acceptés'}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
