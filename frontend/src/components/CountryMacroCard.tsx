import React from 'react';
import { getCountryBusinessProfile } from '../countryIntelligence';
import { Building2, ShieldCheck, Clock, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Award } from 'lucide-react';

interface CountryMacroCardProps {
  country: string;
  city: string;
}

export const CountryMacroCard: React.FC<CountryMacroCardProps> = ({ country, city }) => {
  const profile = getCountryBusinessProfile(country);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {country} Business Setup & Macroeconomic Intelligence
            </h3>
            <p className="text-[11px] text-slate-400">
              Ease of doing business, corporate tax rates, and regulatory insights for starting a business in {city}, {country}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            Setup Score: {profile.ease_of_business_score}/100
          </span>
        </div>
      </div>

      {/* Key Quick Indicators Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <Clock className="h-3 w-3 text-brand-400" />
            <span>Setup Speed</span>
          </div>
          <div className="font-extrabold text-white text-sm">{profile.incorporation_time_days}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <DollarSign className="h-3 w-3 text-emerald-400" />
            <span>Corporate Tax</span>
          </div>
          <div className="font-bold text-emerald-400 text-xs">{profile.corporate_tax_rate}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <ShieldCheck className="h-3 w-3 text-brand-400" />
            <span>VAT / Sales Tax</span>
          </div>
          <div className="font-bold text-white text-xs">{profile.vat_rate}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3 text-amber-400" />
            <span>Purchasing Power</span>
          </div>
          <div className="font-bold text-slate-200 text-[11px]">{profile.purchasing_power_index}</div>
        </div>
      </div>

      {/* Positive Drivers vs Regulatory Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
        {/* Positive Drivers */}
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
          <div className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Key Positive Market Drivers (Pros)</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 pl-1">
            {profile.positive_drivers.map((pro, i) => (
              <li key={i} className="flex items-start space-x-1.5 leading-snug">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Regulatory Challenges */}
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
          <div className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Operating & Regulatory Considerations (Cons)</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 pl-1">
            {profile.regulatory_challenges.map((con, i) => (
              <li key={i} className="flex items-start space-x-1.5 leading-snug">
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Verdict */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center space-x-2">
        <span className="font-bold text-brand-400 shrink-0">AI Market Verdict:</span>
        <span className="text-slate-300 font-medium">{profile.market_verdict}</span>
      </div>
    </div>
  );
};
