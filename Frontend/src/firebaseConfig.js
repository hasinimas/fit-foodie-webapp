import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3i5W48bFbWvlsi16VMUiQv_X_tlVo3hg",
  authDomain: "fit-foodie-webapp.firebaseapp.com",
  projectId: "fit-foodie-webapp",
  storageBucket: "fit-foodie-webapp.firebasestorage.app",
  messagingSenderId: "442727141507",
  appId: "1:442727141507:web:fcb357154fcf17eb068bb6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
