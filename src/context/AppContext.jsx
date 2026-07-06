import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const AppContext = createContext();

const translations = {
  ar: {
    brandName: "اقمشة وسكاي باب زير 2",
    brandSubtitle: "البيع بالتجزئة والجملة لأجود أنواع الأقمشة والجلد (السكاي) بالمتر",
    home: "الرئيسية",
    shop: "Boutique / المتجر",
    contact: "اتصل بنا",
    cart: "السلة",
    checkout: "إتمام الطلب",
    deliveryBadge: "توصيل متوفر لـ 58 ولاية",
    originBadge: "مقرنا تلمسان، باب زير",
    heroTitle: "أقمشة راقية بالمتر لجميع مناسباتكم",
    heroSubtitle: "نوفر لكم تشكيلة واسعة من أقمشة الأسرة (دراوات فيتنام)، السكاي، وأقمشة الصالونات والستائر بأفضل الأسعار.",
    ctaShop: "تصفح الأقمشة",
    ctaContact: "تواصل معنا",
    searchPlaceholder: "ابحث عن قماش (مثال: فيتنام، سكاي...)",
    allCategories: "كل الفئات",
    pricePerMeter: "دج / المتر",
    minOrderAlert: "الحد الأدنى للطلب هو 0.5 متر",
    addToCart: "أضف إلى السلة",
    widthLabel: "العرض:",
    meters: "متر",
    description: "الوصف",
    noProducts: "لا توجد أقمشة تطابق هذا البحث.",
    cartTitle: "سلة التسوق الخاصة بك",
    cartEmpty: "سلتك فارغة حالياً. تصفح متجرنا لاختيار الأقمشة!",
    backToShop: "العودة للمتجر",
    unitPrice: "سعر المتر",
    quantityMeters: "الطول المطلوب",
    subtotal: "المجموع الفرعي",
    deliveryType: "طريقة التوصيل",
    homeDelivery: "توصيل إلى باب المنزل",
    deskDelivery: "استلام من مكتب ZR Express (Stop Desk)",
    selectWilaya: "اختر ولايتك (58 ولاية)",
    wilayaLabel: "الولاية",
    communeLabel: "البلدية",
    communePlaceholder: "اسم البلدية",
    addressLabel: "عنوان التوصيل التفصيلي",
    addressPlaceholder: "الشارع، رقم المنزل، إلخ.",
    fullNameLabel: "الاسم واللقب الكامل",
    fullNamePlaceholder: "الاسم واللقب",
    phoneLabel: "رقم الهاتف",
    phonePlaceholder: "مثال: 0550123456",
    summaryTitle: "ملخص الطلب",
    shippingFee: "مصاريف التوصيل",
    free: "مجاني",
    totalToPay: "المبلغ الإجمالي للدفع",
    paymentMethod: "طريقة الدفع",
    codNotice: "الدفع نقداً عند الاستلام (COD) فقط",
    placeOrder: "تأكيد الطلب عبر واتساب",
    whatsappRedirecting: "جاري تحضير الطلب وتوجيهك لواتساب للتأكيد...",
    contactTitle: "اتصل بنا / أين تجدنا",
    contactSubtitle: "يسعدنا استقبالكم في متجرنا بتلمسان أو الإجابة على استفساراتكم عبر الهاتف ومواقع التواصل.",
    address: "العنوان",
    addressValue: "نهج قوار حسين، باب زير 2، تلمسان (Algeria)",
    workHours: "أوقات العمل",
    workHoursValue: "كل يوم من 9:00 صباحاً إلى 18:00 مساءً",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    socialMedia: "تابعونا على مواقع التواصل",
    contactFormTitle: "أرسل لنا رسالة",
    nameInput: "الاسم الكامل",
    emailInput: "البريد الإلكتروني (اختياري)",
    messageInput: "نص الرسالة أو الاستفسار عن قماش معين",
    submitForm: "إرسال الرسالة",
    formSuccess: "تم إرسال رسالتك بنجاح! سنتصل بك في أقرب وقت.",
    footerText: "جميع الحقوق محفوظة. اقمشة وسكاي باب زير 2 - تلمسان.",
    orderSuccessTitle: "تم تسجيل طلبك بنجاح!",
    orderSuccessText: "سنقوم الآن بتوجيهك إلى WhatsApp لإرسال تفاصيل طلبك وتأكيد العنوان وقياسات الأقمشة مباشرة مع البائع.",
    whatsappBtn: "إرسال التفاصيل عبر WhatsApp الآن"
  },
  fr: {
    brandName: "Le Tissu Bab Zir 2",
    brandSubtitle: "Vente en détail et en gros de tissus et simili-cuir (Skay) au mètre",
    home: "Accueil",
    shop: "Boutique",
    contact: "Contact",
    cart: "Panier",
    checkout: "Caisse",
    deliveryBadge: "Livraison disponible vers 58 wilayas",
    originBadge: "Basé à Tlemcen, Bab Zir",
    heroTitle: "Des tissus premium au mètre pour toutes vos créations",
    heroSubtitle: "Découvrez notre large gamme de tissus pour draps (Drap Vietnam), de simili-cuir (Skay), de tissus d'ameublement et de rideaux aux meilleurs tarifs.",
    ctaShop: "Voir le catalogue",
    ctaContact: "Contactez-nous",
    searchPlaceholder: "Rechercher un tissu (ex: Vietnam, skay...)",
    allCategories: "Toutes les catégories",
    pricePerMeter: "DA / Mètre",
    minOrderAlert: "Le minimum de commande est de 0.5 mètre",
    addToCart: "Ajouter au panier",
    widthLabel: "Laize (Largeur):",
    meters: "mètres",
    description: "Description",
    noProducts: "Aucun tissu ne correspond à votre recherche.",
    cartTitle: "Votre Panier de Commande",
    cartEmpty: "Votre panier est vide actuellement. Visitez la boutique pour choisir vos tissus !",
    backToShop: "Retour à la boutique",
    unitPrice: "Prix/m",
    quantityMeters: "Longueur requise",
    subtotal: "Sous-total",
    deliveryType: "Mode de livraison",
    homeDelivery: "Livraison à domicile",
    deskDelivery: "Retrait au bureau ZR Express (Stop Desk)",
    selectWilaya: "Sélectionnez votre wilaya (58 wilayas)",
    wilayaLabel: "Wilaya",
    communeLabel: "Commune",
    communePlaceholder: "Nom de la commune",
    addressLabel: "Adresse de livraison détaillée",
    addressPlaceholder: "Rue, numéro de maison, etc.",
    fullNameLabel: "Nom et Prénom complet",
    fullNamePlaceholder: "Votre nom complet",
    phoneLabel: "Numéro de téléphone",
    phonePlaceholder: "Ex: 0550123456",
    summaryTitle: "Résumé de la commande",
    shippingFee: "Frais de livraison",
    free: "Gratuit",
    totalToPay: "Total à payer",
    paymentMethod: "Mode de paiement",
    codNotice: "Paiement en espèces à la livraison (COD) uniquement",
    placeOrder: "Confirmer la commande sur WhatsApp",
    whatsappRedirecting: "Préparation de la commande et redirection vers WhatsApp...",
    contactTitle: "Contactez-nous / Localisation",
    contactSubtitle: "Nous serons ravis de vous accueillir dans notre magasin à Tlemcen ou de répondre à vos questions.",
    address: "Adresse",
    addressValue: "Boulevard Gaouar Hocine, Bab Zir 2, Tlemcen (Algérie)",
    workHours: "Horaires de travail",
    workHoursValue: "Tous les jours de 9h00 à 18h00",
    phone: "Téléphone",
    email: "E-mail",
    socialMedia: "Suivez-nous",
    contactFormTitle: "Envoyez-nous un message",
    nameInput: "Nom complet",
    emailInput: "Adresse e-mail (optionnelle)",
    messageInput: "Votre message ou question sur un tissu",
    submitForm: "Envoyer le message",
    formSuccess: "Votre message a été envoyé avec succès ! Nous vous recontacterons sous peu.",
    footerText: "Tous droits réservés. Aqmacha wa Skay Bab Zir 2 - Tlemcen.",
    orderSuccessTitle: "Commande enregistrée !",
    orderSuccessText: "Nous allons maintenant vous rediriger vers WhatsApp pour envoyer le récapitulatif de votre commande et confirmer l'adresse de livraison directement avec le vendeur.",
    whatsappBtn: "Envoyer les détails sur WhatsApp"
  }
};

