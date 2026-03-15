// ============================================================
// calculator.ts — Alimony estimation logic
// DISCLAIMER: Educational estimate only. Not legal advice.
// ============================================================

import { getStateByCode } from './states'

export interface CalculatorInputs {
  state: string           // 2-letter state code
  payorIncome: number     // annual gross income (payor/higher earner)
  payeeIncome: number     // annual gross income (payee/lower earner)
  yearsMarried: number
  assets: number          // total marital assets
}

export interface CalculatorResult {
  monthlyLow: number
  monthlyHigh: number
  annualLow: number
  annualHigh: number
  estimatedMonths: number
  stateName: string
  formula: string
  disclaimer: string
}

export function calculateAlimony(inputs: CalculatorInputs): CalculatorResult {
  const state = getStateByCode(inputs.state)
  const stateName = state?.name || inputs.state

  const { payorIncome, payeeIncome, yearsMarried } = inputs
  const incomeDiff = Math.max(0, payorIncome - payeeIncome)
  const monthlyIncomeDiff = incomeDiff / 12

  // Base calculation using state-specific percentages
  const pct = state?.incomeSharePct || 0.28
  const durationMultiplier = state?.maxYearsMultiplier || 0.4

  // Monthly amount: base is pct of income difference
  const baseMonthly = monthlyIncomeDiff * pct

  // Adjust for very short or very long marriages
  let adjustmentFactor = 1.0
  if (yearsMarried < 3) adjustmentFactor = 0.3
  else if (yearsMarried < 7) adjustmentFactor = 0.6
  else if (yearsMarried < 10) adjustmentFactor = 0.8
  else if (yearsMarried >= 20) adjustmentFactor = 1.2

  const monthlyEstimate = baseMonthly * adjustmentFactor

  // Range: ±20%
  const monthlyLow = Math.round(monthlyEstimate * 0.8)
  const monthlyHigh = Math.round(monthlyEstimate * 1.2)

  // Duration in months
  const estimatedMonths = Math.round(yearsMarried * durationMultiplier * 12)

  const formula = state?.formula || 'Based on income disparity and marriage length'

  return {
    monthlyLow,
    monthlyHigh,
    annualLow: monthlyLow * 12,
    annualHigh: monthlyHigh * 12,
    estimatedMonths,
    stateName,
    formula,
    disclaimer: `This is a rough educational estimate only — NOT legal advice. Actual alimony awards vary significantly based on individual circumstances, judicial discretion, negotiation, and ${stateName} law. Consult a licensed family law attorney for accurate guidance.`,
  }
}
