import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Place } from '../types';
import { getGoogleMapsProfileUrl } from '../clientEngine';
import { Eye, EyeOff, MapPin, ExternalLink, Navigation, Phone, Mail, Globe, Search } from 'lucide-react';

interface MapViewProps {
  places: Place[];
  center: [number, number]; // [lon, lat]
  bbox?: [number, number, number, number];
  geojsonBoundary?: any;
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: Place | null) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  center,
  bbox,
  geojsonBoundary,
  selectedPlaceId,
  onSelectPlace
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [mapTheme, setMapTheme] = useState<'bright' | 'dark'>('bright');
  const [showPlaces, setShowPlaces] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);

  // High-definition raster map tile sources (100% reliable)
  const mapStyles: Record<string, any> = {
    bright: {
      version: 8,
      sources: {
        'carto-voyager': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }
      },
      layers: [
        {
          id: 'carto-voyager-layer',
          type: 'raster',
          source: 'carto-voyager',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    dark: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  };

  const getCategoryTheme = (cat: string) => {
    const s = cat.toLowerCase();
    if (s.includes('bar') || s.includes('pub') || s.includes('cocktail')) return { icon: '🍷', bg: '#f59e0b' };
    if (s.includes('cafe') || s.includes('coffee') || s.includes('bakery')) return { icon: '☕', bg: '#ea580c' };
    if (s.includes('restaurant') || s.includes('dining') || s.includes('food')) return { icon: '🍔', bg: '#ef4444' };
    if (s.includes('beauty') || s.includes('hair') || s.includes('salon') || s.includes('barber')) return { icon: '✂️', bg: '#ec4899' };
    if (s.includes('gym') || s.includes('fitness') || s.includes('yoga') || s.includes('sports')) return { icon: '🏋️', bg: '#0284c7' };
    if (s.includes('cinema') || s.includes('theater') || s.includes('movie')) return { icon: '🎬', bg: '#6366f1' };
    if (s.includes('pet') || s.includes('grooming') || s.includes('vet')) return { icon: '🐶', bg: '#10b981' };
    if (s.includes('hotel') || s.includes('lodging') || s.includes('resort')) return { icon: '🏨', bg: '#14b8a6' };
    if (s.includes('laundry') || s.includes('clean')) return { icon: '🧼', bg: '#3b82f6' };
    return { icon: '📍', bg: '#0c93e7' };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyles[mapTheme],
        center: center,
        zoom: 12,
        attributionControl: false
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }
  }, []);

  // Switch map style
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(mapStyles[mapTheme]);
    map.current.once('style.load', () => {
      updateBoundaryLayer();
    });
  }, [mapTheme]);

  // Update bounds & boundary
  useEffect(() => {
    if (!map.current) return;

    if (bbox && bbox.length === 4) {
      map.current.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]]
        ],
        { padding: 40, maxZoom: 15, duration: 1000 }
      );
    } else {
      map.current.flyTo({ center, zoom: 12, duration: 800 });
    }

    if (map.current.isStyleLoaded()) {
      updateBoundaryLayer();
    } else {
      map.current.on('load', updateBoundaryLayer);
    }
  }, [geojsonBoundary, bbox, center]);

  // Fly to selected place when user clicks directory row or map pin
  useEffect(() => {
    if (!map.current || !selectedPlaceId) return;
    const selPlace = places.find((p) => p.id === selectedPlaceId);
    if (selPlace) {
      map.current.flyTo({
        center: [selPlace.lon, selPlace.lat],
        zoom: 15,
        duration: 800
      });
    }
  }, [selectedPlaceId]);

  const updateBoundaryLayer = () => {
    if (!map.current || !geojsonBoundary) return;

    const sourceId = 'city-boundary-source';
    const fillId = 'city-boundary-fill';
    const lineId = 'city-boundary-line';

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
        type: 'Feature',
        geometry: geojsonBoundary,
        properties: {}
      });
    } else {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: geojsonBoundary,
          properties: {}
        }
      });

      map.current.addLayer({
        id: fillId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#0284c7',
          'fill-opacity': showBoundary ? 0.15 : 0
        }
      });

      map.current.addLayer({
        id: lineId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#0284c7',
          'line-width': 2.5,
          'line-opacity': showBoundary ? 0.85 : 0
        }
      });
    }
  };

  // Toggle boundary visibility
  useEffect(() => {
    if (!map.current) return;
    if (map.current.getLayer('city-boundary-fill')) {
      map.current.setLayoutProperty('city-boundary-fill', 'visibility', showBoundary ? 'visible' : 'none');
    }
    if (map.current.getLayer('city-boundary-line')) {
      map.current.setLayoutProperty('city-boundary-line', 'visibility', showBoundary ? 'visible' : 'none');
    }
  }, [showBoundary]);

  // Render Tap-Friendly DOM HTML Markers (48px x 48px hit target with overlap jitter)
  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!showPlaces) return;

    const displayPlaces = places.slice(0, 200);

    // Track coordinate frequency to offset overlapping pins in a small spiral
    const coordCountMap = new Map<string, number>();

    displayPlaces.forEach((place) => {
      const isSelected = place.id === selectedPlaceId;
      const theme = getCategoryTheme(place.category_primary || place.taxonomy_primary);

      // Micro-dispersion jitter for exact coordinate overlaps
      const coordKey = `${place.lat.toFixed(5)},${place.lon.toFixed(5)}`;
      const overlapIndex = coordCountMap.get(coordKey) || 0;
      coordCountMap.set(coordKey, overlapIndex + 1);

      let adjustedLat = place.lat;
      let adjustedLon = place.lon;

      if (overlapIndex > 0) {
        const angle = overlapIndex * 1.25;
        const radius = 0.00015 * Math.sqrt(overlapIndex);
        adjustedLat += radius * Math.sin(angle);
        adjustedLon += radius * Math.cos(angle);
      }

      // Official Google Maps Place Profile Search URL (Centered at pin at 18z)
      const googleMapsProfileUrl = getGoogleMapsProfileUrl(place);
      const socialFinderUrl = `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.address || place.locality || ''} phone email instagram facebook`)}`;

      // Large 48px x 48px tap-friendly wrapper
      const el = document.createElement('div');
      el.className = 'marker-wrapper flex items-center justify-center p-2 rounded-full cursor-pointer pointer-events-auto select-none';
      el.style.width = '48px';
      el.style.height = '48px';
      el.style.cursor = 'pointer';
      el.style.pointerEvents = 'auto';
      if (isSelected) {
        el.style.zIndex = '999';
      }

      el.innerHTML = `
        <div style="background-color: ${theme.bg}; border: ${isSelected ? '4px solid #f59e0b' : '3px solid #ffffff'}; box-shadow: ${
        isSelected ? '0 0 20px #f59e0b' : '0 8px 24px rgba(0,0,0,0.5)'
      };" 
             class="h-10 w-10 rounded-full flex items-center justify-center text-white text-[16px] font-extrabold transition-all duration-200 hover:scale-125">
          ${theme.icon}
        </div>
      `;

      // Rich Google Maps Style Popup Card
      const popupNode = document.createElement('div');
      popupNode.className = 'p-2.5 max-w-xs text-xs font-sans text-slate-100 space-y-1.5';
      popupNode.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <div class="font-extrabold text-white text-sm leading-tight">${place.name}</div>
          <span class="shrink-0 rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
            ${Math.round((place.confidence || 0.88) * 100)}% Conf
          </span>
        </div>

        <div class="text-[11px] text-brand-300 font-semibold capitalize flex items-center space-x-1">
          <span>${theme.icon}</span>
          <span>${(place.taxonomy_primary !== 'unclassified' ? place.taxonomy_primary : place.category_primary).replace(/_/g, ' ')}</span>
        </div>

        ${place.brand ? `<div class="text-[10px] text-emerald-300 font-medium">🏷️ Brand: <strong>${place.brand}</strong></div>` : ''}
        ${place.address || place.locality ? `<div class="text-[11px] text-slate-300 leading-tight">📍 ${place.address || place.locality}</div>` : ''}
        ${place.phone ? `<div class="text-[11px] text-brand-300 font-bold">📞 Phone: <a href="tel:${place.phone}" class="underline">${place.phone}</a></div>` : ''}
        ${place.email ? `<div class="text-[11px] text-emerald-300 font-bold truncate">✉️ Email: <a href="mailto:${place.email}" class="underline">${place.email}</a></div>` : ''}

        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[10px]">
          ${place.phone ? `<a href="tel:${place.phone}" class="bg-brand-600/30 hover:bg-brand-600 text-brand-300 hover:text-white px-2 py-1 rounded-lg border border-brand-500/30 transition-colors">📞 Call</a>` : ''}
          ${place.email ? `<a href="mailto:${place.email}" class="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white px-2 py-1 rounded-lg border border-emerald-500/30 transition-colors">✉️ Email</a>` : ''}
          ${place.website ? `<a href="${place.website}" target="_blank" class="bg-brand-600/30 hover:bg-brand-600 text-brand-300 hover:text-white px-2 py-1 rounded-lg border border-brand-500/30 transition-colors">🌐 Website ↗</a>` : ''}
          <a href="${googleMapsProfileUrl}" target="_blank" class="bg-brand-600 hover:bg-brand-500 text-white px-2.5 py-1 rounded-lg font-bold transition-colors">📍 Google Profile ↗</a>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 20, closeButton: true }).setDOMContent(popupNode);

      const marker = new maplibregl.Marker({ element: el, anchor: 'center', clickTolerance: 15 })
        .setLngLat([adjustedLon, adjustedLat])
        .setPopup(popup)
        .addTo(map.current!);

      const handleMarkerClick = (e: Event) => {
        e.stopPropagation();
        if (onSelectPlace) onSelectPlace(place);
      };

      el.addEventListener('click', handleMarkerClick);
      el.addEventListener('touchend', handleMarkerClick);

      markersRef.current.push(marker);
    });
  }, [places, showPlaces, selectedPlaceId]);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[420px] sm:h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Map Control Box */}
        <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl text-xs shadow-2xl text-slate-200">
          <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 px-1 mb-0.5">
            Map Style
          </div>
          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-1">
            <button
              onClick={() => setMapTheme('bright')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                mapTheme === 'bright' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setMapTheme('dark')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                mapTheme === 'dark' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark
            </button>
          </div>

          <button
            onClick={() => setShowPlaces(!showPlaces)}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-colors text-[11px] cursor-pointer ${
              showPlaces ? 'bg-brand-500/20 text-brand-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {showPlaces ? <Eye className="h-3.5 w-3.5 text-brand-400" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Business Pins ({places.length})</span>
          </button>

          <button
            onClick={() => setShowBoundary(!showBoundary)}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-colors text-[11px] cursor-pointer ${
              showBoundary ? 'bg-brand-500/20 text-brand-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {showBoundary ? <Eye className="h-3.5 w-3.5 text-brand-400" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>City Boundary</span>
          </button>
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-2xl text-xs text-slate-300 shadow-xl flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Displaying <strong className="text-white font-extrabold">{places.length}</strong> Locations</span>
        </div>
      </div>

      {/* Selected Business Profile Panel */}
      {selectedPlace && (
        <div className="p-5 rounded-2xl border border-brand-500/40 bg-gradient-to-r from-slate-900 via-brand-950/30 to-slate-900 shadow-2xl text-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-brand-400 shrink-0" />
                <span className="text-base font-extrabold text-white">{selectedPlace.name}</span>
                {selectedPlace.brand && (
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    Brand: {selectedPlace.brand}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs mt-1">
                📍 {selectedPlace.address || selectedPlace.locality || 'Coordinates recorded'} • Quality: <strong className="text-emerald-400">{Math.round((selectedPlace.confidence || 0.88) * 100)}% Confidence</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={getGoogleMapsProfileUrl(selectedPlace)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-2 font-bold shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Google Maps Profile ↗</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Category</div>
              <div className="font-bold text-brand-300 capitalize">{selectedPlace.category_primary.replace(/_/g, ' ')}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Operating Status</div>
              <div className="font-bold text-emerald-400 capitalize">{selectedPlace.operating_status || 'Operating'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Phone Contact</div>
              {selectedPlace.phone ? (
                <a href={`tel:${selectedPlace.phone}`} className="font-bold text-brand-400 hover:underline inline-flex items-center space-x-1">
                  <Phone className="h-3 w-3 shrink-0" />
                  <span>{selectedPlace.phone}</span>
                </a>
              ) : (
                <span className="text-slate-500 font-medium">Not Listed</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Email Contact</div>
              {selectedPlace.email ? (
                <a href={`mailto:${selectedPlace.email}`} className="font-bold text-emerald-400 hover:underline truncate inline-flex items-center space-x-1">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{selectedPlace.email}</span>
                </a>
              ) : (
                <span className="text-slate-500 font-medium">Not Listed</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2 md:col-span-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Official Website</div>
              {selectedPlace.website ? (
                <a href={selectedPlace.website} target="_blank" rel="noreferrer" className="font-bold text-brand-400 hover:underline inline-flex items-center space-x-1">
                  <Globe className="h-3 w-3 shrink-0" />
                  <span>Visit Website ↗</span>
                </a>
              ) : (
                <span className="text-slate-500 font-medium">Not Listed</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
