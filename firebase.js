// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyALTEWvrAe0wZ2uw3n35jKKdPrQ0M3jxXc",
  authDomain: "peluqueria-y-manicura.firebaseapp.com",
  projectId: "peluqueria-y-manicura",
  storageBucket: "peluqueria-y-manicura.firebasestorage.app",
  messagingSenderId: "967796738416",
  appId: "1:967796738416:web:6b42c6b02139b686ad27b5",
  measurementId: "G-738F9345NH"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();