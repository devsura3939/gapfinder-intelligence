/**
 * AI Startup Cost Estimator & Financial Feasibility Predictor for Global Business Gap Finder.
 * Computes location-adjusted capital requirements, 6-month rent, payroll, registration,
 * equipment costs, and predicted ROI payback period based on GDP, local salaries, and demand gaps.
 */

export interface StartupCostEstimate {
  category_id: string;
  category_title: string;
  city: string;
  country: string;
  currency: string;
  registration_cost: number;
  monthly_rent_estimate: number;
  six_month_rent: number;
  monthly_payroll_estimate: number;
  six_month_payroll: number;
  equipment_inventory_cost: number;
  working_capital_buffer: number;
  total_initial_capital: number;
  estimated_monthly_revenue: number;
  predicted_payback_months: number;
  financial_feasibility_tier: string;
}

// Country salary & rent cost multipliers (relative to baseline)
const COUNTRY_COST_INDEX: Record<string, { salary_monthly: number; rent_sqm: number; reg_cost: number }> = {
  Georgia: { salary_monthly: 650, rent_sqm: 14, reg_cost: 80 },
  Spain: { salary_monthly: 1850, rent_sqm: 22, reg_cost: 320 },
  Germany: { salary_monthly: 3200, rent_sqm: 35, reg_cost: 480 },
  Poland: { salary_monthly: 1550, rent_sqm: 18, reg_cost: 220 },
  'United Kingdom': { salary_monthly: 3400, rent_sqm: 42, reg_cost: 150 },
  France: { salary_monthly: 2600, rent_sqm: 32, reg_cost: 350 },
  Italy: { salary_monthly: 2200, rent_sqm: 25, reg_cost: 380 },
  Norway: { salary_monthly: 4500, rent_sqm: 48, reg_cost: 280 },
  'United States': { salary_monthly: 4200, rent_sqm: 45, reg_cost: 200 },
  Japan: { salary_monthly: 2800, rent_sqm: 38, reg_cost: 400 },
  Armenia: { salary_monthly: 550, rent_sqm: 12, reg_cost: 60 },
  Bulgaria: { salary_monthly: 950, rent_sqm: 12, reg_cost: 120 },
  Albania: { salary_monthly: 600, rent_sqm: 10, reg_cost: 70 },
  Croatia: { salary_monthly: 1250, rent_sqm: 15, reg_cost: 200 },
  Serbia: { salary_monthly: 850, rent_sqm: 12, reg_cost: 110 },
  'Czech Republic': { salary_monthly: 1750, rent_sqm: 22, reg_cost: 250 },
  Hungary: { salary_monthly: 1350, rent_sqm: 16, reg_cost: 180 },
  Romania: { salary_monthly: 1150, rent_sqm: 14, reg_cost: 150 }
};

// Category equipment & square meter baseline requirements
const CATEGORY_EQUIPMENT_INDEX: Record<string, { equipment: number; staff_count: number; area_sqm: number }> = {
  pet_grooming: { equipment: 12000, staff_count: 2, area_sqm: 55 },
  pet_store: { equipment: 18000, staff_count: 2, area_sqm: 80 },
  veterinarian: { equipment: 45000, staff_count: 3, area_sqm: 110 },
  bar_pub: { equipment: 32000, staff_count: 4, area_sqm: 120 },
  cafe: { equipment: 22000, staff_count: 3, area_sqm: 75 },
  coffee_shop: { equipment: 18000, staff_count: 2, area_sqm: 50 },
  restaurant: { equipment: 55000, staff_count: 6, area_sqm: 160 },
  fast_food: { equipment: 28000, staff_count: 3, area_sqm: 70 },
  bakery: { equipment: 25000, staff_count: 3, area_sqm: 65 },
  hair_salon: { equipment: 15000, staff_count: 3, area_sqm: 60 },
  barber: { equipment: 12000, staff_count: 2, area_sqm: 45 },
  nail_salon: { equipment: 8000, staff_count: 3, area_sqm: 40 },
  spa_massage: { equipment: 22000, staff_count: 3, area_sqm: 90 },
  dentist: { equipment: 75000, staff_count: 3, area_sqm: 120 },
  dental_clinic: { equipment: 75000, staff_count: 3, area_sqm: 120 },
  gym: { equipment: 65000, staff_count: 4, area_sqm: 280 },
  yoga_pilates: { equipment: 14000, staff_count: 2, area_sqm: 100 },
  cinema: { equipment: 140000, staff_count: 5, area_sqm: 450 },
  laundry: { equipment: 35000, staff_count: 1, area_sqm: 70 },
  coworking: { equipment: 28000, staff_count: 2, area_sqm: 200 },
  pharmacy: { equipment: 30000, staff_count: 2, area_sqm: 85 },
  hotel: { equipment: 120000, staff_count: 8, area_sqm: 500 }
};

export function estimateStartupFinancials(
  category_id: string,
  category_title: string,
  city: string,
  country: string,
  opportunityScore: number,
  estimatedGap: number
): StartupCostEstimate {
  const cInfo = COUNTRY_COST_INDEX[country] || { salary_monthly: 1800, rent_sqm: 22, reg_cost: 250 };
  const catReq = CATEGORY_EQUIPMENT_INDEX[category_id] || { equipment: 20000, staff_count: 3, area_sqm: 70 };

  const regCost = cInfo.reg_cost;
  const monthlyRent = Math.round(catReq.area_sqm * cInfo.rent_sqm);
  const sixMonthRent = monthlyRent * 6;

  const monthlyPayroll = Math.round(catReq.staff_count * cInfo.salary_monthly);
  const sixMonthPayroll = monthlyPayroll * 6;

  const equipmentCost = catReq.equipment;
  const workingCapital = Math.round((monthlyRent + monthlyPayroll) * 2);

  const totalCapital = regCost + sixMonthRent + sixMonthPayroll + equipmentCost + workingCapital;

  // Monthly revenue estimate based on demand gap and purchasing power
  const baseMonthlyRev = (monthlyRent + monthlyPayroll) * 1.5;
  const gapBoost = Math.min(Math.max(estimatedGap / 50, 0.2), 1.8);
  const estimatedMonthlyRev = Math.round(baseMonthlyRev * (1 + gapBoost * 0.4));

  const monthlyNetProfit = Math.max(estimatedMonthlyRev - (monthlyRent + monthlyPayroll + estimatedMonthlyRev * 0.15), 1000);
  const paybackMonths = Math.min(Math.max(Math.round(totalCapital / monthlyNetProfit), 8), 36);

  let feasibilityTier = 'High Feasibility';
  if (paybackMonths <= 14) feasibilityTier = 'Exceptional Feasibility (Rapid ROI)';
  else if (paybackMonths <= 22) feasibilityTier = 'High Feasibility';
  else if (paybackMonths <= 30) feasibilityTier = 'Moderate Feasibility';
  else feasibilityTier = 'Capital Intensive';

  return {
    category_id,
    category_title,
    city,
    country,
    currency: 'USD ($)',
    registration_cost: regCost,
    monthly_rent_estimate: monthlyRent,
    six_month_rent: sixMonthRent,
    monthly_payroll_estimate: monthlyPayroll,
    six_month_payroll: sixMonthPayroll,
    equipment_inventory_cost: equipmentCost,
    working_capital_buffer: workingCapital,
    total_initial_capital: totalCapital,
    estimated_monthly_revenue: estimatedMonthlyRev,
    predicted_payback_months: paybackMonths,
    financial_feasibility_tier: feasibilityTier
  };
}
