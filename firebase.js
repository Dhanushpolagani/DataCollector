// Your Firebase config from Firebase Console
  const firebaseConfig = {
    apiKey: "AIzaSyCsRuJc7gkezRQuEMyXgeFWC0Kb8lCaY8o",
    authDomain: "data-collection-app-2f5d3.firebaseapp.com",
    projectId: "data-collection-app-2f5d3",
    storageBucket: "data-collection-app-2f5d3.firebasestorage.app",
    messagingSenderId: "579351834693",
    appId: "1:579351834693:web:bf7f6f5a2f5d4d064d332c",
    measurementId: "G-HEBJMMX4SC"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Expose commonly used instances (script1.js uses firebase.* global)
const auth = firebase.auth();
const db = firebase.firestore();

