import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch, COUNTRY_CITIES_MAP } from './components/HeroSearch';
import { MapView } from './components/MapView';
import { KpiCard } from './components/KpiCard';
import { PeerChart } from './components/PeerChart';
import { SupplyGauge } from './components/SupplyGauge';
import { BusinessList } from './components/BusinessList';
import { OpportunityScanner } from './components/OpportunityScanner';
import { CountryCityComparison } from './components/CountryCityComparison';
import { MethodologyModal } from './components/MethodologyModal';
import { CountryMacroCard } from './components/CountryMacroCard';
import { StartupCostCard } from './components/StartupCostCard';
import { DemandScoreCard } from './components/DemandScoreCard';
import { PitchDeckModal } from './components/PitchDeckModal';
import { runClientSideAnalysis, runClientSideOpportunities, getStoredAnalysisResult, encodeAnalysisPayload, decodeAnalysisPayload, getGoogleMapsProfileUrl } from './clientEngine';
import { MASTER_CATEGORIES_DATA, CATEGORY_FAMILIES_DATA } from './categoriesData';

import type {
  CategoryInfo,
  CategoryFamily,
  MarketAnalysisResponse,
  OpportunitiesScanResponse,
  Place
} from './types';

import {
  Building2,
  Target,
  TrendingUp,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  Sparkles,
  AlertTriangle,
  X,
  Loader2,
  Flame,
  Share2,
  Check,
  Presentation,
  Search,
  Compass,
  ArrowRight
} from 'lucide-react';

