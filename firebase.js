// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'wsei-app-front.firebaseapp.com',
  projectId: 'wsei-app-front',
  storageBucket: 'wsei-app-front.firebasestorage.app',
  messagingSenderId: '704335825335',
  appId: '1:704335825335:web:1274b9025246a3f1080032',
  measurementId: 'G-P20NR367D6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
