import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5a7ldHspa_IZxo2SEOBt9PVtSEMR255M",
  authDomain: "chef-mate-app.firebaseapp.com",
  projectId: "chef-mate-app",
  storageBucket: "chef-mate-app.firebasestorage.app",
  messagingSenderId: "942662303634",
  appId: "1:942662303634:web:669b13e947bb6c3ef94b4b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
