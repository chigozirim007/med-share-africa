// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_8v23ZQVkql0bhlM5HCKwW25Gn3scL40",
  authDomain: "med-share-3c2cc.firebaseapp.com",
  projectId: "med-share-3c2cc",
  storageBucket: "med-share-3c2cc.firebasestorage.app",
  messagingSenderId: "510868357060",
  appId: "1:510868357060:web:45bb7081b8918cbcd9ae91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}