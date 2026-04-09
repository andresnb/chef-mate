import { onMount } from "svelte";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../firebase/config.js";
import { ensureUserDoc } from "../firebase/firestore.js";
import { migrateLocalData } from "../firebase/migration.js";

export function useAuth() {
  let user = $state(null);
  let isLoading = $state(true);
  let error = $state("");

  const googleProvider = new GoogleAuthProvider();

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        // Ensure user doc exists + migrate localStorage data
        try {
          await ensureUserDoc(firebaseUser.uid, firebaseUser.email);
          await migrateLocalData(firebaseUser.uid);
        } catch (e) {
          console.error("Post-auth setup error:", e);
        }
      } else {
        user = null;
      }
      isLoading = false;
    });

    return () => unsubscribe();
  });

  async function signInWithGoogle() {
    error = "";
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e.code === "auth/popup-blocked" || e.code === "auth/popup-closed-by-user") {
        error = "Popup bloqueado. Permite popups para este sitio.";
      } else {
        error = e.message || "Error al iniciar sesion con Google";
      }
    }
  }

  async function signInWithEmail(email, password) {
    error = "";
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e.code === "auth/invalid-credential") {
        error = "Email o contraseña incorrectos";
      } else if (e.code === "auth/too-many-requests") {
        error = "Demasiados intentos. Intenta mas tarde.";
      } else {
        error = e.message || "Error al iniciar sesion";
      }
    }
  }

  async function createAccount(email, password) {
    error = "";
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        error = "Este email ya esta registrado";
      } else if (e.code === "auth/weak-password") {
        error = "La contraseña debe tener al menos 6 caracteres";
      } else {
        error = e.message || "Error al crear cuenta";
      }
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    }
  }

  return {
    get user() { return user; },
    get isLoading() { return isLoading; },
    get error() { return error; },
    set error(v) { error = v; },
    signInWithGoogle,
    signInWithEmail,
    createAccount,
    signOut,
  };
}