export const AppProvider = ({ children }) => {
  const { fabricsData, fabricTypes } = useAdmin();

  // Filter out inactive products and categories for the public shop
  const fabrics = fabricsData.filter(f => f.active !== false);
  const categories = fabricTypes.filter(c => c.active !== false);

  // Langue: default to Arabic
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    return saved || 'ar';
  });

  // Panier
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Apply direction to HTML element on language change
  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Translation helper
  const t = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return key;
  };

  // Switch Language
  const toggleLanguage = () => {
    setLang(prev => (prev === 'ar' ? 'fr' : 'ar'));
  };

  // Add item to cart (with floating length, min 0.5m)
  const addToCart = (fabric, length) => {
    const parsedLength = parseFloat(length);
    if (isNaN(parsedLength) || parsedLength < 0.5) return;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.fabric.id === fabric.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].length = parseFloat((newCart[existingIndex].length + parsedLength).toFixed(2));
        return newCart;
      } else {
        return [...prevCart, { fabric, length: parsedLength }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (fabricId) => {
    setCart(prev => prev.filter(item => item.fabric.id !== fabricId));
  };

  // Update item length in cart
  const updateCartItemLength = (fabricId, newLength) => {
    const parsedLength = parseFloat(newLength);
    if (isNaN(parsedLength) || parsedLength < 0.5) return;

    setCart(prev =>
      prev.map(item =>
        item.fabric.id === fabricId
          ? { ...item, length: parseFloat(parsedLength.toFixed(2)) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Save order to localStorage (via AdminContext)
  const saveOrder = (order) => {
    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...existing]));
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemLength,
        clearCart,
        saveOrder,
        fabrics,
        categories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
