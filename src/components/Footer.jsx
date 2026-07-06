import React from 'react';
import { useApp } from '../context/AppContext';

export default function Footer({ setCurrentPage }) {
  const { t, lang } = useApp();

  return (
    <footer className="bg-sand-950 text-sand-200 border-t border-sand-900 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-sand-800">
          
          {/* Brand Presentation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-full border border-sand-800 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xl font-bold text-white font-cairo">
                {t('brandName')}
              </span>
            </div>
            <p className="text-sm text-sand-400 font-medium leading-relaxed max-w-sm">
              {t('brandSubtitle')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse pt-2">
              {/* Facebook Icon */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sand-900 flex items-center justify-center text-sand-400 hover:bg-gold-500 hover:text-white transition-all duration-300"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              {/* Messenger Icon */}
              <a
                href="https://m.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sand-900 flex items-center justify-center text-sand-400 hover:bg-gold-500 hover:text-white transition-all duration-300"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sand-900 flex items-center justify-center text-sand-400 hover:bg-gold-500 hover:text-white transition-all duration-300"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg font-cairo">
              {lang === 'ar' ? 'روابط سريعة' : 'Liens Rapides'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-gold-500 transition-colors font-medium">
                  {t('home')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-gold-500 transition-colors font-medium">
                  {t('shop')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-gold-500 transition-colors font-medium">
                  {t('contact')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('cart')} className="hover:text-gold-500 transition-colors font-medium">
                  {t('cart')}
                </button>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg font-cairo">
              {lang === 'ar' ? 'معلومات الاتصال' : 'Informations'}
            </h3>
            <div className="space-y-3.5 text-sm font-medium">
              <div className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t('addressValue')}</span>
              </div>
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="block text-xs text-sand-400">{t('workHours')}</span>
                  <span>{t('workHoursValue')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span dir="ltr">+213 (0) 554 28 32 64</span> {/* Contact phone number */}
              </div>
            </div>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-500 font-semibold space-y-4 sm:space-y-0">
          <span>{t('footerText')}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <span>Powered by</span>
              <span className="text-gold-500 font-bold">ZR Express</span>
            </span>
            {/* Lien admin discret — réservé au gestionnaire */}
            <button
              onClick={() => setCurrentPage('admin-login')}
              className="text-sand-800/30 hover:text-sand-500 transition-colors text-[10px] font-medium"
              title="Espace Admin"
            >
              ⚙ Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
