import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Globe, Sparkles, X } from 'lucide-react';
import type { CategoryInfo } from '../types';

interface HeroSearchProps {
  country: string;
  setCountry: (c: string) => void;
  city: string;
  setCity: (c: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  categories: CategoryInfo[];
  mode: 'analyze' | 'discover';
  onSearch: (targetCountry?: string, targetCity?: string, targetCat?: string, targetMode?: 'analyze' | 'discover') => void;
  loading: boolean;
}

export const COUNTRY_CITIES_MAP: Record<string, string[]> = {
  Georgia: ['Country-Wide Comparison (Top Cities)', 'Tbilisi', 'Batumi', 'Kutaisi', 'Gori', 'Rustavi', 'Poti', 'Zugdidi', 'Telavi', 'Akhaltsikhe', 'Borjomi', 'Khashuri'],
  Portugal: ['Country-Wide Comparison (Top Cities)', 'Lisbon', 'Porto', 'Braga', 'Coimbra', 'Funchal', 'Setubal', 'Aveiro', 'Evora', 'Faro', 'Guimaraes'],
  Spain: ['Country-Wide Comparison (Top Cities)', 'Valencia', 'Barcelona', 'Madrid', 'Alicante', 'Seville', 'Zaragoza', 'Malaga', 'Bilbao', 'Cordoba', 'Granada', 'Palma', 'Las Palmas'],
  Lithuania: ['Country-Wide Comparison (Top Cities)', 'Vilnius', 'Kaunas', 'Klaipeda', 'Siauliai', 'Panevezys', 'Alytus', 'Marijampole'],
  Belarus: ['Country-Wide Comparison (Top Cities)', 'Minsk', 'Brest', 'Grodno', 'Gomel', 'Vitebsk', 'Mogilev', 'Bobruisk'],
  Germany: ['Country-Wide Comparison (Top Cities)', 'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Leipzig', 'Dresden', 'Hannover', 'Nuremberg', 'Dusseldorf', 'Dortmund'],
  Poland: ['Country-Wide Comparison (Top Cities)', 'Warsaw', 'Krakow', 'Wroclaw', 'Poznan', 'Gdansk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice', 'Gdynia'],
  'United Kingdom': ['Country-Wide Comparison (Top Cities)', 'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Bristol', 'Leeds', 'Liverpool', 'Newcastle', 'Belfast'],
  France: ['Country-Wide Comparison (Top Cities)', 'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille', 'Montpellier'],
  Italy: ['Country-Wide Comparison (Top Cities)', 'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice', 'Verona', 'Bari'],
  Greece: ['Country-Wide Comparison (Top Cities)', 'Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Rhodes', 'Chania'],
  Netherlands: ['Country-Wide Comparison (Top Cities)', 'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen'],
  Belgium: ['Country-Wide Comparison (Top Cities)', 'Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liege', 'Bruges'],
  Austria: ['Country-Wide Comparison (Top Cities)', 'Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
  Switzerland: ['Country-Wide Comparison (Top Cities)', 'Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern'],
  Sweden: ['Country-Wide Comparison (Top Cities)', 'Stockholm', 'Gothenburg', 'Malmo', 'Uppsala'],
  Norway: ['Country-Wide Comparison (Top Cities)', 'Oslo', 'Bergen', 'Trondheim', 'Stavanger'],
  Denmark: ['Country-Wide Comparison (Top Cities)', 'Copenhagen', 'Aarhus', 'Odense', 'Aalborg'],
  Finland: ['Country-Wide Comparison (Top Cities)', 'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'],
  'Czech Republic': ['Country-Wide Comparison (Top Cities)', 'Prague', 'Brno', 'Ostrava', 'Pilsen'],
  Hungary: ['Country-Wide Comparison (Top Cities)', 'Budapest', 'Debrecen', 'Szeged', 'Miskolc'],
  Romania: ['Country-Wide Comparison (Top Cities)', 'Bucharest', 'Cluj-Napoca', 'Timisoara', 'Iasi', 'Constanta'],
  Ireland: ['Country-Wide Comparison (Top Cities)', 'Dublin', 'Cork', 'Limerick', 'Galway'],
  Ukraine: ['Country-Wide Comparison (Top Cities)', 'Kyiv', 'Lviv', 'Odesa', 'Dnipro', 'Kharkiv'],
  Kazakhstan: ['Country-Wide Comparison (Top Cities)', 'Almaty', 'Astana', 'Shymkent', 'Karaganda', 'Aktobe'],
  Uzbekistan: ['Country-Wide Comparison (Top Cities)', 'Tashkent', 'Samarkand', 'Bukhara', 'Namangan', 'Andijan'],
  Azerbaijan: ['Country-Wide Comparison (Top Cities)', 'Baku', 'Ganja', 'Sumqayit', 'Mingachevir'],
  Armenia: ['Country-Wide Comparison (Top Cities)', 'Yerevan', 'Gyumri', 'Vanadzor'],
  Bulgaria: ['Country-Wide Comparison (Top Cities)', 'Sofia', 'Plovdiv', 'Varna', 'Burgas'],
  Albania: ['Country-Wide Comparison (Top Cities)', 'Tirana', 'Durres', 'Vlore'],
  Croatia: ['Country-Wide Comparison (Top Cities)', 'Zagreb', 'Split', 'Rijeka', 'Osijek'],
  Serbia: ['Country-Wide Comparison (Top Cities)', 'Belgrade', 'Novi Sad', 'Nis'],
  Slovakia: ['Country-Wide Comparison (Top Cities)', 'Bratislava', 'Kosice'],
  Slovenia: ['Country-Wide Comparison (Top Cities)', 'Ljubljana', 'Maribor'],
  Latvia: ['Country-Wide Comparison (Top Cities)', 'Riga', 'Daugavpils', 'Liepaja'],
  Estonia: ['Country-Wide Comparison (Top Cities)', 'Tallinn', 'Tartu', 'Narva'],
  Turkey: ['Country-Wide Comparison (Top Cities)', 'Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa', 'Adana'],
  'United States': ['Country-Wide Comparison (Top Cities)', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Seattle', 'Denver', 'Miami', 'Atlanta', 'San Francisco', 'Boston', 'Las Vegas'],
  Canada: ['Country-Wide Comparison (Top Cities)', 'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Quebec City'],
  Mexico: ['Country-Wide Comparison (Top Cities)', 'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Cancun'],
  Brazil: ['Country-Wide Comparison (Top Cities)', 'Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza', 'Belo Horizonte'],
  Argentina: ['Country-Wide Comparison (Top Cities)', 'Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza'],
  Colombia: ['Country-Wide Comparison (Top Cities)', 'Bogota', 'Medellin', 'Cali', 'Barranquilla'],
  Chile: ['Country-Wide Comparison (Top Cities)', 'Santiago', 'Valparaiso', 'Concepcion'],
  Peru: ['Country-Wide Comparison (Top Cities)', 'Lima', 'Arequipa', 'Trujillo'],
  Japan: ['Country-Wide Comparison (Top Cities)', 'Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Hiroshima'],
  'South Korea': ['Country-Wide Comparison (Top Cities)', 'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju'],
  China: ['Country-Wide Comparison (Top Cities)', 'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan'],
  India: ['Country-Wide Comparison (Top Cities)', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'],
  Thailand: ['Country-Wide Comparison (Top Cities)', 'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'],
  Vietnam: ['Country-Wide Comparison (Top Cities)', 'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Nha Trang'],
  Malaysia: ['Country-Wide Comparison (Top Cities)', 'Kuala Lumpur', 'Penang', 'Johor Bahru'],
  Indonesia: ['Country-Wide Comparison (Top Cities)', 'Jakarta', 'Bali', 'Surabaya', 'Bandung'],
  Philippines: ['Country-Wide Comparison (Top Cities)', 'Manila', 'Cebu City', 'Davao City', 'Quezon City'],
  Singapore: ['Singapore'],
  Australia: ['Country-Wide Comparison (Top Cities)', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'],
  'New Zealand': ['Country-Wide Comparison (Top Cities)', 'Auckland', 'Wellington', 'Christchurch'],
  Egypt: ['Country-Wide Comparison (Top Cities)', 'Cairo', 'Alexandria', 'Giza', 'Luxor'],
  Nigeria: ['Country-Wide Comparison (Top Cities)', 'Lagos', 'Abuja', 'Kano', 'Ibadan'],
  Kenya: ['Country-Wide Comparison (Top Cities)', 'Nairobi', 'Mombasa', 'Kisumu'],
  Morocco: ['Country-Wide Comparison (Top Cities)', 'Casablanca', 'Marrakesh', 'Rabat', 'Fes', 'Tangier'],
  'South Africa': ['Country-Wide Comparison (Top Cities)', 'Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  Israel: ['Country-Wide Comparison (Top Cities)', 'Tel Aviv', 'Jerusalem', 'Haifa'],
  'United Arab Emirates': ['Country-Wide Comparison (Top Cities)', 'Dubai', 'Abu Dhabi', 'Sharjah'],
  'Saudi Arabia': ['Country-Wide Comparison (Top Cities)', 'Riyadh', 'Jeddah', 'Mecca', 'Medina']
};

export const HeroSearch: React.FC<HeroSearchProps> = ({
  country,
  setCountry,
  city,
  setCity,
  selectedCategoryId,
  setSelectedCategoryId,
  categories,
  mode,
  onSearch,
  loading
}) => {
  const [localCountry, setLocalCountry] = useState(country);
  const [localCity, setLocalCity] = useState(city);
  const [localCategory, setLocalCategory] = useState(selectedCategoryId || 'swimming_pool');

  useEffect(() => {
    setLocalCountry(country);
  }, [country]);

  useEffect(() => {
    setLocalCity(city);
  }, [city]);

  useEffect(() => {
    setLocalCategory(selectedCategoryId || 'swimming_pool');
  }, [selectedCategoryId]);

  const handleCountryChange = (newCountry: string) => {
    setLocalCountry(newCountry);
    setCountry(newCountry);
    const availableCities = COUNTRY_CITIES_MAP[newCountry] || [];
    if (availableCities.length > 0) {
      const defaultCity = availableCities[0] || availableCities[1] || 'Lisbon';
      setLocalCity(defaultCity);
      setCity(defaultCity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCity = localCity.trim();
    if (cleanCity) {
      const catToRun = localCategory || selectedCategoryId || 'swimming_pool';
      setCountry(localCountry);
      setCity(cleanCity);
      setSelectedCategoryId(catToRun);

      if (mode === 'discover' || cleanCity.includes('Country-Wide')) {
        onSearch(localCountry, cleanCity, undefined, 'discover');
      } else {
        onSearch(localCountry, cleanCity, catToRun, 'analyze');
      }
    }
  };

  const popularCountries = Object.keys(COUNTRY_CITIES_MAP);
  const availableCities = COUNTRY_CITIES_MAP[localCountry] || [];

  const handleQuickSample = (sampleCountry: string, sampleCity: string, sampleCat: string) => {
    setLocalCountry(sampleCountry);
    setLocalCity(sampleCity);
    setLocalCategory(sampleCat);

    setCountry(sampleCountry);
    setCity(sampleCity);
    setSelectedCategoryId(sampleCat);

    if (mode === 'discover') {
      onSearch(sampleCountry, sampleCity, undefined, 'discover');
    } else {
      onSearch(sampleCountry, sampleCity, sampleCat, 'analyze');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800/80 py-6 sm:py-10 px-3 sm:px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-40 bg-brand-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl text-center">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
          Find What Your City Is <span className="bg-gradient-to-r from-brand-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Missing</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Discover underserved business categories, benchmark against peer cities globally, and unlock Blue Ocean commercial opportunities using Overture Maps GeoParquet location intelligence.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 p-3 sm:p-4 bg-slate-900/95 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950/90 max-w-4xl mx-auto grid grid-cols-1 gap-3 sm:grid-cols-12 items-center"
        >
          {/* Country Dropdown */}
          <div className="sm:col-span-3 text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
              Country ({popularCountries.length}+)
            </label>
            <div className="relative flex items-center">
              <Globe className="absolute left-3 h-4 w-4 text-brand-400 pointer-events-none" />
              <select
                value={localCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full pl-9 pr-8 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer shadow-inner"
              >
                {popularCountries.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white font-medium py-1">
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>
          </div>

          {/* City Dropdown & Text Autocomplete */}
          <div className="sm:col-span-4 text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
              City / Comparison
            </label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3 h-4 w-4 text-brand-400 pointer-events-none z-10" />
              <input
                type="text"
                list="city-options"
                value={localCity}
                onChange={(e) => setLocalCity(e.target.value)}
                placeholder="Select or type city..."
                className="w-full pl-9 pr-8 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
              />
              <datalist id="city-options">
                {availableCities.map((cityName) => (
                  <option key={cityName} value={cityName} />
                ))}
              </datalist>
              {localCity && (
                <button
                  type="button"
                  onClick={() => setLocalCity('')}
                  className="absolute right-2.5 text-slate-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Business Industry Dropdown (Mode A) */}
          {mode === 'analyze' && !localCity.includes('Country-Wide') && (
            <div className="sm:col-span-3 text-left">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                Business Industry
              </label>
              <div className="relative flex items-center">
                <Building2 className="absolute left-3 h-4 w-4 text-brand-400 pointer-events-none" />
                <select
                  value={localCategory}
                  onChange={(e) => {
                    setLocalCategory(e.target.value);
                    setSelectedCategoryId(e.target.value);
                  }}
                  className="w-full pl-9 pr-8 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer shadow-inner"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white font-medium py-1">
                      {cat.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className={`${mode === 'analyze' && !localCity.includes('Country-Wide') ? 'sm:col-span-2' : 'sm:col-span-5'} text-left sm:pt-4`}>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-brand-600 via-brand-500 to-blue-500 hover:from-brand-500 hover:to-blue-400 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyzing...</span>
                </>
              ) : mode === 'analyze' && !localCity.includes('Country-Wide') ? (
                <>
                  <Search className="h-4 w-4" />
                  <span>Analyze</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Find Gap Opportunities</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick sample chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-semibold text-[11px]">Popular Quick Searches:</span>
          {[
            { country: 'Belarus', city: 'Minsk', cat: 'swimming_pool', label: 'Minsk • Swimming Pool' },
            { country: 'Portugal', city: 'Lisbon', cat: 'swimming_pool', label: 'Lisbon • Swimming Pool' },
            { country: 'Lithuania', city: 'Vilnius', cat: 'sushi_restaurant', label: 'Vilnius • Sushi' },
            { country: 'Georgia', city: 'Tbilisi', cat: 'pet_grooming', label: 'Tbilisi • Pet Grooming' },
            { country: 'Kazakhstan', city: 'Almaty', cat: 'coffee_shop', label: 'Almaty • Coffee Shop' }
          ].map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleQuickSample(sample.country, sample.city, sample.cat)}
              className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-brand-500/50 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
