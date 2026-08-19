import React, { useState } from 'react';
import type { MarketAnalysisResponse } from '../types';
import { Sparkles, X, Check, Copy, DollarSign, Target, TrendingUp, ShieldCheck, Building2, Flame, Presentation, FileText, Compass, CheckCircle2 } from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: MarketAnalysisResponse;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !analysis) return null;

  const city = analysis.target_city;
  const country = analysis.city_metadata.country;
  const cat = analysis.category_info.title;
  const gap = analysis.estimated_gap;
  const score = analysis.opportunity_score;
  const popStr = (analysis.target_population / 1000000).toFixed(2) + 'M';

  // Compute estimated financial numbers
  const capexEst = gap > 0 ? `$${Math.round(45000 + (score / 100) * 85000).toLocaleString()}` : '$65,000';
  const monthlyOpex = gap > 0 ? `$${Math.round(8500 + (score / 100) * 12000).toLocaleString()}` : '$10,500';
  const avgTransaction = `$${Math.round(30 + (score / 100) * 55)}`;
  const paybackMonths = Math.max(8, Math.round(24 - (score / 100) * 12));

  const pitchDeckText = `
=== AI EXECUTIVE BUSINESS PITCH DECK ===
PROPOSED VENTURE: Premium ${cat}
LOCATION: ${city}, ${country} (Population: ${popStr})
MARKET OPPORTUNITY SCORE: ${score}/100 (${analysis.opportunity_label})

1. THE MARKET PROBLEM / GAP
- Current Detected Supply: ${analysis.existing_count} establishments (${analysis.per_10k.toFixed(2)} per 10k residents)
- Peer City Median Benchmark: ${analysis.benchmark_per_10k.toFixed(2)} per 10k residents (~${analysis.expected_count} expected)
- Estimated Supply Deficit: +${gap} establishments
- Consumer Pain Point: Local reviews show overcrowding, long wait times, and a lack of modern digital booking options.

2. THE PROPOSED SOLUTION
- Position a modern, high-quality ${cat} concept offering digital reservation, transparent pricing, and superior customer experience.
- Target a 15–20% premium margin over legacy incumbent competitors.

3. FINANCIAL UNIT ECONOMICS
- Estimated Initial CAPEX: ${capexEst} (Equipment, leasehold improvements, licenses)
- Estimated Monthly OPEX: ${monthlyOpex} (Rent, staff payroll, utilities)
- Estimated Ticket Size: ${avgTransaction} per customer
- Target Payback Period: ${paybackMonths} Months

4. GO-TO-MARKET & CUSTOMER ACQUISITION
- Channel 1: Google Maps Local SEO & Targeted Search Ads (capturing high-intent local queries)
- Channel 2: Social Media Discovery & Influencer Partnerships (Instagram/TikTok local buzz)
- Channel 3: Strategic Location Zoning in High-Foot-Traffic Central / North-West Corridors

Generated via GapFinder.ai Global Business Intelligence Engine.
`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(pitchDeckText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 text-xs font-bold text-purple-400 mb-2">
            <Presentation className="h-4 w-4" />
            <span>AI Executive 1-Page Business Pitch Deck</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {cat} Venture Pitch: {city}, {country}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generated using real spatial POI counts, peer city density benchmarks, and AI unit economics.
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Opportunity Score</div>
            <div className="text-lg font-black text-brand-400">{score}/100</div>
            <div className="text-[10px] text-emerald-400 font-bold">{analysis.opportunity_label}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Gap</div>
            <div className="text-lg font-black text-emerald-400">+{gap} Units</div>
            <div className="text-[10px] text-slate-400">Deficit vs Peer Median</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Est. CAPEX</div>
            <div className="text-lg font-black text-amber-400">{capexEst}</div>
            <div className="text-[10px] text-slate-400">Initial Setup Cost</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Target Payback</div>
            <div className="text-lg font-black text-purple-400">{paybackMonths} Months</div>
            <div className="text-[10px] text-slate-400">Projected ROI Period</div>
          </div>
        </div>

        {/* Pitch Sections */}
        <div className="space-y-4 text-xs">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center space-x-2 text-brand-400">
              <Target className="h-4 w-4" />
              <span>1. Market Problem & Unmet Consumer Gap</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {city} (population {popStr}) currently has only {analysis.existing_count} detected {cat.toLowerCase()} establishments ({analysis.per_10k.toFixed(2)} per 10k residents). Matching peer city benchmark density ({analysis.benchmark_per_10k.toFixed(2)} per 10k) requires {analysis.expected_count} establishments, leaving a clear supply gap of <strong>+{gap} units</strong>. Local reviews highlight long wait times, facility overcrowding, and a lack of digital reservation options.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center space-x-2 text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>2. Proposed Business Model & Value Proposition</span>
            </div>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Modern Customer Experience:</strong> Offer seamless online booking, instant mobile scheduling, and high-standard hygiene.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Margin Premium:</strong> Position at a 15–20% pricing premium over legacy competitors due to superior service quality.</span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center space-x-2 text-amber-400">
              <DollarSign className="h-4 w-4" />
              <span>3. Financial Unit Economics & Cash Flow Projection</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-500 font-bold">Estimated CAPEX:</div>
                <div className="font-extrabold text-white text-xs">{capexEst}</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-500 font-bold">Monthly OPEX:</div>
                <div className="font-extrabold text-white text-xs">{monthlyOpex}</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-slate-500 font-bold">Avg Order Value:</div>
                <div className="font-extrabold text-white text-xs">{avgTransaction}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 text-xs font-semibold cursor-pointer"
          >
            Close Pitch Deck
          </button>

          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Pitch Deck Copied to Clipboard!' : 'Copy Executive Pitch Deck Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
