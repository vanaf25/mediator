import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAslI8--1DbYOOtN10R2wRUQjHlI2XDoNw",
  authDomain: "mediators1-ae412.firebaseapp.com",
  projectId: "mediators1-ae412",
  storageBucket: "mediators1-ae412.firebasestorage.app",
  messagingSenderId: "261011443529",
  appId: "1:261011443529:web:06d9ba9c60525c2cb11498",
  measurementId: "G-0RH5MTYNV8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.warn('Firebase persistence has already been enabled in another tab.');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('Firebase persistence is not available in this browser.');
  }
});