import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { wilayas } from '../data/wilayas';

export default function Checkout({ setCurrentPage }) {
  const { cart, lang, t, clearCart, saveOrder } = useApp();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedWilayaId, setSelectedWilayaId] = useState('');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState('desk'); // 'desk' or 'home'

  // Errors and loader
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedWhatsAppLink, setGeneratedWhatsAppLink] = useState('');

  // Enforce redirection if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      setCurrentPage('cart');
    }
  }, [cart, isSuccess]);

  // Find the selected wilaya object
  const selectedWilayaObj = wilayas.find(w => w.id === parseInt(selectedWilayaId));

  // Calculate fees
  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.fabric.price * item.length, 0);
  };

  const getShippingFee = () => {
    if (!selectedWilayaObj) return 0;
    return deliveryType === 'home' ? selectedWilayaObj.homeFee : selectedWilayaObj.deskFee;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingFee();
  };

  // Form Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!fullName.trim()) tempErrors.fullName = lang === 'ar' ? 'الاسم الكامل مطلوب' : 'Nom complet requis';
    
    // Algerian phone check (starts with 05, 06, 07, 09 or +213, 02 for local, length between 9 and 10 digits)
    const phoneRegex = /^(05|06|07|09|02|\+213)[0-9]{8,9}$/;
    if (!phone.trim()) {
      tempErrors.phone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Téléphone requis';
    } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      tempErrors.phone = lang === 'ar' ? 'رقم الهاتف غير صالح (مثال: 0550123456)' : 'Téléphone invalide (Ex: 0550123456)';
    }

    if (!selectedWilayaId) tempErrors.wilaya = lang === 'ar' ? 'يرجى اختيار الولاية' : 'Veuillez choisir la wilaya';
    if (!commune.trim()) tempErrors.commune = lang === 'ar' ? 'البلدية مطلوبة' : 'Commune requise';
    if (deliveryType === 'home' && !address.trim()) {
      tempErrors.address = lang === 'ar' ? 'عنوان التوصيل مطلوب للتسليم المنزلي' : 'Adresse requise pour la livraison à domicile';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit and redirect to WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Build the WhatsApp message
    const sellerWhatsAppNumber = "213554283264"; 
    const wilayaName = selectedWilayaObj
      ? (lang === 'ar'
        ? `${selectedWilayaObj.id}. ${selectedWilayaObj.nameAr}`
        : `${selectedWilayaObj.id}. ${selectedWilayaObj.nameFr}`)
      : '';
    const deliveryMethodName = deliveryType === 'home' ? t('homeDelivery') : t('deskDelivery');

    let message = '';
    if (lang === 'ar') {
      message += `🛒 *طلب جديد من الموقع* 🛒\n\n`;
      message += `👤 *معلومات الزبون:*\n`;
      message += `• الاسم: ${fullName}\n`;
      message += `• الهاتف: ${phone}\n`;
      message += `• الولاية: ${wilayaName}\n`;
      message += `• البلدية: ${commune}\n`;
      if (deliveryType === 'home') {
        message += `• العنوان: ${address}\n`;
      }
      message += `• نوع التوصيل: ${deliveryMethodName}\n\n`;
      
      message += `📦 *تفاصيل المنتجات:*\n`;
      cart.forEach((item, index) => {
        const pName = item.fabric.nameAr;
        message += `${index + 1}. ${pName} | الطول: *${item.length}م* | السعر للمتر: ${item.fabric.price}دج | المجموع: *${(item.fabric.price * item.length).toFixed(0)}دج*\n`;
      });
      message += `\n💵 *الفاتورة:*\n`;
      message += `• السعر الإجمالي للأقمشة: ${getSubtotal().toFixed(0)} دج\n`;
      message += `• مصاريف شحن ZR Express: ${getShippingFee()} دج\n`;
      message += `• *المبلغ الإجمالي للدفع عند الاستلام:* *${getTotal().toFixed(0)} دج*\n\n`;
      message += `يرجى تأكيد الطلبية وقص الأقمشة بالقياسات المذكورة أعلاه. شكراً لك!`;
    } else {
      message += `🛒 *Nouvelle Commande - Le Tissu* 🛒\n\n`;
      message += `👤 *Détails du Client :*\n`;
      message += `• Nom Complet : ${fullName}\n`;
      message += `• Téléphone : ${phone}\n`;
      message += `• Wilaya : ${wilayaName}\n`;
      message += `• Commune : ${commune}\n`;
      if (deliveryType === 'home') {
        message += `• Adresse : ${address}\n`;
      }
      message += `• Livraison : ${deliveryMethodName}\n\n`;
      
      message += `📦 *Détails des Tissus (au mètre) :*\n`;
      cart.forEach((item, index) => {
        const pName = item.fabric.nameFr;
        message += `${index + 1}. ${pName} | Longueur : *${item.length}m* | Prix/m : ${item.fabric.price}DA | Ligne : *${(item.fabric.price * item.length).toFixed(0)}DA*\n`;
      });
      message += `\n💵 *Récapitulatif financier :*\n`;
      message += `• Sous-total : ${getSubtotal().toFixed(0)} DA\n`;
      message += `• Frais d'expédition (ZR Express) : ${getShippingFee()} DA\n`;
      message += `• *TOTAL À PAYER À LA LIVRAISON :* *${getTotal().toFixed(0)} DA*\n\n`;
      message += `Merci de confirmer ma commande et de préparer la coupe des tissus.`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${sellerWhatsAppNumber}?text=${encodedMessage}`;

    // Simulate order placement, clear cart and redirect
    setTimeout(() => {
      // ── Save order to localStorage for admin dashboard ──
      const order = {
        id: `CMD-${Date.now()}`,
        date: new Date().toISOString(),
        client: {
          fullName,
          phone,
          wilaya: selectedWilayaObj,
          commune,
          address,
        },
        items: cart.map(item => ({ ...item })),
        subtotal: getSubtotal(),
        shippingFee: getShippingFee(),
        total: getTotal(),
        deliveryType,
        status: 'en_attente',
      };
      saveOrder(order);

      setLoading(false);
      setIsSuccess(true);
      setGeneratedWhatsAppLink(whatsappUrl);
      clearCart();
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <svg className="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-sand-950 font-cairo">
          {t('orderSuccessTitle')}
        </h1>
        <p className="text-sm text-sand-600 font-medium leading-relaxed max-w-md mx-auto">
          {t('orderSuccessText')}
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={generatedWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.03-5.115-2.906-6.99C16.549 1.876 14.077.844 11.44.844c-5.441 0-9.866 4.422-9.87 9.866-.001 1.702.46 3.361 1.336 4.815l-.993 3.63 3.713-.974zm11.004-6.837c-.305-.153-1.805-.89-2.083-.99-.278-.102-.48-.153-.68.152-.2.304-.775.99-.95 1.19-.175.203-.35.228-.655.076-.305-.153-1.287-.475-2.45-1.514-.906-.809-1.517-1.809-1.695-2.114-.177-.305-.019-.47.133-.621.137-.136.305-.355.457-.533.153-.178.203-.304.305-.507.102-.203.05-.38-.026-.533-.075-.153-.68-1.639-.93-2.247-.244-.588-.492-.51-.68-.52-.176-.009-.379-.01-.582-.01-.202 0-.531.076-.81.38-.28.304-1.062 1.039-1.062 2.535s1.088 2.944 1.24 3.147c.152.203 2.14 3.267 5.185 4.577.724.312 1.29.499 1.732.639.728.231 1.39.198 1.914.12.584-.087 1.805-.737 2.058-1.45.253-.713.253-1.32.177-1.447-.076-.127-.278-.203-.583-.356z"/>
            </svg>
            <span>{t('whatsappBtn')}</span>
          </a>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-8 py-4 bg-white border border-sand-300 hover:border-primary-400 text-sand-800 hover:text-primary-600 font-extrabold text-sm rounded-xl transition-all"
          >
            {t('backToShop')}
          </button>
        </div>

        {/* ZR Express Tracking Block */}
        <div className="mt-8 mx-auto max-w-sm w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span className="text-sm font-extrabold text-amber-800">
              {lang === 'ar' ? 'تتبع طرد ZR Express' : 'Suivi colis ZR Express'}
            </span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            {lang === 'ar'
              ? 'بمجرد شحن طلبك، ستتلقى رقم التتبع. يمكنك تتبع طردك مباشرة من الموقع الرسمي.'
              : 'Une fois votre commande expédiée, vous recevrez un numéro de suivi. Suivez votre colis directement sur le site officiel.'}
          </p>
          <a
            href="https://zrexpress.app/suivi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl transition-colors shadow-sm shadow-amber-400/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {lang === 'ar' ? 'تتبع الطرد' : 'Suivre mon colis'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="border-b border-sand-200 pb-5 mb-8 text-right rtl:text-right ltr:text-left">
        <h1 className="text-3xl font-extrabold text-sand-950 font-cairo">
          {t('checkout')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white border border-sand-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-sand-950 border-b border-sand-100 pb-3 font-cairo text-right rtl:text-right ltr:text-left">
            {lang === 'ar' ? '1. معلومات الشحن والتوصيل' : '1. Informations de Livraison'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-right rtl:text-right ltr:text-left">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-sand-700">{t('fullNameLabel')}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
                className={`w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.fullName ? 'border-red-500' : 'border-sand-300'
                }`}
              />
              {errors.fullName && <span className="text-[10px] text-red-500 font-bold">{errors.fullName}</span>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-sand-700">{t('phoneLabel')}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className={`w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.phone ? 'border-red-500' : 'border-sand-300'
                }`}
              />
              {errors.phone && <span className="text-[10px] text-red-500 font-bold">{errors.phone}</span>}
            </div>

            {/* Wilaya / Commune Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-sand-700">{t('wilayaLabel')}</label>
              <select
                value={selectedWilayaId}
                onChange={(e) => {
                  setSelectedWilayaId(e.target.value);
                  setErrors({ ...errors, wilaya: '' });
                }}
                className={`w-full px-4 py-3 text-sm font-semibold border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.wilaya ? 'border-red-500' : 'border-sand-300'
                }`}
              >
                <option value="">{t('selectWilaya')}</option>
                {wilayas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.id}. {lang === 'ar' ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
              {errors.wilaya && <span className="text-[10px] text-red-500 font-bold">{errors.wilaya}</span>}
            </div>

            {/* Commune */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-sand-700">{t('communeLabel')}</label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder={t('communePlaceholder')}
                className={`w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.commune ? 'border-red-500' : 'border-sand-300'
                }`}
              />
              {errors.commune && <span className="text-[10px] text-red-500 font-bold">{errors.commune}</span>}
            </div>
          </div>

          {/* Delivery Type Selection */}
          <div className="space-y-3 pt-3 text-right rtl:text-right ltr:text-left">
            {/* ZR Express Branding Banner */}
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-sand-700 block">{t('deliveryType')}</label>
              <a
                href="https://zrexpress.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12l1-12M10 12h4" />
                </svg>
                ZR Express
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Stop Desk option */}
              <label
                className={`p-4 rounded-xl border flex items-start space-x-3 rtl:space-x-reverse cursor-pointer transition-all ${
                  deliveryType === 'desk'
                    ? 'border-primary-500 bg-primary-50/20 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-primary-200'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value="desk"
                  checked={deliveryType === 'desk'}
                  onChange={() => setDeliveryType('desk')}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="text-right rtl:text-right ltr:text-left">
                  <span className="block text-xs font-bold text-sand-900">{t('deskDelivery')}</span>
                  <span className="block text-[11px] text-sand-500 mt-0.5">
                    {lang === 'ar' ? 'سعر مخفض، الاستلام من مكتب ZR Express القريب منك' : 'Tarif réduit, retrait dans l\'agence ZR Express.'}
                  </span>
                  {selectedWilayaObj && (
                    <span className="inline-block mt-2 text-xs font-extrabold text-primary-600 bg-white border border-primary-200 px-2.5 py-0.5 rounded-md">
                      +{selectedWilayaObj.deskFee} DA
                    </span>
                  )}
                </div>
              </label>

              {/* Home delivery option */}
              <label
                className={`p-4 rounded-xl border flex items-start space-x-3 rtl:space-x-reverse cursor-pointer transition-all ${
                  deliveryType === 'home'
                    ? 'border-primary-500 bg-primary-50/20 shadow-sm'
                    : 'border-sand-200 bg-white hover:border-primary-200'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value="home"
                  checked={deliveryType === 'home'}
                  onChange={() => setDeliveryType('home')}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="text-right rtl:text-right ltr:text-left">
                  <span className="block text-xs font-bold text-sand-900">{t('homeDelivery')}</span>
                  <span className="block text-[11px] text-sand-500 mt-0.5">
                    {lang === 'ar' ? 'التسليم مباشرة إلى باب منزلك أو عنوان عملك' : 'Livraison directe à votre domicile ou lieu de travail.'}
                  </span>
                  {selectedWilayaObj && (
                    <span className="inline-block mt-2 text-xs font-extrabold text-primary-600 bg-white border border-primary-200 px-2.5 py-0.5 rounded-md">
                      +{selectedWilayaObj.homeFee} DA
                    </span>
                  )}
                </div>
              </label>

            </div>
          </div>

          {/* Detailed Address */}
          {deliveryType === 'home' && (
            <div className="space-y-1.5 text-right rtl:text-right ltr:text-left">
              <label className="text-xs font-bold text-sand-700">{t('addressLabel')}</label>
              <textarea
                rows="2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('addressPlaceholder')}
                className={`w-full px-4 py-3 text-sm font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.address ? 'border-red-500' : 'border-sand-300'
                }`}
              ></textarea>
              {errors.address && <span className="text-[10px] text-red-500 font-bold">{errors.address}</span>}
            </div>
          )}

          {/* Payment Method Info */}
          <div className="pt-4 border-t border-sand-100 space-y-3 text-right rtl:text-right ltr:text-left">
            <h4 className="text-sm font-bold text-sand-800">{t('paymentMethod')}</h4>
            <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-center space-x-3 rtl:space-x-reverse text-primary-800 text-xs">
              <svg className="w-5 h-5 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-extrabold">{t('codNotice')}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-center rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2.5 rtl:space-x-reverse"
          >
            {loading ? (
              <span className="flex items-center space-x-2 rtl:space-x-reverse">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{t('whatsappRedirecting')}</span>
              </span>
            ) : (
              <>
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.03-5.115-2.906-6.99C16.549 1.876 14.077.844 11.44.844c-5.441 0-9.866 4.422-9.87 9.866-.001 1.702.46 3.361 1.336 4.815l-.993 3.63 3.713-.974zm11.004-6.837c-.305-.153-1.805-.89-2.083-.99-.278-.102-.48-.153-.68.152-.2.304-.775.99-.95 1.19-.175.203-.35.228-.655.076-.305-.153-1.287-.475-2.45-1.514-.906-.809-1.517-1.809-1.695-2.114-.177-.305-.019-.47.133-.621.137-.136.305-.355.457-.533.153-.178.203-.304.305-.507.102-.203.05-.38-.026-.533-.075-.153-.68-1.639-.93-2.247-.244-.588-.492-.51-.68-.52-.176-.009-.379-.01-.582-.01-.202 0-.531.076-.81.38-.28.304-1.062 1.039-1.062 2.535s1.088 2.944 1.24 3.147c.152.203 2.14 3.267 5.185 4.577.724.312 1.29.499 1.732.639.728.231 1.39.198 1.914.12.584-.087 1.805-.737 2.058-1.45.253-.713.253-1.32.177-1.447-.076-.127-.278-.203-.583-.356z"/>
                </svg>
                <span>{t('placeOrder')}</span>
              </>
            )}
          </button>
        </form>

        {/* Right column: Order Summary Panel */}
        <div className="lg:col-span-4 bg-white border border-sand-200 rounded-3xl p-6 shadow-sm space-y-6 text-right rtl:text-right ltr:text-left">
          <h3 className="text-lg font-bold text-sand-950 border-b border-sand-100 pb-3 font-cairo">
            {t('summaryTitle')}
          </h3>

          {/* List of checkout items */}
          <div className="divide-y divide-sand-100 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => {
              const name = lang === 'ar' ? item.fabric.nameAr : item.fabric.nameFr;
              return (
                <div key={item.fabric.id} className="py-3 flex justify-between items-center text-xs font-semibold">
                  <div className="text-right rtl:text-right ltr:text-left">
                    <span className="block text-sand-900 font-bold line-clamp-1">{name}</span>
                    <span className="text-sand-400 font-medium">
                      {item.length} {t('meters')} × {item.fabric.price} DA
                    </span>
                  </div>
                  <span className="text-sand-800 font-extrabold whitespace-nowrap">
                    {(item.fabric.price * item.length).toFixed(0)} DA
                  </span>
                </div>
              );
            })}
          </div>

          {/* Financial summary calculations */}
          <div className="pt-4 border-t border-sand-100 space-y-3.5 text-sm font-semibold">
            
            {/* Subtotal */}
            <div className="flex justify-between text-sand-600">
              <span>{lang === 'ar' ? 'إجمالي المنتجات' : 'Sous-total tissus'} :</span>
              <span className="text-sand-900 font-extrabold">{getSubtotal().toFixed(0)} DA</span>
            </div>

            {/* Shipping fee */}
            <div className="flex justify-between text-sand-600">
              <span>{t('shippingFee')} :</span>
              <span className="text-sand-900 font-extrabold">
                {selectedWilayaId ? `${getShippingFee()} DA` : (lang === 'ar' ? 'حدد الولاية' : 'Sélectionnez la wilaya')}
              </span>
            </div>

            {/* Final total */}
            <div className="flex justify-between text-base font-black text-sand-950 pt-4 border-t border-sand-100">
              <span>{t('totalToPay')} :</span>
              <span className="text-primary-600 text-lg">{getTotal().toFixed(0)} DA</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
