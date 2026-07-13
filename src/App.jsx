import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAdmin } from './context/AdminContext';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

import WhatsAppFloat from './components/WhatsAppFloat';

function MainApp() {
  const { isAdminLoggedIn, isDataReady } = useAdmin();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopFilter, setShopFilter] = useState('all');
  // Contrôle du fade-out du loader
  const [showLoader, setShowLoader] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(true);

  // Dès que les données sont prêtes, démarrer le fade-out du loader
  useEffect(() => {
    if (isDataReady) {
      // Petit délai pour laisser le site se rendre avant de cacher le loader
      setTimeout(() => {
        setLoaderVisible(false); // Démarrer le fade-out
        setTimeout(() => setShowLoader(false), 500); // Supprimer complètement après l'animation
      }, 300);
    }
  }, [isDataReady]);

  // Sécurité et redirection Admin
  React.useEffect(() => {
    if (currentPage === 'admin' && !isAdminLoggedIn) {
      setCurrentPage('admin-login');
    }
  }, [currentPage, isAdminLoggedIn]);

  // Détecter le paramètre ?product=ID dans l'URL au chargement
  // Cela permet aux liens WhatsApp de pointer directement vers un produit
  const { fabrics } = useApp();
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId && fabrics && fabrics.length > 0) {
      const found = fabrics.find(f => String(f.id).trim() === String(productId).trim());
      if (found) {
        setSelectedProduct(found);
        setCurrentPage('product-detail');
        // Nettoyer l'URL sans recharger la page uniquement si le produit est trouvé
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [fabrics]);

  // Défilement automatique vers le haut au changement de page
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage, selectedProduct]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            setCurrentPage={setCurrentPage}
            setSelectedProduct={setSelectedProduct}
            setShopFilter={setShopFilter}
          />
        );
      case 'shop':
        return (
          <Shop
            setCurrentPage={setCurrentPage}
            setSelectedProduct={setSelectedProduct}
            shopFilter={shopFilter}
            setShopFilter={setShopFilter}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail
            fabric={selectedProduct}
            setCurrentPage={setCurrentPage}
            setSelectedProduct={setSelectedProduct}
          />
        );
      case 'cart':
        return (
          <Cart
            setCurrentPage={setCurrentPage}
            setSelectedProduct={setSelectedProduct}
          />
        );
      case 'checkout':
        return (
          <Checkout
            setCurrentPage={setCurrentPage}
          />
        );
      case 'admin-login':
        return (
          <AdminLogin onLoginSuccess={() => setCurrentPage('admin')} />
        );
      case 'admin':
        return (
          <AdminDashboard setCurrentPage={setCurrentPage} />
        );
      case 'contact':
        return (
          <Contact setCurrentPage={setCurrentPage} />
        );
      default:
        return (
          <Home
            setCurrentPage={setCurrentPage}
            setSelectedProduct={setSelectedProduct}
            setShopFilter={setShopFilter}
          />
        );
    }
  };

  // Admin pages : pas de loader ni de Navbar/Footer
  const isAdminPage = currentPage === 'admin' || currentPage === 'admin-login';

  if (isAdminPage) {
    return renderPage();
  }

  return (
    <>
      {/* Loader affiché pendant le chargement Firestore avec transition de disparition */}
      {showLoader && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          opacity: loaderVisible ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: loaderVisible ? 'all' : 'none',
        }}>
          <LoadingScreen />
        </div>
      )}

      {/* Site principal (toujours rendu en dessous pour précharger) */}
      <div className="flex flex-col min-h-screen" style={{ opacity: loaderVisible ? 0 : 1, transition: 'opacity 0.4s ease' }}>
        {/* Header Navigation */}
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {/* Main body content */}
        <main className="flex-grow">
          {renderPage()}
        </main>

        {/* Footer */}
        <Footer setCurrentPage={setCurrentPage} />

        {/* Floating WhatsApp Service Button */}
        <WhatsAppFloat />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AdminProvider>
  );
}
