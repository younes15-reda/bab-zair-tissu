// ─── Firebase Initialization ──────────────────────────────────────────────────
// Les clés sont lues depuis les variables d'environnement (.env)
// Si non configuré, le site bascule en mode localStorage (fallback)

import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Vérifie si les clés Firebase sont bien fournies
export const FIREBASE_ENABLED = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let db = null;

if (FIREBASE_ENABLED) {
  try {
    const app = initializeApp(firebaseConfig);
    // Initialise Firestore avec un cache local persistant pour un chargement instantané (offline-first)
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    console.log('✅ Firebase Firestore connecté avec cache local persistant.');
  } catch (e) {
    console.warn('⚠️ Firebase non disponible, mode localStorage activé.', e);
  }
} else {
  console.info('ℹ️ Variables Firebase non configurées — mode localStorage activé.');
}

export { db };
