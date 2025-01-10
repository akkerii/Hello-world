// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBHQTs-EA35LGOxVURSqeZnYeBDt86lUc",
  authDomain: "currencyconverterapp-ecfec.firebaseapp.com",
  projectId: "currencyconverterapp-ecfec",
  storageBucket: "currencyconverterapp-ecfec.firebasestorage.app",
  messagingSenderId: "1098802402541",
  appId: "1:1098802402541:web:1f5d785415ab7d0e9628e4",
  measurementId: "G-GRNWR2J55S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 


