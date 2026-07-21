// ─── Firebase Initialization ──────────────────────────────────────────────────
// Les clés sont lues depuis les variables d'environnement (.env)
// Si non configuré, le site bascule en mode localStorage (fallback)

import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword } from 'firebase/auth';

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
let auth = null;

if (FIREBASE_ENABLED) {
  try {
    const app = initializeApp(firebaseConfig);
    // Initialise Firestore avec un cache local persistant pour un chargement instantané (offline-first)
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    auth = getAuth(app);
    console.log('✅ Firebase Firestore & Auth connectés.');
  } catch (e) {
    console.warn('⚠️ Firebase non disponible, mode localStorage activé.', e);
  }
} else {
  console.info('ℹ️ Variables Firebase non configurées — mode localStorage activé.');
}

// ─── Fonctions Sessions Firebase Auth ───────────────────────────────────────

export const loginAdmin = async (email, password) => {
  if (!FIREBASE_ENABLED || !auth) {
    // Mode local (fallback) - simulation basique
    if (email === 'akmichawskaybabzir@gmail.com' && password === localStorage.getItem('local_admin_password')) {
      return { user: { email } };
    }
    throw new Error('Identifiants incorrects');
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = async () => {
  if (!FIREBASE_ENABLED || !auth) return;
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  if (!FIREBASE_ENABLED || !auth) {
    // Mode local simulation
    const checkState = () => {
      const logged = localStorage.getItem('local_admin_logged') === 'true';
      callback(logged ? { email: 'akmichawskaybabzir@gmail.com' } : null);
    };
    window.addEventListener('storage', checkState);
    checkState();
    return () => window.removeEventListener('storage', checkState);
  }
  return onAuthStateChanged(auth, callback);
};

export const changeAdminPassword = async (newPassword) => {
  if (!FIREBASE_ENABLED || !auth) {
    localStorage.setItem('local_admin_password', newPassword);
    return;
  }
  const user = auth.currentUser;
  if (!user) throw new Error('Aucun utilisateur connecté');
  return updatePassword(user, newPassword);
};

export { db, auth };

