import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "gen-lang-client-0953954735",
  appId: "1:1063857725907:web:4b02083c254cb947cd0f26",
  apiKey: "AIzaSyDdR7hU-XCrMDqwtj-rUntbszLpQIjPMk0",
  authDomain: "gen-lang-client-0953954735.firebaseapp.com",
  storageBucket: "gen-lang-client-0953954735.firebasestorage.app",
  messagingSenderId: "1063857725907"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, "ai-studio-genfocus-4421d6d5-bcda-4688-86d7-92ea1e9faec9");
export const storage = getStorage(app);
