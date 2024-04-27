// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARdH5n2t9bVLiAaVveTWpU2ujfnEcwdrY",
  authDomain: "ychat-web.firebaseapp.com",
  projectId: "ychat-web",
  storageBucket: "ychat-web.appspot.com",
  messagingSenderId: "876635529192",
  appId: "1:876635529192:web:9f179685a88df24ca88e5d",
  measurementId: "G-6PGQLE8NYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

// const analytics = getAnalytics(app);