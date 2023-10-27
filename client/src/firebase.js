// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wikiestate-26dc7.firebaseapp.com",
  projectId: "wikiestate-26dc7",
  storageBucket: "wikiestate-26dc7.appspot.com",
  messagingSenderId: "445044515022",
  appId: "1:445044515022:web:c18d9134e607ff0ac3f09f",
  measurementId: "G-MV8S3D413K",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
