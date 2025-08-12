// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDibvW6f9vb4C3NUhHnhHVlBF_URhM15aE",
  authDomain: "heatscape-547da.firebaseapp.com",
  projectId: "heatscape-547da",
  storageBucket: "heatscape-547da.firebasestorage.app",
  messagingSenderId: "479991817227",
  appId: "1:479991817227:web:3a2d239d812cf1aae1930e",
  measurementId: "G-N1QX8D2476"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);