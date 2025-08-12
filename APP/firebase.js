// Import only the Firebase services you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDibvW6f9vb4C3NUhHnhHVlBF_URhM15aE",
  authDomain: "heatscape-547da.firebaseapp.com",
  projectId: "heatscape-547da",
  storageBucket: "heatscape-547da.firebasestorage.app",
  messagingSenderId: "479991817227",
  appId: "1:479991817227:web:3a2d239d812cf1aae1930e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize only the services you need
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;