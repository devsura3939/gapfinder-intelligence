import React, { useState } from 'react';
import type { Place } from '../types';
import { getGoogleMapsProfileUrl } from '../clientEngine';
import { Search, ExternalLink, Phone, Mail, Globe, ShieldCheck, MapPin, Download, FileSpreadsheet, Share2 } from 'lucide-react';

interface BusinessListProps {
  places: Place[];
  onSelectPlace: (p: Place) => void;
  selectedPlaceId?: string | null;
  onExportExcel: () => void;
  onExportCSV: () => void;
}

export const BusinessList: React.FC<BusinessListProps> = ({
  places,
  onSelectPlace,
  selectedPlaceId,
  onExportExcel,
  onExportCSV
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [minConfFilter, setMinConfFilter] = useState<number>(0);

  const filteredPlaces = places.filter((p) => {
    const matchesName =
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category_primary.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.address && p.address.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (p.phone && p.phone.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(filterQuery.toLowerCase()));

    const matchesConf = p.confidence >= minConfFilter;
    return matchesName && matchesConf;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-4 sm:p-6 shadow-2xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-wide uppercase">
            Detected Establishments Directory ({filteredPlaces.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real location records with addresses, phone numbers, contact emails, websites & Google Maps profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search name, phone, email, address..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={minConfFilter}
            onChange={(e) => setMinConfFilter(Number(e.target.value))}
            className="py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value={0}>All Confidence</option>
            <option value={0.5}>Conf &ge; 50%</option>
            <option value={0.75}>Conf &ge; 75%</option>
          </select>

          <button
            onClick={onExportExcel}
            className="flex items-center space-x-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white px-3.5 py-1.5 text-xs font-bold text-emerald-400 transition-all cursor-pointer shadow-md"
            title="Download formatted Excel workbook (.xlsx) with phone & email columns"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
            title="Download CSV file with phone & email columns"
          >
            <Download className="h-3.5 w-3.5 text-brand-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      <div className="hidden sm:block overflow-x-auto max-h-[500px] rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800 z-10">
            <tr>
              <th className="py-3.5 px-4">Business Name & Brand</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Address / Locality</th>
              <th className="py-3.5 px-4">Phone Contact</th>
              <th className="py-3.5 px-4">Email Contact</th>
              <th className="py-3.5 px-4">Web & Google Profile</th>
              <th className="py-3.5 px-4 text-center">Quality</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredPlaces.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                  No business records matched current filter criteria.
                </td>
              </tr>
            ) : (
              filteredPlaces.map((p) => {
                const isSelected = p.id === selectedPlaceId;
                const googleMapsProfileUrl = getGoogleMapsProfileUrl(p);
                const searchContactUrl = `https://www.google.com/search?q=${encodeURIComponent(`${p.name} ${p.locality || ''} phone email instagram facebook`)}`;

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-slate-800/60 ${
                      isSelected ? 'bg-brand-500/15 border-l-4 border-brand-500 font-bold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="text-sm">{p.name}</div>
                      {p.brand && (
                        <span className="inline-block mt-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                          🏷️ {p.brand}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 capitalize font-medium">
                      {p.taxonomy_primary !== 'unclassified'
                        ? p.taxonomy_primary.replace(/_/g, ' ')
                        : p.category_primary.replace(/_/g, ' ')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px] leading-snug">
                      {p.address || p.locality || 'Coordinates recorded'}
                    </td>

                    {/* Phone Column */}
                    <td className="py-3.5 px-4">
                      {p.phone ? (
                        <a
                          href={`tel:${p.phone}`}
                          className="inline-flex items-center space-x-1 font-bold text-brand-300 hover:text-white hover:underline text-[11px]"
                        >
                          <Phone className="h-3 w-3 text-brand-400 shrink-0" />
                          <span>{p.phone}</span>
                        </a>
                      ) : (
                        <a
                          href={searchContactUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-slate-500 hover:text-brand-300 text-[10px] font-medium transition-colors"
                          title="Search business phone on Google"
                        >
                          <Search className="h-3 w-3 shrink-0" />
                          <span>Find Phone ↗</span>
                        </a>
                      )}
                    </td>

                    {/* Email Column */}
                    <td className="py-3.5 px-4">
                      {p.email ? (
                        <a
                          href={`mailto:${p.email}`}
                          className="inline-flex items-center space-x-1 font-bold text-emerald-400 hover:text-emerald-300 hover:underline text-[11px]"
                        >
                          <Mail className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{p.email}</span>
                        </a>
                      ) : (
                        <a
                          href={searchContactUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-slate-500 hover:text-emerald-400 text-[10px] font-medium transition-colors"
                          title="Search business email on Google"
                        >
                          <Search className="h-3 w-3 shrink-0" />
                          <span>Find Email ↗</span>
                        </a>
                      )}
                    </td>

                    {/* Links Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        {p.website && (
                          <a
                            href={p.website}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-brand-300 hover:text-white transition-colors"
                            title={`Website: ${p.website}`}
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {p.social && (
                          <a
                            href={p.social}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-600 text-purple-300 hover:text-white transition-colors"
                            title={`Social: ${p.social}`}
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <a
                          href={googleMapsProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-600/30 hover:bg-brand-600 text-brand-300 hover:text-white text-[10px] font-bold transition-colors"
                          title="Open Official Google Maps Place Profile (Centered at pin at 18z)"
                        >
                          <ExternalLink className="h-3 w-3 text-brand-400" />
                          <span>Google Profile ↗</span>
                        </a>
                      </div>
                    </td>

                    {/* Confidence Score Column */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          p.confidence >= 0.75
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : p.confidence >= 0.5
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        <span>{(p.confidence * 100).toFixed(0)}%</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectPlace(p)}
                        className="inline-flex items-center space-x-1 rounded-xl bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 text-xs font-semibold shadow-md shadow-brand-600/30 transition-all cursor-pointer"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Map</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredPlaces.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No business records matched current filter criteria.
          </div>
        ) : (
          filteredPlaces.map((p) => {
            const googleMapsProfileUrl = getGoogleMapsProfileUrl(p);
            const searchContactUrl = `https://www.google.com/search?q=${encodeURIComponent(`${p.name} ${p.locality || ''} phone email instagram facebook`)}`;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border bg-slate-950/90 transition-all space-y-2 ${
                  p.id === selectedPlaceId ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-extrabold text-white text-sm">{p.name}</div>
                    <div className="text-[11px] text-brand-300 font-semibold capitalize mt-0.5">
                      {(p.taxonomy_primary !== 'unclassified' ? p.taxonomy_primary : p.category_primary).replace(/_/g, ' ')}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {(p.confidence * 100).toFixed(0)}% Conf
                  </span>
                </div>

                {p.brand && (
                  <div className="text-[10px] text-emerald-400 font-medium">
                    🏷️ Brand: {p.brand}
                  </div>
                )}

                {p.address || p.locality ? (
                  <div className="text-xs text-slate-300">📍 {p.address || p.locality}</div>
                ) : null}

                <div className="grid grid-cols-1 gap-1 text-xs text-slate-300 pt-1">
                  {p.phone ? (
                    <div className="flex items-center space-x-1.5">
                      <Phone className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                      <a href={`tel:${p.phone}`} className="font-bold text-brand-300 hover:underline">
                        {p.phone}
                      </a>
                    </div>
                  ) : (
                    <a href={searchContactUrl} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-brand-300 flex items-center space-x-1">
                      <Search className="h-3 w-3 shrink-0" />
                      <span>Find Phone & Socials ↗</span>
                    </a>
                  )}

                  {p.email && (
                    <div className="flex items-center space-x-1.5">
                      <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <a href={`mailto:${p.email}`} className="font-bold text-emerald-400 hover:underline truncate">
                        {p.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-800 text-brand-300 font-bold text-[10px]">
                        🌐 Website
                      </a>
                    )}
                    <a
                      href={googleMapsProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-brand-600/30 text-brand-300 font-bold text-[10px]"
                    >
                      📍 Google Profile ↗
                    </a>
                  </div>

                  <button
                    onClick={() => onSelectPlace(p)}
                    className="rounded-xl bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 text-xs font-bold shadow-md cursor-pointer"
                  >
                    Focus Map
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
