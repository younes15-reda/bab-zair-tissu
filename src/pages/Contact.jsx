import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const { lang, t } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Simulate sending message
    setIsSuccess(true);
    setName('');
    setEmail('');
    setMessage('');
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sand-950 font-cairo">
          {t('contactTitle')}
        </h1>
        <p className="text-sm text-sand-500 font-medium max-w-xl mx-auto">
          {t('contactSubtitle')}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Col: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Address */}
          <div className="bg-white border border-sand-200 rounded-3xl p-6 shadow-sm flex items-start space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="space-y-1 text-right rtl:text-right ltr:text-left">
              <h4 className="text-sm font-extrabold text-sand-950 uppercase tracking-wider">{t('address')}</h4>
              <p className="text-sm text-sand-600 font-semibold leading-relaxed">
                {t('addressValue')}
              </p>
              <span className="inline-block text-[10px] text-gold-600 font-bold bg-gold-50 border border-gold-200 px-2 py-0.5 rounded mt-1">
                VMPV+G8H Tlemcen
              </span>
            </div>
          </div>

          {/* Card: Work Hours */}
          <div className="bg-white border border-sand-200 rounded-3xl p-6 shadow-sm flex items-start space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1 text-right rtl:text-right ltr:text-left">
              <h4 className="text-sm font-extrabold text-sand-950 uppercase tracking-wider">{t('workHours')}</h4>
              <p className="text-sm text-sand-600 font-semibold leading-relaxed">
                {t('workHoursValue')}
              </p>
              <span className="inline-block text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded mt-1">
                {lang === 'ar' ? 'الجمعة مغلق' : 'Vendredi fermé'}
              </span>
            </div>
          </div>

          {/* Card: Phone / WhatsApp */}
          <div className="bg-white border border-sand-200 rounded-3xl p-6 shadow-sm flex items-start space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="space-y-1 text-right rtl:text-right ltr:text-left">
              <h4 className="text-sm font-extrabold text-sand-950 uppercase tracking-wider">{t('phone')}</h4>
              <p className="text-sm text-sand-600 font-bold tracking-wide" dir="ltr">
                +213 (0) 554 28 32 64
              </p>
              <p className="text-xs text-sand-400 font-semibold">
                {lang === 'ar' ? 'متاح أيضاً للاتصال والاستفسار المباشر' : 'Disponible pour appels directs.'}
              </p>
            </div>
          </div>

          {/* Mini Mockup Map Card */}
          <div className="bg-sand-100 rounded-3xl p-6 border border-sand-200 text-center relative overflow-hidden h-48 flex items-center justify-center">
            {/* Visual background representation of a map */}
            <div className="absolute inset-0 opacity-20 bg-cover" style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/1.314,34.881,13/400x300?access_token=mock')` }}></div>
            
            {/* Elegant Map Mockup UI */}
            <div className="relative z-10 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-600 text-white flex items-center justify-center mx-auto shadow-md shadow-gold-500/20">
                <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="block text-xs font-bold text-sand-900">{t('brandName')}</span>
              <span className="block text-[10px] text-sand-500 font-semibold">{t('addressValue')}</span>
            </div>
          </div>

        </div>

        {/* Right Col: Contact Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-sand-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-sand-950 border-b border-sand-100 pb-3 font-cairo">
            {t('contactFormTitle')}
          </h3>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sand-700">{t('nameInput')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'ar' ? 'اسمك الكريم' : 'Votre nom complet'}
              className="w-full px-4 py-3 text-sm font-semibold border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {/* Email (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sand-700">{t('emailInput')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: email@example.com"
              className="w-full px-4 py-3 text-sm font-semibold border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-sand-700">{t('messageInput')}</label>
            <textarea
              required
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب استفسارك هنا بالتفصيل...' : 'Détaillez votre demande ici...'}
              className="w-full px-4 py-3 text-sm font-semibold border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-gold-600 hover:bg-gold-700 text-white font-extrabold text-center rounded-xl shadow-md transition-all"
          >
            {t('submitForm')}
          </button>

          {/* Success banner */}
          {isSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold border border-emerald-100 animate-pulse">
              {t('formSuccess')}
            </div>
          )}
        </form>

      </div>

    </div>
  );
}
