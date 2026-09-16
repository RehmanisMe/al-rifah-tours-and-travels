/**
 * Persistence for customer enquiries.
 *
 * This is the only module that knows enquiries live in a Firestore collection
 * called "enquiries". The UI depends on the exported function signature, not on
 * Firestore, so swapping the backend (an HTTP endpoint, a Cloud Function) means
 * changing this file alone.
 */
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { db } from './firebase-app.js';

const COLLECTION = 'enquiries';

/**
 * Field whitelist. Only these keys are written, so a rogue or accidental
 * property on the form object can never reach the database.
 */
const ENQUIRY_FIELDS = [
  'depart_from',
  'travel_date',
  'makkah_nights',
  'madinah_nights',
  'adults',
  'children',
  'accommodation',
  'rooms',
  'email',
  'phone',
];

/**
 * Saves an enquiry.
 *
 * @param {Record<string, string>} enquiry
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 *   Resolves rather than throwing, so callers handle one shape of result.
 */
export async function saveEnquiry(enquiry) {
  const payload = { submitted_at: serverTimestamp(), status: 'new' };
  for (const field of ENQUIRY_FIELDS) {
    payload[field] = enquiry[field] ?? '';
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION), payload);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Failed to save enquiry:', error);
    return { success: false, error: error.message };
  }
}
