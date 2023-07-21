import { initializeApp } from "firebase/app";

import {  
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithCredential 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function loginUser(username: string, password: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, username, password); 
    console.log(res)
    return res.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function registerUser(username: string, password: string) {
  try {
      const res = await createUserWithEmailAndPassword(auth, username, password);
      console.log(res)
      return res.user;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

export async function loginWithGoogle(idToken: string) {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const res = await signInWithCredential(auth, credential);
    console.log(res);
    return res.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// For Google, registration and login is the same process
// If the Google account is not linked with Firebase yet, it'll automatically create a new account
export const registerWithGoogle = loginWithGoogle;