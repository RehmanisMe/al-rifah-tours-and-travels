/**
 * Umrah package pricing.
 *
 * Pure calculation: no DOM access, no side effects, no globals. Given the same
 * quote input it always returns the same breakdown, which is what makes the
 * pricing rules reviewable and testable independently of the page.
 *
 * The formulas reproduce the original calculator exactly. See the note on meals
 * and laundry below before changing anything here, since these numbers are
 * quoted to customers.
 */
import { PRICING } from '../../config/pricing.config.js';

/**
 * @typedef {object} QuoteInput
 * @property {number} adults
 * @property {number} children
 * @property {number} infants
 * @property {number} sharing         Occupants per room.
 * @property {number} visa            Per-person visa cost.
 * @property {number} transport       Total transport cost for the group.
 * @property {number} makkahRate      Per-night room rate in Makkah.
 * @property {number} makkahNights
 * @property {number} madinahRate     Per-night room rate in Madinah.
 * @property {number} madinahNights
 * @property {number} laundryUnits
 * @property {number} spiritual       Sum of selected spiritual add-ons.
 * @property {number} comfort         Sum of selected comfort add-ons.
 * @property {number} premium         Sum of selected premium add-ons.
 * @property {number} airfare         Airline plus airport charges, 0 if not booked.
 */

/**
 * Calculates a full cost breakdown for a quote.
 *
 * @param {QuoteInput} input
 * @param {typeof PRICING} [rates]
 * @returns {object} Every line item shown in the results panel.
 */
export function calculateQuote(input, rates = PRICING) {
  const {
    adults,
    children,
    infants,
    sharing,
    visa,
    transport,
    makkahRate,
    makkahNights,
    madinahRate,
    madinahNights,
    laundryUnits,
    spiritual,
    comfort,
    premium,
    airfare,
  } = input;

  // Group transport is split across the paying adults.
  const transportPerPerson = transport / adults;

  // Room cost is per night, divided by how many people share the room.
  const makkahPerPerson = (makkahRate * makkahNights) / sharing;
  const madinahPerPerson = (madinahRate * madinahNights) / sharing;

  const totalNights = makkahNights + madinahNights;
  const meals = totalNights * rates.mealsPerNight;
  const laundry = laundryUnits * rates.laundryPerUnit;

  // Meals and laundry are deliberately inside the per-adult subtotal, which
  // means they are charged once per adult. This matches the original
  // calculator; moving them out would change every quote the business gives.
  const perAdult =
    visa +
    transportPerPerson +
    makkahPerPerson +
    madinahPerPerson +
    meals +
    laundry +
    spiritual +
    comfort +
    premium +
    airfare;

  // Children and infants are flat rates, not derived from the adult subtotal.
  const childrenTotal = children * rates.childRate;
  const infantsTotal = infants * rates.infantRate;

  const total = perAdult * adults + childrenTotal + infantsTotal;

  return {
    visa,
    transportPerPerson,
    makkahPerPerson,
    madinahPerPerson,
    meals,
    laundry,
    spiritual,
    comfort,
    premium,
    airfare,
    perAdult,
    children: { count: children, total: childrenTotal, rate: rates.childRate },
    infants: { count: infants, total: infantsTotal, rate: rates.infantRate },
    total,
  };
}
