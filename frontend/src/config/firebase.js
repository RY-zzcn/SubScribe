import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyD_example_key",
  authDomain: "subscribetracker.firebaseapp.com",
  projectId: "subscribetracker",
  storageBucket: "subscribetracker.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: "G-EXAMPLE123"
};

// 初始化Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 