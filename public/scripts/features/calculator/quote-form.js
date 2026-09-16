/**
 * Reads the calculator form into a plain quote object.
 *
 * Its only job is translating DOM state into data. Pricing rules live in
 * pricing.js and rendering lives in quote-view.js, so a markup change touches
 * this file alone.
 */
import { byId, checkedSum, checkedValue, intValue } from '../../utils/dom.js';

/**
 * Collects the current form values.
 *
 * Fallbacks match the original calculator: counts default to sensible minimums
 * so a blank field cannot produce NaN in the output.
 *
 * @returns {import('./pricing.js').QuoteInput}
 */
export function readQuoteInput() {
  const bookingAir = checkedValue('airTickets') === 'yes';

  return {
    adults: intValue('adults', 1),
    children: intValue('children', 0),
    infants: intValue('infants', 0),
    sharing: parseInt(checkedValue('sharing'), 10),
    visa: intValue('visa', 0),
    transport: intValue('transport', 0),
    makkahRate: intValue('makkahHotel', 0),
    makkahNights: intValue('makkahNights', 1),
    madinahRate: intValue('madinahHotel', 0),
    madinahNights: intValue('madinahNights', 1),
    laundryUnits: intValue('laundry', 0),
    spiritual: checkedSum('spiritual'),
    comfort: checkedSum('comfort'),
    premium: checkedSum('premium'),
    airfare: bookingAir ? intValue('airline', 0) + intValue('airport', 0) : 0,
  };
}

/**
 * Validates the form before a quote is produced.
 *
 * @returns {{valid: boolean, message?: string, focus?: HTMLElement}}
 */
export function validateQuoteForm() {
  const leadNameField = byId('leadPaxName');
  const leadName = leadNameField?.value.trim();

  if (!leadName) {
    return {
      valid: false,
      message: 'Please enter the Lead Pax Name.',
      focus: leadNameField ?? undefined,
    };
  }

  return { valid: true };
}
