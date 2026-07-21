import React, { createContext, useContext, useState, useEffect } from 'react';
import { categories as defaultCategories, fabrics as defaultFabrics } from '../data/fabrics';
import { db, FIREBASE_ENABLED, onAuthChange } from '../firebase';
import {
  collection, doc, getDocs, setDoc, deleteDoc,
  onSnapshot, orderBy, query, serverTimestamp
} from 'firebase/firestore';

const AdminContext = createContext();

// ─── Collections Firestore ──────────────────────────────────────────────────
const COL_TYPES    = 'fabric_types';
const COL_FABRICS  = 'fabrics';
const COL_ORDERS   = 'orders';
const COL_SETTINGS = 'settings';

// ─── Helpers localStorage (fallback) ────────────────────────────────────────
const lsGet  = (key, fallback) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; } };
const lsSet  = (key, val)      => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export const AdminProvider = ({ children }) => {

  // ── Session ──────────────────────────────────────────────────────────────
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);

  // ── Fabric Types / Categories ─────────────────────────────────────────────
  const [fabricTypes, setFabricTypes] = useState(() =>
    lsGet('fabric_types', defaultCategories.map((c, i) => ({ ...c, description: '', image: '', order: i, active: true })))
  );

  // ── Fabrics / Products ────────────────────────────────────────────────────
  const [fabricsData, setFabricsData] = useState(() =>
    lsGet('fabrics_data', defaultFabrics.map(f => ({ ...f, stock: 100, active: true })))
  );

  // ── Orders ────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState(() => lsGet('orders', []));

  // ── Data Ready Flag ───────────────────────────────────────────────────────
  // true dès que le premier snapshot Firestore est reçu (ou immédiatement si Firebase désactivé)
  const [isDataReady, setIsDataReady] = useState(!FIREBASE_ENABLED);

  // ── Homepage Settings ─────────────────────────────────────────────────────
  const [homepageSettings, setHomepageSettings] = useState(() =>
    lsGet('homepage_settings', { 
      heroImage: '/photo_9_2026-07-03_20-52-45.jpg',
      featuredProductId: '1', // produit vedette par défaut
      galleryImages: [
        '/photo_20_2026-07-03_20-52-45.jpg',
        '/photo_21_2026-07-03_20-52-45.jpg',
        '/photo_22_2026-07-03_20-52-45.jpg',
        '/photo_23_2026-07-03_20-52-45.jpg',
        '/photo_24_2026-07-03_20-52-45.jpg',
        '/photo_25_2026-07-03_20-52-45.jpg',
      ]
    })
  );

  // ── Firebase: chargement temps réel ─────────────────────────────────────
  useEffect(() => {
    // Écouter le statut d'authentification Firebase Auth
    const unsubAuth = onAuthChange((user) => {
      if (user) {
        setIsAdminLoggedIn(true);
        setAdminEmail(user.email);
      } else {
        setIsAdminLoggedIn(false);
        setAdminEmail(null);
      }
    });

    if (!FIREBASE_ENABLED || !db) {
      // Mode offline local : marquer prêt immédiatement
      setIsDataReady(true);
      return unsubAuth;
    }

    // Écouter les catégories en temps réel
    const unsubTypes = onSnapshot(
      query(collection(db, COL_TYPES), orderBy('order', 'asc')),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        setFabricTypes(data);
        lsSet('fabric_types', data);
      }
    );

    // Écouter les tissus en temps réel
    const unsubFabrics = onSnapshot(
      collection(db, COL_FABRICS),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        setFabricsData(data);
        lsSet('fabrics_data', data);
        // Marquer les données comme prêtes dès le premier snapshot reçu
        setIsDataReady(true);
      }
    );

    // Écouter les configurations de l'accueil
    const unsubHomepage = onSnapshot(doc(db, COL_SETTINGS, 'homepage'), snap => {
      if (snap.exists()) {
        const data = snap.data();
        setHomepageSettings(data);
        lsSet('homepage_settings', data);
      }
    });

    return () => {
      unsubAuth();
      unsubTypes();
      unsubFabrics();
      unsubHomepage();
    };
  }, []);

  // Écouter les commandes en temps réel UNIQUEMENT si l'administrateur est connecté
  useEffect(() => {
    if (!FIREBASE_ENABLED || !db || !isAdminLoggedIn) {
      return;
    }

    const unsubOrders = onSnapshot(
      query(collection(db, COL_ORDERS), orderBy('date', 'desc')),
      snap => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        setOrders(data);
        lsSet('orders', data);
      },
      err => {
        console.error("Erreur d'écoute des commandes (Permissions) :", err);
      }
    );

    return () => unsubOrders();
  }, [isAdminLoggedIn]);

  // ── Persist localStorage (fallback si Firebase désactivé) ────────────────
  useEffect(() => { if (!FIREBASE_ENABLED) lsSet('fabric_types', fabricTypes); }, [fabricTypes]);
  useEffect(() => { if (!FIREBASE_ENABLED) lsSet('fabrics_data', fabricsData); }, [fabricsData]);
  useEffect(() => { if (!FIREBASE_ENABLED) lsSet('orders', orders);            }, [orders]);
  useEffect(() => { if (!FIREBASE_ENABLED) lsSet('homepage_settings', homepageSettings); }, [homepageSettings]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { loginAdmin } = await import('../firebase');
    const result = await loginAdmin(email, password);
    if (result && result.user) {
      setIsAdminLoggedIn(true);
      setAdminEmail(result.user.email);
      return true;
    }
    return false;
  };

  const logout = async () => {
    const { logoutAdmin } = await import('../firebase');
    await logoutAdmin();
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
  };

  const changePassword = async (newPassword) => {
    const { changeAdminPassword } = await import('../firebase');
    await changeAdminPassword(newPassword);
  };

  const updateHomepageSettings = async (updates) => {
    const newSettings = { ...homepageSettings, ...updates };
    setHomepageSettings(newSettings);
    lsSet('homepage_settings', newSettings);
    if (FIREBASE_ENABLED && db) {
      await setDoc(doc(db, COL_SETTINGS, 'homepage'), updates, { merge: true });
    }
  };

  // ── Fabric Types CRUD ─────────────────────────────────────────────────────
  const addFabricType = async (typeData) => {
    const id = `type-${Date.now()}`;
    const newType = { ...typeData, id, order: fabricTypes.length, active: true };
    if (FIREBASE_ENABLED && db) {
      await setDoc(doc(db, COL_TYPES, id), newType);
    } else {
      setFabricTypes(prev => [...prev, newType]);
    }
    return newType;
  };

  const updateFabricType = async (id, updates) => {
    if (FIREBASE_ENABLED && db) {
      await setDoc(doc(db, COL_TYPES, id), updates, { merge: true });
    } else {
      setFabricTypes(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const deleteFabricType = async (id) => {
    if (FIREBASE_ENABLED && db) {
      await deleteDoc(doc(db, COL_TYPES, id));
    } else {
      setFabricTypes(prev => prev.filter(t => t.id !== id));
    }
  };

  const reorderFabricTypes = async (fromIndex, toIndex) => {
    const arr = [...fabricTypes];
    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    const reordered = arr.map((t, i) => ({ ...t, order: i }));
    if (FIREBASE_ENABLED && db) {
      await Promise.all(reordered.map(t => setDoc(doc(db, COL_TYPES, t.id), { order: t.order }, { merge: true })));
    } else {
      setFabricTypes(reordered);
    }
  };

  // ── Fabrics CRUD ──────────────────────────────────────────────────────────
  const addFabric = async (fabricData) => {
    const id = String(Date.now());
    const newFabric = { ...fabricData, id, stock: fabricData.stock ?? 100, active: true };
    if (FIREBASE_ENABLED && db) {
      await setDoc(doc(db, COL_FABRICS, id), newFabric);
    } else {
      setFabricsData(prev => [...prev, newFabric]);
    }
    return newFabric;
  };

  const updateFabric = async (id, updates) => {
    const sid = String(id);
    if (FIREBASE_ENABLED && db) {
      await setDoc(doc(db, COL_FABRICS, sid), updates, { merge: true });
    } else {
      setFabricsData(prev => prev.map(f => String(f.id) === sid ? { ...f, ...updates } : f));
    }
  };

  const deleteFabric = async (id) => {
    const sid = String(id);
    if (FIREBASE_ENABLED && db) {
      await deleteDoc(doc(db, COL_FABRICS, sid));
    } else {
      setFabricsData(prev => prev.filter(f => String(f.id) !== sid));
    }
  };

  // ── Orders ────────────────────────────────────────────────────────────────
  const saveOrder = async (order) => {
    const id = String(order.id || Date.now());
    const orderWithId = { ...order, id, date: order.date || new Date().toISOString() };
    if (FIREBASE_ENABLED && db) {
      await setDoc(doc(db, COL_ORDERS, id), orderWithId);
    } else {
      setOrders(prev => [orderWithId, ...prev]);
    }
    return orderWithId;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const sid = String(orderId);
    if (FIREBASE_ENABLED && db) {
      await setDoc(doc(db, COL_ORDERS, sid), { status: newStatus }, { merge: true });
    } else {
      setOrders(prev => prev.map(o => String(o.id) === sid ? { ...o, status: newStatus } : o));
    }
  };

  const deleteOrder = async (orderId) => {
    const sid = String(orderId);
    if (FIREBASE_ENABLED && db) {
      await deleteDoc(doc(db, COL_ORDERS, sid));
    } else {
      setOrders(prev => prev.filter(o => String(o.id) !== sid));
    }
  };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const exportOrdersCSV = (filteredOrders = orders) => {
    const headers = [
      'ID Commande', 'Date', 'Nom Client', 'Téléphone',
      'Wilaya', 'Commune', 'Adresse', 'Type Livraison',
      'Articles', 'Sous-total (DA)', 'Frais Livraison (DA)', 'Total (DA)', 'Statut'
    ];

    const rows = filteredOrders.map(o => {
      const articles = o.items.map(item =>
        `${item.fabric?.nameFr || item.fabric?.nameAr || 'Tissu'} x${item.length}m @ ${item.fabric?.price}DA`
      ).join(' | ');

      return [
        o.id,
        new Date(o.date).toLocaleString('fr-DZ'),
        o.client?.fullName || '',
        o.client?.phone || '',
        o.client?.wilaya?.nameFr || '',
        o.client?.commune || '',
        o.client?.address || '',
        o.deliveryType === 'home' ? 'Domicile' : 'Stop Desk',
        articles,
        o.subtotal?.toFixed(0) || '0',
        o.shippingFee || '0',
        o.total?.toFixed(0) || '0',
        translateStatus(o.status),
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commandes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const translateStatus = (status) => {
    const map = {
      en_attente: 'En attente',
      confirmee:  'Confirmée',
      expediee:   'Expédiée',
      livree:     'Livrée',
      annulee:    'Annulée',
    };
    return map[status] || status;
  };

  return (
    <AdminContext.Provider value={{
      // Auth
      isAdminLoggedIn, login, logout, changePassword,
      // Fabric Types
      fabricTypes, addFabricType, updateFabricType, deleteFabricType, reorderFabricTypes,
      // Fabrics
      fabricsData, addFabric, updateFabric, deleteFabric,
      // Orders
      orders, saveOrder, updateOrderStatus, deleteOrder, exportOrdersCSV,
      translateStatus,
      // Homepage Settings
      homepageSettings, updateHomepageSettings,
      // Data Ready
      isDataReady,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
