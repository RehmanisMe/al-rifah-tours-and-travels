/**
 * Owns Firebase initialisation and nothing else.
 *
 * Single responsibility: every other module that needs Firestore imports the
 * handle from here rather than calling initializeApp again, so there is exactly
 * one app instance no matter how many features use it.
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { firebaseConfig } from '../config/firebase.config.js';

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export { app };
