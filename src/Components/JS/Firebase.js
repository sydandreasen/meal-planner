import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const base = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID, // note that firebase console provided more keys, youtube video could be outdated here
});

export const session = () =>
  base.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION); // log user out when session ends

export const auth = firebase.auth();

export default base;
