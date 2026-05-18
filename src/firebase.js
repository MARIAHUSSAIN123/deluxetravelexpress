

import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {

  apiKey:
    "AIzaSyAt5gY2N-CdK7-8udDHLaB8RdVvFLXe15E",

  authDomain:
    "deluxe-travel-express.firebaseapp.com",

  projectId:
    "deluxe-travel-express",

  storageBucket:
    "deluxe-travel-express.firebasestorage.app",

  messagingSenderId:
    "546387162060",

  appId:
    "1:546387162060:web:c8fc9370f144f09c3ba369",

  measurementId:
    "G-EFKEXPG82F",
};

const app =
  initializeApp(firebaseConfig);

/* AUTH */
export const auth =
  getAuth(app);

/* KEEP USER LOGGED IN */
setPersistence(
  auth,
  browserLocalPersistence
)
  .then(() => {

    console.log(
      "Auth persistence enabled"
    );

  })
  .catch((error) => {

    console.log(error);

  });

/* FIRESTORE */
export const db =
  getFirestore(app);

/* GOOGLE PROVIDER */
export const googleProvider =
  new GoogleAuthProvider();

export default app;

