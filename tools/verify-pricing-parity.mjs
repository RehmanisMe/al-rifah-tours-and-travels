/**
 * Proves the refactored pricing module returns exactly the same numbers as the
 * original calculator.js, across randomised inputs and edge cases.
 *
 * Run:  node tools/verify-pricing-parity.mjs
 */
import { calculateQuote } from '../public/scripts/features/calculator/pricing.js';

/** The original implementation, copied verbatim from the pre-refactor calculator.js. */
function originalTotals(i) {
  const transportPerPerson = i.transport / i.adults;
  const makkahPerPerson = (i.makkahRate * i.makkahNights) / i.sharing;
  const madinahPerPerson = (i.madinahRate * i.madinahNights) / i.sharing;
  const totalNights = i.makkahNights + i.madinahNights;
  const mealsCost = totalNights * 2000;
  const laundryCost = i.laundryUnits * 1000;
  const perAdultCost =
    i.visa + transportPerPerson + makkahPerPerson + madinahPerPerson + mealsCost +
    laundryCost + i.spiritual + i.comfort + i.premium + i.airfare;
  const childrenCost = i.children * 69999;
  const infantsCost = i.infants * 29999;
  const totalCost = perAdultCost * i.adults + childrenCost + infantsCost;

  return {
    transportPerPerson, makkahPerPerson, madinahPerPerson,
    meals: mealsCost, laundry: laundryCost,
    perAdult: perAdultCost, childrenTotal: childrenCost,
    infantsTotal: infantsCost, total: totalCost,
  };
}

const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (arr) => arr[rand(0, arr.length - 1)];

function randomInput() {
  return {
    adults: rand(1, 12),
    children: rand(0, 6),
    infants: rand(0, 4),
    sharing: pick([1, 2, 3, 4, 5]),
    visa: pick([0, 15000, 22000, 30000]),
    transport: pick([0, 25000, 60000, 150000]),
    makkahRate: pick([0, 8000, 15000, 40000]),
    makkahNights: rand(1, 10),
    madinahRate: pick([0, 6000, 12000, 35000]),
    madinahNights: rand(1, 10),
    laundryUnits: rand(0, 10),
    spiritual: pick([0, 2500, 7000]),
    comfort: pick([0, 1500, 9000]),
    premium: pick([0, 5000, 25000]),
    airfare: pick([0, 45000, 78000]),
  };
}

const edgeCases = [
  // Single traveller, nothing optional selected.
  { adults: 1, children: 0, infants: 0, sharing: 1, visa: 0, transport: 0, makkahRate: 0,
    makkahNights: 1, madinahRate: 0, madinahNights: 1, laundryUnits: 0, spiritual: 0,
    comfort: 0, premium: 0, airfare: 0 },
  // Large group sharing quad rooms, everything selected.
  { adults: 12, children: 6, infants: 4, sharing: 4, visa: 30000, transport: 150000,
    makkahRate: 40000, makkahNights: 10, madinahRate: 35000, madinahNights: 10,
    laundryUnits: 10, spiritual: 7000, comfort: 9000, premium: 25000, airfare: 78000 },
  // Division that does not land on a whole rupee.
  { adults: 3, children: 0, infants: 0, sharing: 3, visa: 1, transport: 10000,
    makkahRate: 10000, makkahNights: 7, madinahRate: 5000, madinahNights: 3,
    laundryUnits: 1, spiritual: 0, comfort: 0, premium: 0, airfare: 0 },
];

const cases = [...edgeCases, ...Array.from({ length: 20000 }, randomInput)];

let mismatches = 0;
for (const input of cases) {
  const expected = originalTotals(input);
  const actual = calculateQuote(input);

  const checks = {
    transportPerPerson: actual.transportPerPerson,
    makkahPerPerson: actual.makkahPerPerson,
    madinahPerPerson: actual.madinahPerPerson,
    meals: actual.meals,
    laundry: actual.laundry,
    perAdult: actual.perAdult,
    childrenTotal: actual.children.total,
    infantsTotal: actual.infants.total,
    total: actual.total,
  };

  for (const [key, value] of Object.entries(checks)) {
    if (value !== expected[key]) {
      mismatches += 1;
      if (mismatches <= 5) {
        console.error(`MISMATCH ${key}: expected ${expected[key]}, got ${value}`);
        console.error('  input:', JSON.stringify(input));
      }
    }
  }
}

console.log(`compared ${cases.length} quotes (${edgeCases.length} edge cases + randomised)`);
console.log(
  mismatches === 0
    ? 'PASS - refactored pricing is identical to the original, to the exact float.'
    : `FAIL - ${mismatches} mismatched value(s).`
);
process.exit(mismatches === 0 ? 0 : 1);
