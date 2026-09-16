/**
 * Firebase project credentials.
 *
 * These values are safe to ship in client code: a Firebase web API key is a
 * public project identifier, not a secret. Access is controlled by Firestore
 * security rules (see firestore.rules at the project root), not by hiding this.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyBK9-S-k7_hsj-4aRrLhDzVWh7Wghn2500',
  authDomain: 'al-rifah.firebaseapp.com',
  projectId: 'al-rifah',
  storageBucket: 'al-rifah.firebasestorage.app',
  messagingSenderId: '589103084402',
  appId: '1:589103084402:web:0d0c9f594dc4ca223aa3eb',
  measurementId: 'G-JZ74055CQW',
};

/** Pinned Firebase SDK version, so both service modules load the same build. */
export const FIREBASE_SDK_VERSION = '11.0.1';
