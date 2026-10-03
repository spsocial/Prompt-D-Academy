'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig, firebaseConfigured } from './config';

let app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;

function ensure() {
  if (!firebaseConfigured) throw new Error('Firebase ยังไม่ได้ตั้งค่า (.env.local)');
  if (!app) app = getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
}

export const auth = () => (_auth ??= getAuth(ensure()));
export const db = () => (_db ??= getFirestore(ensure()));
export const storage = () => (_storage ??= getStorage(ensure()));

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
