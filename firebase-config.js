// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore-compat.js";

const firebaseConfig = {
    apiKey: "AIzaSyC4PB2fkERxVNSkyaBZF5jhhkxRNXjVPHU",
    authDomain: "calendario-prenotazione-79907.firebaseapp.com",
    projectId: "calendario-prenotazione-79907",
    storageBucket: "calendario-prenotazione-79907.firebasestorage.appspot.com", // Corretto il nome del bucket
    messagingSenderId: "578224627791",
    appId: "1:578224627791:web:32ef09fa71d73802b0ca3a",
    measurementId: "G-L3L6397E2G" // Aggiungi il tuo Measurement ID
};

initializeApp(firebaseConfig);
export const db = getFirestore();