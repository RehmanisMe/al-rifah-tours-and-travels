/**
 * Commercial rates for the Umrah cost calculator.
 *
 * These are the only numbers in the calculator that represent business policy.
 * They live here so pricing can change without touching calculation logic.
 * The values match the original calculator exactly.
 */
export const PRICING = {
  /** Full-board meals charged per night of the trip. */
  mealsPerNight: 2000,

  /** Laundry charged per unit selected on the slider. */
  laundryPerUnit: 1000,

  /** Flat per-child package price. */
  childRate: 69999,

  /** Flat per-infant package price. */
  infantRate: 29999,
};
