import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { lang, toggleLanguage, t, cart } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.length;

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'shop', label: t('shop') },
    { id: 'contact', label: t('contact') }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-header sticky top-0 z-50 border-b border-sand-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => handleNavClick('home')}>
            {/* Real Store Logo image from public folder */}
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-12 h-12 rounded-full border border-sand-200 shadow-sm object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-sand-950 font-cairo leading-tight">
                {lang === 'ar' ? 'اقمشة وسكاي باب زير 2' : 'Le Tissu Bab Zir 2'}
              </span>
              <span className="text-[10px] text-primary-600 font-extrabold tracking-wider rtl:text-right">
                {lang === 'ar' ? 'القماش - تلمسان' : 'Le Tissu - Tlemcen'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-base font-semibold transition-colors duration-200 pb-1 border-b-2 ${
                  currentPage === link.id
                    ? 'border-gold-500 text-gold-700'
                    : 'border-transparent text-sand-700 hover:text-gold-600 hover:border-gold-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions (Language, Cart, Mobile Menu button) */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-sand-300 bg-white text-xs sm:text-sm font-bold text-sand-800 hover:bg-sand-100 hover:border-gold-500 shadow-sm transition-all duration-200"
            >
              {lang === 'ar' ? 'Français' : 'العربية (RTL)'}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick('cart')}
              className={`p-2.5 rounded-full relative transition-all duration-200 ${
                currentPage === 'cart'
                  ? 'bg-gold-500 text-white shadow-md shadow-gold-200'
                  : 'bg-white border border-sand-300 text-sand-800 hover:border-gold-500 hover:text-gold-600 shadow-sm'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-sand-800 hover:bg-sand-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sand-200 bg-[#fbfaf8]/95 backdrop-blur-md animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-right rtl:text-right ltr:text-left px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  currentPage === link.id
                    ? 'bg-gold-50 text-gold-600 font-extrabold'
                    : 'text-sand-700 hover:bg-sand-50 hover:text-gold-600'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('cart')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-bold ${
                currentPage === 'cart'
                  ? 'bg-gold-50 text-gold-600'
                  : 'text-sand-700 hover:bg-sand-50'
              }`}
            >
              <span>{t('cart')}</span>
              <span className="bg-gold-500 text-white text-xs px-2.5 py-0.5 rounded-full">
                {cartItemsCount} {t('cart') !== 'Cart' ? 'مواد' : 'items'}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