export function App() {
  const [mode, setMode] = useState<'analyze' | 'discover'>('analyze');
  const [country, setCountry] = useState<string>('Portugal');
  const [city, setCity] = useState<string>('Lisbon');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('swimming_pool');

  // Pre-initialize with master static data so dropdowns are NEVER blank
  const [categories, setCategories] = useState<CategoryInfo[]>(MASTER_CATEGORIES_DATA);
  const [families, setFamilies] = useState<Record<string, CategoryFamily>>(CATEGORY_FAMILIES_DATA);
  const [analysis, setAnalysis] = useState<MarketAnalysisResponse | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunitiesScanResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const isGitHubPages = window.location.hostname.includes('github.io');

  // Helper to resolve API endpoint
  const getApiUrl = (endpoint: string) => {
    return endpoint;
  };

  // Fetch Categories taxonomy on mount
  useEffect(() => {
    fetch(getApiUrl('/api/categories'))
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
        if (data.families) setFamilies(data.families);
      })
      .catch((err) => console.warn('Categories API fallback active:', err));
  }, []);

  // Parse URL search parameters on initial page load for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramCountry = params.get('country');
    const paramCity = params.get('city');
    const paramCat = params.get('cat') || params.get('category');
    const paramMode = (params.get('mode') as 'analyze' | 'discover') || (paramCat ? 'analyze' : 'discover');
    const payloadStr = params.get('d');

    // 0. Payload check: If share URL contains encoded result payload, decode and display INSTANTLY (0 ms) even in Incognito
    if (payloadStr) {
      const decodedRes = decodeAnalysisPayload(payloadStr);
      if (decodedRes) {
        if (paramCountry) setCountry(paramCountry);
        if (paramCity) setCity(paramCity);
        if (paramCat) setSelectedCategoryId(paramCat);
        setMode('analyze');
        setAnalysis(decodedRes);
        setLoading(false);
        return;
      }
    }

    if (paramCountry && paramCity) {
      setCountry(paramCountry);
      setCity(paramCity);
      if (paramCat) setSelectedCategoryId(paramCat);
      setMode(paramMode);

      // Check local/session storage cache
      const cachedData = getStoredAnalysisResult(paramCountry, paramCity, paramCat || 'swimming_pool', paramMode);
      if (cachedData) {
        setAnalysis(cachedData);
        setLoading(false);
        return;
      }

      handleRunAnalysis(paramCountry, paramCity, paramCat || undefined, paramMode);
    } else if (paramCountry && !paramCity) {
      setCountry(paramCountry);
      setCity('Country-Wide Comparison (Top Cities)');
      setMode('discover');
    } else {
      // Do NOT auto-run or auto-generate on root URL! Ready and up for testing.
      setAnalysis(null);
      setOpportunities(null);
      setLoading(false);
    }
  }, []);

  // Cancel / Abort active search
  const handleCancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setProgressStep('Search cancelled by user.');
    setProgressPercent(0);
  };

  // Share link generator (embeds compressed URL-safe payload for 0 ms Incognito share link restoration)
  const handleShareAnalysis = () => {
    const origin = window.location.origin + window.location.pathname;
    let shareUrl = '';
    if (mode === 'analyze' && analysis) {
      const encodedPayload = encodeAnalysisPayload(analysis);
      shareUrl = `${origin}?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}&category=${encodeURIComponent(selectedCategoryId)}&mode=analyze${encodedPayload ? `&d=${encodedPayload}` : ''}`;
    } else {
      shareUrl = `${origin}?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}&mode=discover`;
    }

    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Run analysis on user action (ALWAYS EXECUTES A FRESH REAL SPATIAL FETCH)
  const handleRunAnalysis = async (
    targetCountry?: string,
    targetCity?: string,
    targetCategory?: string,
    targetMode?: 'analyze' | 'discover'
  ) => {
    const runCountry = targetCountry || country;
    const runCity = targetCity || city;
    const runCategory = targetCategory || selectedCategoryId || 'swimming_pool';
    const effectiveMode = targetMode || mode;

    // Synchronize React state immediately
    setMode(effectiveMode);
    setCountry(runCountry);
    setCity(runCity);
    setSelectedCategoryId(runCategory);

    // Cancel previous fetch if active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setSelectedPlace(null);
    setProgressPercent(10);
    setProgressStep(`Initializing fresh analysis for ${runCity}, ${runCountry}...`);

    const catInfo = categories.find((c) => c.id === runCategory) || MASTER_CATEGORIES_DATA.find((c) => c.id === runCategory) || {
      id: runCategory,
      title: runCategory.replace(/_/g, ' ').toUpperCase(),
      family: 'services',
      keywords: [runCategory],
      overture_keys: [runCategory],
      hierarchy_matchers: [runCategory]
    };

    try {
      if (effectiveMode === 'analyze' && !runCity.includes('Country-Wide')) {
        let data: MarketAnalysisResponse | null = null;

        if (isGitHubPages) {
          data = await runClientSideAnalysis(
            runCountry,
            runCity,
            catInfo,
            (step, pct) => {
              setProgressStep(step);
              setProgressPercent(pct);
            },
            controller.signal
          );
        } else {
          try {
            setProgressStep(`Querying Overture GeoParquet backend for ${runCity}...`);
            setProgressPercent(40);

            const resp = await fetch(getApiUrl('/api/analyze'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                country: runCountry,
                city: runCity,
                category_id: runCategory
              }),
              signal: controller.signal
            });

            if (resp.ok) {
              data = await resp.json();
            }
          } catch (apiErr: any) {
            if (apiErr.name === 'AbortError') throw apiErr;
            console.warn('Backend API unavailable, using client-side spatial fallback...');
          }

          if (!data) {
            data = await runClientSideAnalysis(
              runCountry,
              runCity,
              catInfo,
              (step, pct) => {
                setProgressStep(step);
                setProgressPercent(pct);
              },
              controller.signal
            );
          }
        }

        setAnalysis(data);

        // Update address bar URL silently with payload parameter so copying from browser address bar carries payload
        if (data) {
          try {
            const origin = window.location.origin + window.location.pathname;
            const encodedPayload = encodeAnalysisPayload(data);
            const fullShareUrl = `${origin}?country=${encodeURIComponent(runCountry)}&city=${encodeURIComponent(runCity)}&category=${encodeURIComponent(runCategory)}&mode=analyze${encodedPayload ? `&d=${encodedPayload}` : ''}`;
            window.history.replaceState({ path: fullShareUrl }, '', fullShareUrl);
          } catch (e) {
            console.warn('Address bar update error:', e);
          }
        }
      } else {
        // Mode B — Discover Opportunities or Country-Wide Comparison
        let oppsData: OpportunitiesScanResponse | null = null;

        const scanCity = runCity.includes('Country-Wide') ? (COUNTRY_CITIES_MAP[runCountry]?.[1] || 'Lisbon') : runCity;

        // Initialize opportunities state so UI renders streaming leaderboard immediately
        setOpportunities({
          city: scanCity,
          country: runCountry,
          population: 1000000,
          population_year: '2024',
          total_categories_scanned: 0,
          opportunities: []
        });

        if (isGitHubPages) {
          oppsData = await runClientSideOpportunities(
            runCountry,
            scanCity,
            categories,
            (step, pct) => {
              setProgressStep(step);
              setProgressPercent(pct);
            },
            controller.signal,
            (item) => {
              setOpportunities((prev) => {
                const existingList = prev?.opportunities || [];
                const filtered = existingList.filter((x) => x.category_id !== item.category_id);
                // Append items step-by-step in scan order (do not sort mid-stream so rows appear linearly)
                const updated = [...filtered, item];
                return {
                  city: scanCity,
                  country: runCountry,
                  population: prev?.population || 1000000,
                  population_year: '2024',
                  total_categories_scanned: updated.length,
                  opportunities: updated
                };
              });
            }
          );
        } else {
          try {
            setProgressStep(`Running multi-category opportunity scan for ${scanCity}...`);
            setProgressPercent(50);

            const resp = await fetch(getApiUrl('/api/opportunities'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                country: runCountry,
                city: scanCity
              }),
              signal: controller.signal
            });

            if (resp.ok) {
              oppsData = await resp.json();
            }
          } catch (err: any) {
            if (err.name === 'AbortError') throw err;
            console.warn('Mode B API unavailable, running client-side opportunities scanner...');
          }

          if (!oppsData) {
            oppsData = await runClientSideOpportunities(
              runCountry,
              scanCity,
              categories,
              (step, pct) => {
                setProgressStep(step);
                setProgressPercent(pct);
              },
              controller.signal,
              (item) => {
                setOpportunities((prev) => {
                  const existingList = prev?.opportunities || [];
                  const filtered = existingList.filter((x) => x.category_id !== item.category_id);
                  // Append items step-by-step in scan order
                  const updated = [...filtered, item];
                  return {
                    city: scanCity,
                    country: runCountry,
                    population: prev?.population || 1000000,
                    population_year: '2024',
                    total_categories_scanned: updated.length,
                    opportunities: updated
                  };
                });
              }
            );
          }
        }

        if (oppsData) {
          setOpportunities(oppsData);
        }

        try {
          const origin = window.location.origin + window.location.pathname;
          const newUrl = `${origin}?country=${encodeURIComponent(runCountry)}&city=${encodeURIComponent(runCity)}&mode=discover`;
          window.history.replaceState({ path: newUrl }, '', newUrl);
        } catch (e) {
          // ignore history error
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        console.log('Search aborted by user.');
        return;
      }
      console.error('Analysis error:', err);
      setError(err.message || `An error occurred while analyzing ${runCity}, ${runCountry}.`);
    } finally {
      setLoading(false);
    }
  };

  // Export Excel (.xlsx)
  const handleExportExcel = async () => {
    if (!analysis) return;
    try {
      const resp = await fetch(getApiUrl('/api/export/excel'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: analysis.city_metadata.country,
          city: analysis.city_metadata.city,
          category_id: analysis.category_info.id
        })
      });

      if (!resp.ok) throw new Error('Failed to generate Excel download');

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${analysis.target_city}_${analysis.category_info.id}_analysis.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Generating CSV export fallback...');
      handleExportCSV();
    }
  };

  // Export CSV (includes Phone, Email & Google Maps Profile URL)
  const handleExportCSV = () => {
    if (!analysis) return;
    const headers = ['Business Name', 'Category', 'Address', 'Brand', 'Phone', 'Email', 'Website', 'Google Maps Profile', 'Confidence', 'Lon', 'Lat'];
    const rows = analysis.matched_places.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category_primary}"`,
      `"${(p.address || '').replace(/"/g, '""')}"`,
      `"${p.brand || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.email || ''}"`,
      `"${p.website || ''}"`,
      `"${getGoogleMapsProfileUrl(p)}"`,
      p.confidence,
      p.lon,
      p.lat
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${analysis.target_city}_${analysis.category_info.id}_analysis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    if (!analysis) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(analysis, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `${analysis.target_city}_${analysis.category_info.id}_analysis.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCountryWide = city.includes('Country-Wide') || !city;
  const currentTopCities = (COUNTRY_CITIES_MAP[country] || []).filter((c) => !c.includes('Country-Wide'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white pb-16">
      {/* Top Navbar */}
      <Navbar
        mode={mode}
        setMode={setMode}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        overtureRelease={analysis?.city_metadata?.release || '2026-08 Live Engine'}
      />

      {/* Hero & Search Header */}
      <HeroSearch
        country={country}
        setCountry={setCountry}
        city={city}
        setCity={setCity}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        categories={categories}
        mode={mode}
        onSearch={handleRunAnalysis}
        loading={loading}
      />

      {/* Real-Time Progress Visualizer Bar */}
      {loading && (
        <div className="mx-auto max-w-4xl px-4 mt-4">
          <div className="p-4 rounded-2xl border border-brand-500/30 bg-slate-900/95 shadow-2xl flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center space-x-2 font-bold text-brand-300">
                <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                <span>{progressStep || 'Processing spatial intelligence...'}</span>
              </span>
              <button
                onClick={handleCancelSearch}
                className="flex items-center space-x-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-2.5 py-1 font-bold text-[11px] transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-blue-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center space-x-3 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold mb-0.5 font-sans">Analysis Request Notice</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* WELCOME CLEAN TESTING LANDING CARD (shown on initial root visit) */}
        {!analysis && !opportunities && !isCountryWide && !loading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl text-center space-y-6 max-w-4xl mx-auto my-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shadow-inner mx-auto">
              <Sparkles className="h-8 w-8 text-brand-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Global Business Gap Finder & Blue Ocean Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                App is up and ready for testing! Select any country, city, and business industry above and click <strong>Analyze</strong> or <strong>Find Gap Opportunities</strong> to run spatial market gap intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left pt-2">
              <div
                onClick={() => handleRunAnalysis('Portugal', 'Lisbon', 'swimming_pool', 'analyze')}
                className="group p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all cursor-pointer space-y-2 shadow-lg"
              >
                <div className="font-extrabold text-brand-400 text-sm flex items-center justify-between">
                  <span>Test Mode A: Industry Deep Analysis</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Analyze a specific business category in any city. Calculates exact POI count, peer city benchmark, gap score, demand radar, and startup financial feasibility.
                </p>
                <div className="text-[10px] font-bold text-slate-300 pt-1">
                  Sample: <span className="text-white">Lisbon, Portugal • Swimming Pool</span>
                </div>
              </div>

              <div
                onClick={() => handleRunAnalysis('Lithuania', 'Vilnius', 'sushi_restaurant', 'analyze')}
                className="group p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all cursor-pointer space-y-2 shadow-lg"
              >
                <div className="font-extrabold text-emerald-400 text-sm flex items-center justify-between">
                  <span>Test Mode B: Discover Market Opportunities</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Scan 55+ commercial categories across a city to discover top underserved Blue Ocean gaps and cross-city arbitrage transfer opportunities.
                </p>
                <div className="text-[10px] font-bold text-slate-300 pt-1">
                  Sample: <span className="text-white">Vilnius, Lithuania • Sushi & Japanese</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COUNTRY-WIDE CITIES COMPARISON DASHBOARD */}
        {isCountryWide && !loading && (
          <CountryCityComparison
            country={country}
            topCities={currentTopCities}
            families={families}
            categories={categories}
            onSelectCityCategory={(targetCity, catId) => {
              handleRunAnalysis(country, targetCity, catId, 'analyze');
            }}
            loading={loading}
          />
        )}

        {/* MODE A — ANALYZE INDUSTRY DASHBOARD */}
        {!isCountryWide && mode === 'analyze' && analysis && !loading && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header Title Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
              <div>
                <div className="inline-flex items-center space-x-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-400 mb-2">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Market Intelligence Analysis</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {analysis.category_info.title} in {analysis.target_city}, {analysis.city_metadata.country}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Population: <strong className="text-white">{(analysis.target_population / 1_000_000).toFixed(2)}M</strong> ({analysis.population_year} {analysis.city_metadata.population_source}) •
                  Engine: <strong className="text-slate-300">{analysis.city_metadata.release}</strong>
                </p>
              </div>

              {/* Action & Share / Export Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPitchDeckOpen(true)}
                  className="flex items-center space-x-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600 hover:text-white px-3.5 py-2 text-xs font-bold text-purple-300 transition-all cursor-pointer shadow-md"
                  title="Generate 1-Page AI Business Pitch Deck"
                >
                  <Presentation className="h-4 w-4 text-purple-400" />
                  <span>AI Pitch Deck</span>
                </button>

                <button
                  onClick={handleShareAnalysis}
                  className="flex items-center space-x-1.5 rounded-xl bg-brand-600/20 border border-brand-500/30 hover:bg-brand-600 hover:text-white px-3.5 py-2 text-xs font-bold text-brand-300 transition-all cursor-pointer shadow-md"
                  title="Copy shareable link for this analysis"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-brand-400" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Analysis Link'}</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center space-x-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white px-3.5 py-2 text-xs font-bold text-emerald-400 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export Excel (.xlsx)</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-brand-400" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-brand-400" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <KpiCard
                title="Existing POIs"
                value={analysis.existing_count}
                subtitle={`${analysis.per_10k.toFixed(2)} per 10k residents`}
                icon={Building2}
                badge="Detected"
                badgeType="info"
              />

              <KpiCard
                title="Peer Benchmark"
                value={`${analysis.benchmark_per_10k.toFixed(2)}`}
                subtitle={`~${analysis.expected_count} expected supply`}
                icon={Target}
                badge="Peer Median"
                badgeType="info"
              />

              <KpiCard
                title="Opportunity Score"
                value={`${analysis.opportunity_score}/100`}
                subtitle={analysis.opportunity_label}
                icon={TrendingUp}
                badge={analysis.opportunity_label}
                badgeType={analysis.opportunity_score >= 80 ? 'success' : 'warning'}
                highlight={true}
              />

              <KpiCard
                title="AI Demand Signal"
                value={`${Math.min(99, Math.max(55, Math.round(85 + (analysis.opportunity_score - 50) * 0.35)))}/100`}
                subtitle={analysis.estimated_gap > 0 ? "🔥 High Local Demand Gap" : "🛡️ Equilibrium Market"}
                icon={Flame}
                badge={analysis.estimated_gap > 0 ? "🔥 Unmet Demand" : "Balanced"}
                badgeType={analysis.estimated_gap > 0 ? 'success' : 'info'}
              />
            </div>

            {/* Natural Language Explanation Card */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/30 p-5 shadow-xl">
              <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-brand-400 mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Market Gap Intelligence Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {analysis.explanation}
              </p>
            </div>

            {/* AI Consumer Demand Index & Search Signals Card */}
            <DemandScoreCard
              categoryTitle={analysis.category_info.title}
              city={analysis.target_city}
              country={analysis.city_metadata.country}
              opportunityScore={analysis.opportunity_score}
              per10k={analysis.per_10k}
              benchmarkPer10k={analysis.benchmark_per_10k}
              estimatedGap={analysis.estimated_gap}
            />

            {/* AI Business Startup Cost & Financial Feasibility Card */}
            <StartupCostCard
              categoryId={analysis.category_info.id}
              categoryTitle={analysis.category_info.title}
              city={analysis.target_city}
              country={analysis.city_metadata.country}
              opportunityScore={analysis.opportunity_score}
              estimatedGap={analysis.estimated_gap}
            />

            {/* Country Business Setup & Macroeconomic Card */}
            <CountryMacroCard
              country={analysis.city_metadata.country}
              city={analysis.target_city}
            />

            {/* Interactive Map & Supply Position */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Geographic Competition Map
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Click pins for Google Maps details, phone & email contact
                  </span>
                </div>
                <MapView
                  places={analysis.matched_places}
                  center={[analysis.city_metadata.lon, analysis.city_metadata.lat]}
                  bbox={analysis.city_metadata.bbox}
                  geojsonBoundary={analysis.city_metadata.geojson}
                  selectedPlaceId={selectedPlace?.id}
                  onSelectPlace={setSelectedPlace}
                />
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                <SupplyGauge
                  existingCount={analysis.existing_count}
                  expectedCount={analysis.expected_count}
                  estimatedGap={analysis.estimated_gap}
                  gapPercent={analysis.gap_percent}
                  opportunityScore={analysis.opportunity_score}
                  opportunityLabel={analysis.opportunity_label}
                />

                {/* Neighborhood Quadrant Density */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                    Neighborhood Quadrant Density
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Spatial distribution across city sub-zones.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(analysis.neighborhood_density).map(([quad, count]) => (
                      <div key={quad} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400 font-medium">{quad}</span>
                        <strong className="text-white">{count} POIs</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Peer City Comparison Chart */}
            <PeerChart
              targetCity={analysis.target_city}
              targetPer10k={analysis.per_10k}
              benchmarkPer10k={analysis.benchmark_per_10k}
              peerCities={analysis.peer_cities}
            />

            {/* Business Directory Table & Cards */}
            <BusinessList
              places={analysis.matched_places}
              onSelectPlace={(p) => setSelectedPlace(p)}
              selectedPlaceId={selectedPlace?.id}
              onExportExcel={handleExportExcel}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {/* MODE B — DISCOVER OPPORTUNITIES DASHBOARD */}
        {!isCountryWide && mode === 'discover' && (
          <OpportunityScanner
            city={city}
            country={country}
            population={opportunities?.population || 841558}
            populationYear={opportunities?.population_year || '2024'}
            opportunities={opportunities?.opportunities || []}
            families={families}
            onSelectCategory={(catId) => {
              handleRunAnalysis(country, city, catId, 'analyze');
            }}
            loading={loading}
          />
        )}
      </main>

      {/* Methodology Drawer/Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        overtureRelease={analysis?.city_metadata?.release}
      />

      {/* AI Business Pitch Deck Modal */}
      {analysis && (
        <PitchDeckModal
          isOpen={isPitchDeckOpen}
          onClose={() => setIsPitchDeckOpen(false)}
          analysis={analysis}
        />
      )}
    </div>
  );
}

export default App;
