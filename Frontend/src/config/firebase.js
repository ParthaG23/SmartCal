// src/config/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* ── Providers ── */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/* ── Social sign-in ── */
export const signInWithProvider = async (provider) => {
  const result = await signInWithPopup(auth, provider);
  const token  = await result.user.getIdToken();
  return { token, user: result.user };
};

/* ── Phone: reCAPTCHA ── */
export const setupRecaptcha = (elementId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, elementId, { size: "invisible" }
    );
  }
  return window.recaptchaVerifier;
};

/* ── Phone: send OTP ── */
export const sendOTP = async (phoneNumber, elementId = "recaptcha-container") => {
  const appVerifier = setupRecaptcha(elementId);
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

/* ================================================================
   PASSWORD RESET via Firebase ✅
   Firebase sends the reset email automatically.
   No backend, no Nodemailer, no Gmail setup needed.
   
   Setup in Firebase Console:
   Authentication → Templates → Password reset
   (customize the email template / sender name there)
================================================================ */
export const sendFirebasePasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`, // redirect after reset
  });
};

/* ── Sign out ── */
export const firebaseSignOut = () => signOut(auth);

export default app;