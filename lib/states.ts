// ============================================================
// states.ts — US state data & alimony law summaries
// ============================================================

export interface StateInfo {
  code: string
  name: string
  slug: string
  alimonyType: string[]
  maxDuration: string
  formula: string
  notes: string
  // For calculator
  incomeSharePct: number   // % of income difference used in formula
  maxYearsMultiplier: number  // multiplied by years married
}

export const STATES: StateInfo[] = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', alimonyType: ['Periodic', 'Lump-sum', 'Rehabilitative'], maxDuration: 'Discretionary', formula: 'Judge discretion; no set formula', notes: 'Alabama courts consider standard of living, earning capacity, and length of marriage.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'AK', name: 'Alaska', slug: 'alaska', alimonyType: ['Spousal Support'], maxDuration: 'Varies', formula: 'Based on need and ability to pay', notes: 'Alaska focuses on need-based support with consideration for rehabilitative needs.', incomeSharePct: 0.25, maxYearsMultiplier: 0.4 },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', alimonyType: ['Spousal Maintenance'], maxDuration: 'Discretionary', formula: 'Income difference × % based on years married', notes: 'Arizona uses a needs-based approach. Long marriages may yield longer awards.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas', alimonyType: ['Alimony'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'Arkansas courts have broad discretion in alimony awards.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'CA', name: 'California', slug: 'california', alimonyType: ['Temporary', 'Permanent', 'Rehabilitative'], maxDuration: 'Half the marriage for <10 years; indefinite for 10+ years', formula: '40% of higher earner - 50% of lower earner', notes: 'California uses a guideline formula. Marriages over 10 years may yield long-term support.', incomeSharePct: 0.40, maxYearsMultiplier: 0.6 },
  { code: 'CO', name: 'Colorado', slug: 'colorado', alimonyType: ['Maintenance'], maxDuration: 'Guidelines based on marriage length', formula: '40% of higher income - 50% of lower income', notes: 'Colorado has a statutory formula for guideline maintenance.', incomeSharePct: 0.40, maxYearsMultiplier: 0.5 },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut', alimonyType: ['Periodic Alimony', 'Lump-sum'], maxDuration: 'Discretionary', formula: 'Judge discretion based on multiple factors', notes: 'Connecticut courts weigh length of marriage, age, and earning capacity.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'DE', name: 'Delaware', slug: 'delaware', alimonyType: ['Alimony'], maxDuration: 'Up to 50% of marriage length', formula: 'Based on income disparity', notes: 'Delaware limits alimony duration to half the marriage length.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'FL', name: 'Florida', slug: 'florida', alimonyType: ['Bridge-the-gap', 'Rehabilitative', 'Durational', 'Permanent'], maxDuration: 'Up to marriage length; permanent for 17+ years', formula: 'Needs-based, income considered', notes: 'Florida recently reformed alimony law in 2023, eliminating permanent alimony.', incomeSharePct: 0.35, maxYearsMultiplier: 0.5 },
  { code: 'GA', name: 'Georgia', slug: 'georgia', alimonyType: ['Temporary', 'Permanent', 'Rehabilitative'], maxDuration: 'Discretionary', formula: 'Judge discretion; no formula', notes: 'Georgia bars alimony if recipient was at fault in the divorce.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii', alimonyType: ['Spousal Support'], maxDuration: 'Discretionary', formula: 'Need and ability to pay', notes: 'Hawaii courts focus on economic self-sufficiency.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'ID', name: 'Idaho', slug: 'idaho', alimonyType: ['Alimony'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'Idaho considers fault, standard of living, and earning capacity.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'IL', name: 'Illinois', slug: 'illinois', alimonyType: ['Maintenance'], maxDuration: 'Guidelines: % of marriage length', formula: '33% of payor income - 25% of payee income', notes: 'Illinois has a statutory formula and duration guidelines.', incomeSharePct: 0.33, maxYearsMultiplier: 0.5 },
  { code: 'IN', name: 'Indiana', slug: 'indiana', alimonyType: ['Spousal Maintenance'], maxDuration: 'Usually 3 years (rehabilitative)', formula: 'Needs-based', notes: 'Indiana rarely awards long-term alimony; usually rehabilitative only.', incomeSharePct: 0.20, maxYearsMultiplier: 0.3 },
  { code: 'IA', name: 'Iowa', slug: 'iowa', alimonyType: ['Spousal Support'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'Iowa weighs all relevant factors without a set formula.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'KS', name: 'Kansas', slug: 'kansas', alimonyType: ['Maintenance'], maxDuration: 'Up to 121 months', formula: 'Income-based', notes: 'Kansas caps maintenance at 121 months unless extended by agreement.', incomeSharePct: 0.25, maxYearsMultiplier: 0.4 },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky', alimonyType: ['Maintenance'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Kentucky focuses on financial need and ability to pay.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana', alimonyType: ['Interim Periodic Support', 'Final Periodic Support'], maxDuration: 'Up to 1/3 of marriage length', formula: 'Needs-based, capped at 1/3 marriage length', notes: 'Louisiana strictly limits alimony and considers fault.', incomeSharePct: 0.25, maxYearsMultiplier: 0.33 },
  { code: 'ME', name: 'Maine', slug: 'maine', alimonyType: ['General Support', 'Transitional', 'Reimbursement', 'Nominal'], maxDuration: 'Up to 50% of marriage length (for <10 year marriages)', formula: 'Income disparity based', notes: 'Maine has detailed alimony statutes with multiple award types.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'MD', name: 'Maryland', slug: 'maryland', alimonyType: ['Rehabilitative', 'Indefinite'], maxDuration: 'Rehabilitative: discretionary; Indefinite: exceptional circumstances', formula: 'Judge discretion with statutory factors', notes: 'Maryland rarely awards indefinite alimony.', incomeSharePct: 0.25, maxYearsMultiplier: 0.4 },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts', alimonyType: ['General Term', 'Rehabilitative', 'Reimbursement', 'Transitional'], maxDuration: 'Based on marriage length (50-80%)', formula: '30-35% of income difference', notes: 'Massachusetts has detailed alimony reform laws with durational limits.', incomeSharePct: 0.30, maxYearsMultiplier: 0.6 },
  { code: 'MI', name: 'Michigan', slug: 'michigan', alimonyType: ['Spousal Support'], maxDuration: 'Discretionary', formula: 'Judge discretion; 14 statutory factors', notes: 'Michigan courts weigh 14 factors including fault and earning capacity.', incomeSharePct: 0.28, maxYearsMultiplier: 0.5 },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota', alimonyType: ['Maintenance'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Minnesota has no set formula; courts weigh financial need.', incomeSharePct: 0.30, maxYearsMultiplier: 0.4 },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi', alimonyType: ['Periodic', 'Lump-sum', 'Rehabilitative', 'Reimbursement'], maxDuration: 'Discretionary', formula: 'Judge discretion; considers fault', notes: 'Mississippi considers marital fault in alimony awards.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'MO', name: 'Missouri', slug: 'missouri', alimonyType: ['Maintenance'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Missouri courts focus on need and ability to pay.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'MT', name: 'Montana', slug: 'montana', alimonyType: ['Maintenance'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Montana follows the Uniform Marriage and Divorce Act.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska', alimonyType: ['Alimony'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'Nebraska courts consider all relevant factors.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'NV', name: 'Nevada', slug: 'nevada', alimonyType: ['Alimony'], maxDuration: 'Up to marriage length', formula: 'Discretionary; income-based', notes: 'Nevada does not consider fault in alimony determinations.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire', alimonyType: ['Alimony'], maxDuration: '50% of marriage length', formula: '30% of gross income difference', notes: 'New Hampshire uses a percentage formula with 50% duration cap.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey', alimonyType: ['Open Duration', 'Limited Duration', 'Rehabilitative', 'Reimbursement'], maxDuration: 'Open duration for 20+ year marriages; limited for shorter', formula: 'Up to 1/3 of income difference', notes: 'New Jersey eliminated "permanent alimony" in 2014 reform.', incomeSharePct: 0.33, maxYearsMultiplier: 0.55 },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico', alimonyType: ['Spousal Support'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'New Mexico courts consider income, earning capacity, and standard of living.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'NY', name: 'New York', slug: 'new-york', alimonyType: ['Temporary Maintenance', 'Post-Divorce Maintenance'], maxDuration: 'Guidelines based on marriage length', formula: '30% of payor - 20% of payee (up to cap)', notes: 'New York has statutory formulas for both temporary and post-divorce maintenance.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina', alimonyType: ['Alimony', 'Post-Separation Support'], maxDuration: 'Discretionary', formula: 'Judge discretion; fault considered', notes: 'North Carolina considers marital fault and bars alimony for adulterous spouses.', incomeSharePct: 0.30, maxYearsMultiplier: 0.4 },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota', alimonyType: ['Spousal Support'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'North Dakota courts focus on need and ability to pay.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'OH', name: 'Ohio', slug: 'ohio', alimonyType: ['Spousal Support'], maxDuration: 'Discretionary', formula: 'Judge discretion; 14 factors', notes: 'Ohio does not have a set formula; judges weigh 14 statutory factors.', incomeSharePct: 0.28, maxYearsMultiplier: 0.45 },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma', alimonyType: ['Support Alimony', 'Property Alimony'], maxDuration: 'Support: up to marriage length', formula: 'Needs-based', notes: 'Oklahoma limits support alimony to the length of the marriage.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'OR', name: 'Oregon', slug: 'oregon', alimonyType: ['Spousal Support'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Oregon has transitional, compensatory, and maintenance support types.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', alimonyType: ['Alimony', 'Alimony Pendente Lite', 'APL'], maxDuration: 'Discretionary; cohabitation ends award', formula: 'Judge discretion; 17 factors', notes: 'Pennsylvania automatically ends alimony upon recipient cohabitation.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island', alimonyType: ['Alimony'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'Rhode Island courts have broad discretion with no statutory formula.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina', alimonyType: ['Periodic', 'Lump-sum', 'Rehabilitative', 'Reimbursement'], maxDuration: 'Discretionary; bars adulterous spouses', formula: 'Judge discretion', notes: 'South Carolina bars alimony for adulterous spouses.', incomeSharePct: 0.30, maxYearsMultiplier: 0.4 },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota', alimonyType: ['Alimony'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'South Dakota courts weigh multiple factors without a set formula.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee', alimonyType: ['Transitional', 'Rehabilitative', 'Periodic', 'In Solido'], maxDuration: 'Periodic: not to exceed marriage length', formula: 'Judge discretion', notes: 'Tennessee caps periodic alimony at the length of the marriage.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'TX', name: 'Texas', slug: 'texas', alimonyType: ['Spousal Maintenance'], maxDuration: 'Up to 5 years (0-10 yr marriage), 7 years (10-20 yr), max 10 years', formula: 'Lesser of $5,000/mo or 20% of gross monthly income', notes: 'Texas has one of the most restrictive alimony statutes in the country.', incomeSharePct: 0.20, maxYearsMultiplier: 0.35 },
  { code: 'UT', name: 'Utah', slug: 'utah', alimonyType: ['Alimony'], maxDuration: 'Up to marriage length', formula: 'Needs-based; income standard considered', notes: 'Utah limits alimony to the length of the marriage.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'VT', name: 'Vermont', slug: 'vermont', alimonyType: ['Maintenance'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Vermont courts focus on economic self-sufficiency.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'VA', name: 'Virginia', slug: 'virginia', alimonyType: ['Periodic', 'Lump-sum', 'Rehabilitative'], maxDuration: 'Discretionary; fault considered', formula: 'Judge discretion', notes: 'Virginia considers fault; adultery may bar alimony entirely.', incomeSharePct: 0.28, maxYearsMultiplier: 0.45 },
  { code: 'WA', name: 'Washington', slug: 'washington', alimonyType: ['Maintenance'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Washington is a community property state; no set alimony formula.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia', alimonyType: ['Alimony'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'West Virginia courts consider multiple factors including fault.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin', alimonyType: ['Maintenance'], maxDuration: 'Discretionary', formula: 'Needs-based', notes: 'Wisconsin is a community property state with no alimony formula.', incomeSharePct: 0.28, maxYearsMultiplier: 0.4 },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming', alimonyType: ['Alimony'], maxDuration: 'Discretionary', formula: 'Judge discretion', notes: 'Wyoming courts weigh earning capacity, length of marriage, and standard of living.', incomeSharePct: 0.25, maxYearsMultiplier: 0.4 },
  { code: 'DC', name: 'District of Columbia', slug: 'district-of-columbia', alimonyType: ['Spousal Support', 'Rehabilitative', 'Indefinite'], maxDuration: 'Discretionary; indefinite for long marriages', formula: 'Needs-based; income disparity considered', notes: 'DC courts award spousal support based on financial need and ability to pay. Long marriages may yield indefinite support. DC follows federal guidelines and Superior Court discretion.', incomeSharePct: 0.30, maxYearsMultiplier: 0.5 },
]

export function getStateBySlug(slug: string): StateInfo | undefined {
  return STATES.find(s => s.slug === slug)
}

export function getStateByCode(code: string): StateInfo | undefined {
  return STATES.find(s => s.code === code.toUpperCase())
}

export function getAllStateSlugs(): string[] {
  return STATES.map(s => s.slug)
}
