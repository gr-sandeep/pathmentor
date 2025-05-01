import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7DNajedRV6yctw0Gm8d6seVhPSo27F8s",
  authDomain: "pathmentor.firebaseapp.com",
  projectId: "pathmentor",
  storageBucket: "pathmentor.firebasestorage.app",
  messagingSenderId: "49932100424",
  appId: "1:49932100424:web:f0505f622e378a4746c97d",
  measurementId: "G-NN4YCZK1H8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup, signOut };
