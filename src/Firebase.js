import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCYQN5ktjhsa6YaIZ7eAaAt2NgiJPSqx3E",
    authDomain: "my-app-26d2e.firebaseapp.com",
    projectId: "my-app-26d2e",
    storageBucket: "my-app-26d2e.appspot.com",
    messagingSenderId: "469627396937",
    appId: "1:469627396937:web:16c95b2c89f90c72717098"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
