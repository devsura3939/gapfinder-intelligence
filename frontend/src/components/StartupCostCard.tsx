import React from 'react';
import { estimateStartupFinancials } from '../financialEstimator';
import { DollarSign, Building2, Users, FileText, Wrench, Clock, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface StartupCostCardProps {
  categoryId: string;
  categoryTitle: string;
  city: string;
  country: string;
  opportunityScore: number;
  estimatedGap: number;
}

export const StartupCostCard: React.FC<StartupCostCardProps> = ({
  categoryId,
  categoryTitle,
  city,
  country,
  opportunityScore,
  estimatedGap
}) => {
  const fin = estimateStartupFinancials(
    categoryId,
    categoryTitle,
    city,
    country,
    opportunityScore,
    estimatedGap
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              AI Startup Cost & Financial ROI Prediction
            </h3>
            <p className="text-[11px] text-slate-400">
              Location-adjusted capital requirements, 6-month operating runway, and ROI payback period for {categoryTitle} in {city}, {country}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-500/20">
            {fin.financial_feasibility_tier}
          </span>
        </div>
      </div>

      {/* Total Capital Hero Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-brand-950/40 to-slate-950 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Initial Capital Required (Including 6-Mo Runway)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            ${fin.total_initial_capital.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Covers business registration, 6 months rent, 6 months salaries, equipment & working capital.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-brand-400 flex items-center justify-end space-x-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Predicted ROI Payback</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-0.5">
            ~{fin.predicted_payback_months} Months
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
            Est. Rev: ${fin.estimated_monthly_revenue.toLocaleString()}/mo
          </div>
        </div>
      </div>

      {/* Sub-Costs Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* 6-Month Rent */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <Building2 className="h-3 w-3 text-brand-400" />
            <span>6-Month Rent</span>
          </div>
          <div className="font-extrabold text-white text-sm">
            ${fin.six_month_rent.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            (${fin.monthly_rent_estimate.toLocaleString()}/mo)
          </div>
        </div>

        {/* 6-Month Payroll */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <Users className="h-3 w-3 text-brand-400" />
            <span>6-Month Salaries</span>
          </div>
          <div className="font-extrabold text-white text-sm">
            ${fin.six_month_payroll.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            (${fin.monthly_payroll_estimate.toLocaleString()}/mo)
          </div>
        </div>

        {/* Equipment & Inventory */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <Wrench className="h-3 w-3 text-brand-400" />
            <span>Equipment & Materials</span>
          </div>
          <div className="font-extrabold text-white text-sm">
            ${fin.equipment_inventory_cost.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Initial Fit-out & Tools
          </div>
        </div>

        {/* Registration & Fees */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center space-x-1">
            <FileText className="h-3 w-3 text-brand-400" />
            <span>Registration & Legal</span>
          </div>
          <div className="font-extrabold text-white text-sm">
            ${fin.registration_cost.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Incorporation & Permits
          </div>
        </div>
      </div>
    </div>
  );
};
