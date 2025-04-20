import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcRXzC10d-w5-BBkzw1lXxlUiW8Bllyao",
  authDomain: "le-spot-c2ddb.firebaseapp.com",
  projectId: "le-spot-c2ddb",
  storageBucket: "le-spot-c2ddb.firebasestorage.app",
  messagingSenderId: "377176350702",
  appId: "1:377176350702:web:fa6d30da989d6c2b3bb8ff",
  measurementId: "G-TV1TM113K3"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 