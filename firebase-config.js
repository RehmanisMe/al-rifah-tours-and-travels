// Firebase Configuration for Al-Rifah Tours
// Replace the values below with your Firebase project config
// Found in: Firebase Console > Project Settings > General > Your apps > Web app

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK9-S-k7_hsj-4aRrLhDzVWh7Wghn2500",
  authDomain: "al-rifah.firebaseapp.com",
  projectId: "al-rifah",
  storageBucket: "al-rifah.firebasestorage.app",
  messagingSenderId: "589103084402",
  appId: "1:589103084402:web:0d0c9f594dc4ca223aa3eb",
  measurementId: "G-JZ74055CQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save form submission to Firestore
export async function saveEnquiry(formData) {
    try {
        const docRef = await addDoc(collection(db, "enquiries"), {
            depart_from: formData.depart_from,
            travel_date: formData.travel_date,
            makkah_nights: formData.makkah_nights,
            madinah_nights: formData.madinah_nights,
            adults: formData.adults,
            children: formData.children,
            accommodation: formData.accommodation,
            rooms: formData.rooms,
            email: formData.email,
            phone: formData.phone,
            submitted_at: serverTimestamp(),
            status: "new"
        });
        console.log("Enquiry saved with ID:", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving enquiry:", error);
        return { success: false, error: error.message };
    }
}
