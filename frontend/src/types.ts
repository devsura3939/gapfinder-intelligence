export interface CategoryInfo {
  id: string;
  title: string;
  family: string;
  keywords: string[];
  overture_keys: string[];
  hierarchy_matchers: string[];
}

export interface CategoryFamily {
  title: string;
  icon: string;
  description: string;
}

export interface Place {
  id: string;
  name: string;
  category_primary: string;
  category_alternates: string[];
  basic_category: string;
  taxonomy_primary: string;
  taxonomy_hierarchy: string[];
  confidence: number;
  operating_status: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  social: string | null;
  brand: string | null;
  address: string | null;
  locality: string | null;
  lat: number;
  lon: number;
  source: string;
  release: string;
}

export interface PeerCityResult {
  city: string;
  country: string;
  population: number;
  existing_count: number;
  per_10k: number;
  avg_confidence: number;
}

export interface MarketAnalysisResponse {
  target_city: string;
  target_population: number;
  population_year: string;
  category_title: string;
  category_info: CategoryInfo;
  existing_count: number;
  per_10k: number;
  benchmark_per_10k: number;
  expected_count: number;
  estimated_gap: number;
  gap_percent: number;
  opportunity_score: number;
  opportunity_label: string;
  data_confidence_score: number;
  explanation: string;
  peer_cities: PeerCityResult[];
  matched_places: Place[];
  city_metadata: {
    city: string;
    country: string;
    lat: number;
    lon: number;
    bbox: [number, number, number, number];
    geojson: any;
    population: number;
    population_year: string;
    population_source: string;
    release: string;
  };
  neighborhood_density: {
    'North-West': number;
    'North-East': number;
    'South-West': number;
    'South-East': number;
  };
  metrics_breakdown: {
    gap_score: number;
    undersupply_percentile: number;
    market_size_score: number;
    poi_confidence: number;
    peer_count_score: number;
    consistency_score: number;
  };
}

export interface OpportunityItem {
  category_id: string;
  category_title: string;
  family: string;
  family_title: string;
  existing_count: number;
  per_10k: number;
  benchmark_per_10k: number;
  expected_count: number;
  estimated_gap: number;
  gap_percent: number;
  opportunity_score: number;
  opportunity_label: string;
  data_confidence_score: number;
}

export interface OpportunitiesScanResponse {
  city: string;
  country: string;
  population: number;
  population_year: string;
  total_categories_scanned: number;
  opportunities: OpportunityItem[];
}
