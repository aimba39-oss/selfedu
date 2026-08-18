import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAs3ZWEyPbz4e0JKi7gAFqAZXB9F4m_GA",
  authDomain: "selfedu-305eb.firebaseapp.com",
  projectId: "selfedu-305eb",
  storageBucket: "selfedu-305eb.firebasestorage.app",
  messagingSenderId: "205017453733",
  appId: "1:205017453733:web:2b09c08f1bc604e5b3294c",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

export const db = getFirestore(app);