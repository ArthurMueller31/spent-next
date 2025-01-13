// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtWr8ZhuATJPsdey3uvNq-v3YvTtalBsI",
  authDomain: "spent-f8a38.firebaseapp.com",
  projectId: "spent-f8a38",
  storageBucket: "spent-f8a38.firebasestorage.app",
  messagingSenderId: "531202100389",
  appId: "1:531202100389:web:49ecf3ea6e608b1178914c",
  measurementId: "G-2MCR6ZRM6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const firestore = getFirestore(app)