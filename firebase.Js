import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

 getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  authDomain:
  "arcane-connection-web.firebaseapp.com",

  projectId:
  "arcane-connection-web",

  storageBucket:
  "arcane-connection-web.firebasestorage.app",

  messagingSenderId:
  "713622426280",

  appId:
  "1:713622426280:web:4a06b4a2fde6bf97e2e89d",

  measurementId:
  "G-31KHX4RS1P"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

window.db = db;

window.addDoc = addDoc;

window.collection = collection;

window.getDocs = getDocs;

console.log("Firebase carregado");

window.firebaseReady = true;

console.log("Firebase carregado");

console.log(window.collection);
console.log(window.getDocs);

window.doc = doc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
