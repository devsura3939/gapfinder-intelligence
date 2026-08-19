/**
 * Country & City Business Intelligence Registry for Global Business Gap Finder.
 * Provides macroeconomic indicators, tax rates, corporate incorporation speed,
 * regulatory factors, and pros/cons for starting a business in each country/city.
 */

export interface CountryBusinessProfile {
  country: string;
  ease_of_business_score: number; // 0-100
  incorporation_time_days: string;
  corporate_tax_rate: string;
  vat_rate: string;
  purchasing_power_index: string;
  positive_drivers: string[];
  regulatory_challenges: string[];
  market_verdict: string;
}

const COUNTRY_PROFILES_MAP: Record<string, CountryBusinessProfile> = {
  Belarus: {
    country: 'Belarus',
    ease_of_business_score: 74,
    incorporation_time_days: '1–2 Business Days',
    corporate_tax_rate: '20% (High-Tech Park HTP: 0% tax on IT/Export)',
    vat_rate: '20%',
    purchasing_power_index: 'Moderate ($21,500 GDP PPP per capita)',
    positive_drivers: [
      'Fast 1-day online business registration',
      'Strong technical & engineering workforce',
      'High urban population density in Minsk, Brest, Grodno & Gomel',
      'High consumer demand for modern dining, fitness, and beauty'
    ],
    regulatory_challenges: [
      'Currency exchange controls & banking regulations',
      'State municipal licensing for food/health'
    ],
    market_verdict: 'Good potential for local consumer services, cafes, sports, and technical maintenance.'
  },
  Lithuania: {
    country: 'Lithuania',
    ease_of_business_score: 83,
    incorporation_time_days: '1–3 Business Days',
    corporate_tax_rate: '15% (5% for small companies under 10 employees & €300k turnover)',
    vat_rate: '21%',
    purchasing_power_index: 'High ($44,000 GDP PPP per capita)',
    positive_drivers: [
      '5% reduced CIT rate for small businesses & micro-enterprises',
      'Leading Fintech & digital hub in Northern/Eastern Europe',
      'Instant online 1-day registration via Centre of Registers',
      'High purchasing power in Vilnius, Kaunas & Klaipeda'
    ],
    regulatory_challenges: [
      'Competitive domestic tech & service landscape',
      'Tight labor market for specialized staff'
    ],
    market_verdict: 'Highly favorable European environment with low 5% tax rates for small ventures.'
  },
  Georgia: {
    country: 'Georgia',
    ease_of_business_score: 88,
    incorporation_time_days: '1 Business Day',
    corporate_tax_rate: '15% (Estonian Model: 0% on reinvested profit)',
    vat_rate: '18%',
    purchasing_power_index: 'Moderate ($18,500 GDP PPP per capita)',
    positive_drivers: [
      'Top 10 globally for Ease of Doing Business (World Bank)',
      '0% corporate tax on reinvested business profits',
      'Instant 1-day business registration & low bureaucracy',
      'Growing international expat, tourism & digital nomad hub'
    ],
    regulatory_challenges: [
      'Smaller domestic consumer population outside Tbilisi & Batumi',
      'Currency fluctuation risk (GEL)'
    ],
    market_verdict: 'Highly favorable environment for foreign entrepreneurs and service startups.'
  },
  Spain: {
    country: 'Spain',
    ease_of_business_score: 78,
    incorporation_time_days: '7–10 Days',
    corporate_tax_rate: '25% (15% for new startups during first 2 profitable years)',
    vat_rate: '21%',
    purchasing_power_index: 'High ($46,000 GDP PPP per capita)',
    positive_drivers: [
      'Startup Act offering 15% reduced tax rate for new ventures',
      'Massive annual tourist influx (>85M visitors/year)',
      'High lifestyle appeal & strong local dining/leisure spending'
    ],
    regulatory_challenges: [
      'Higher social security contributions for self-employed (autónomo)',
      'Regional municipal licensing & health permits'
    ],
    market_verdict: 'Excellent consumer market for hospitality, fitness, beauty, and pet services.'
  },
  Germany: {
    country: 'Germany',
    ease_of_business_score: 82,
    incorporation_time_days: '8–14 Days',
    corporate_tax_rate: '15% + Trade Tax (~30% effective)',
    vat_rate: '19%',
    purchasing_power_index: 'Very High ($63,000 GDP PPP per capita)',
    positive_drivers: [
      'Europe’s largest consumer economy with premium purchasing power',
      'Stable legal framework & strong consumer contract compliance',
      'High willingness to pay for premium & wellness services'
    ],
    regulatory_challenges: [
      'Notary requirements for UG/GmbH incorporation',
      'Strict labor laws & data privacy regulations (GDPR)'
    ],
    market_verdict: 'Ideal for premium, high-margin, fitness, healthcare, and tech services.'
  },
  Poland: {
    country: 'Poland',
    ease_of_business_score: 77,
    incorporation_time_days: '3–5 Days',
    corporate_tax_rate: '19% (9% for small businesses under €2M turnover)',
    vat_rate: '23%',
    purchasing_power_index: 'High ($42,000 GDP PPP per capita)',
    positive_drivers: [
      'Reduced 9% CIT rate for small & medium enterprises (SMEs)',
      'Booming tech hub with fast-growing middle class consumer spending',
      'Digital online S24 incorporation system'
    ],
    regulatory_challenges: [
      'Complex tax compliance updates (Polish Order tax reforms)',
      'Competitive domestic retail landscape'
    ],
    market_verdict: 'Strong growth market with competitive operating costs in Central Europe.'
  },
  'United Kingdom': {
    country: 'United Kingdom',
    ease_of_business_score: 85,
    incorporation_time_days: '1–2 Days',
    corporate_tax_rate: '19%–25%',
    vat_rate: '20%',
    purchasing_power_index: 'Very High ($56,000 GDP PPP per capita)',
    positive_drivers: [
      'Companies House 24-hour online incorporation',
      'World-class financial infrastructure & venture capital access',
      'English legal system with transparent commercial dispute resolution'
    ],
    regulatory_challenges: [
      'High commercial property rents in London & major hubs',
      'Post-Brexit import/export compliance procedures'
    ],
    market_verdict: 'Top Tier market for scaling high-value consumer brands and tech services.'
  },
  France: {
    country: 'France',
    ease_of_business_score: 76,
    incorporation_time_days: '5–8 Days',
    corporate_tax_rate: '25% (15% on profits up to €42,500 for SMEs)',
    vat_rate: '20%',
    purchasing_power_index: 'High ($54,000 GDP PPP per capita)',
    positive_drivers: [
      '15% SME preferential tax rate',
      'Strong public support programs & R&D tax credits (CIR)',
      'High consumer spending in culinary, fashion, and leisure'
    ],
    regulatory_challenges: [
      'Social charges on employee salaries (~40–45%)',
      'Strict labor market regulations'
    ],
    market_verdict: 'Matures, lucrative market requiring careful margin & payroll planning.'
  },
  Italy: {
    country: 'Italy',
    ease_of_business_score: 75,
    incorporation_time_days: '5–9 Days',
    corporate_tax_rate: '24% (IRES) + 3.9% (IRAP)',
    vat_rate: '22%',
    purchasing_power_index: 'High ($49,000 GDP PPP per capita)',
    positive_drivers: [
      'Innovative Startup Act (Innova Startup) tax incentives',
      'Global leader in tourism, design, and food culture',
      'Strong local community loyalty for independent businesses'
    ],
    regulatory_challenges: [
      'Regional municipal bureaucracy for commercial opening permits',
      'Slower judicial enforcement for commercial contracts'
    ],
    market_verdict: 'High reward for well-located boutique, hospitality, and specialized retail concepts.'
  },
  Norway: {
    country: 'Norway',
    ease_of_business_score: 84,
    incorporation_time_days: '2–4 Days',
    corporate_tax_rate: '22%',
    vat_rate: '25%',
    purchasing_power_index: 'Exceptional ($82,000 GDP PPP per capita)',
    positive_drivers: [
      'One of the world’s highest disposable incomes per capita',
      'Near 100% cashless digital economy & Altinn government portal',
      'High consumer demand for pet care, outdoor, and wellness services'
    ],
    regulatory_challenges: [
      'High wage floor & labor costs',
      'High general price level for commercial inventory'
    ],
    market_verdict: 'Exceptional purchasing power allowing high retail price margins.'
  },
  'United States': {
    country: 'United States',
    ease_of_business_score: 87,
    incorporation_time_days: '1–3 Days',
    corporate_tax_rate: '21% Federal + State tax (0% in TX, FL, NV, WY)',
    vat_rate: '0% Federal (0%–10% State Sales Tax)',
    purchasing_power_index: 'Exceptional ($80,000 GDP PPP per capita)',
    positive_drivers: [
      'Massive single market with unprecedented consumer spending',
      'Flexible state corporate laws (Delaware LLC/C-Corp)',
      '0% state income tax in Texas, Florida, Nevada & Wyoming'
    ],
    regulatory_challenges: [
      'Complex multi-state sales tax compliance',
      'High commercial litigation & insurance costs'
    ],
    market_verdict: 'Premier global market for scaling high-growth franchise & service concepts.'
  },
  Japan: {
    country: 'Japan',
    ease_of_business_score: 79,
    incorporation_time_days: '8–12 Days',
    corporate_tax_rate: '23.2% (Effective ~30%)',
    vat_rate: '10%',
    purchasing_power_index: 'High ($48,000 GDP PPP per capita)',
    positive_drivers: [
      'Ultra-dense urban foot traffic in Tokyo, Osaka & Yokohama',
      'Unmatched customer loyalty & high repeat patronage',
      'Startup Visa program for foreign entrepreneurs'
    ],
    regulatory_challenges: [
      'Notary & physical seal (Inkan) registration requirements',
      'Japanese language proficiency required for local banking'
    ],
    market_verdict: 'Outstanding long-term customer value for high-quality, reliable service models.'
  }
};

export function getCountryBusinessProfile(country: string): CountryBusinessProfile {
  const c = country.trim();
  if (COUNTRY_PROFILES_MAP[c]) {
    return COUNTRY_PROFILES_MAP[c];
  }

  // Fallback for unlisted countries
  return {
    country: c,
    ease_of_business_score: 75,
    incorporation_time_days: '3–7 Days',
    corporate_tax_rate: '18%–25%',
    vat_rate: '18%–20%',
    purchasing_power_index: 'Moderate to High',
    positive_drivers: [
      'Growing urban consumer demand for specialized services',
      'Favorable local demographic & economic development',
      'Digital business registration portals available'
    ],
    regulatory_challenges: [
      'Standard municipal business permit verification required',
      'Local tax registration compliance'
    ],
    market_verdict: 'Viable market for service expansion subject to local zoning & permit checks.'
  };
}
