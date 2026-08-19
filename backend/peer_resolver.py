"""
Peer City Resolver for Global Business Gap Finder.
Identifies comparable cities based on population similarity, geographical region,
and country context.
"""

import logging
import math
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

GLOBAL_CITIES_CATALOG = [
    # Georgia & Caucasus / Eastern Europe
    {"city": "Batumi", "country": "Georgia", "population": 172100, "lat": 41.6434, "lon": 41.6399, "bbox": [41.58, 41.61, 41.68, 41.67]},
    {"city": "Kutaisi", "country": "Georgia", "population": 147600, "lat": 42.2679, "lon": 42.6946, "bbox": [42.63, 42.22, 42.75, 42.31]},
    {"city": "Yerevan", "country": "Armenia", "population": 1092800, "lat": 40.1872, "lon": 44.5152, "bbox": [44.40, 40.10, 44.62, 40.25]},
    {"city": "Sofia", "country": "Bulgaria", "population": 1280000, "lat": 42.6977, "lon": 23.3219, "bbox": [23.20, 42.60, 23.45, 42.78]},
    {"city": "Tirana", "country": "Albania", "population": 554300, "lat": 41.3275, "lon": 19.8187, "bbox": [19.72, 41.27, 19.90, 41.38]},
    {"city": "Zagreb", "country": "Croatia", "population": 769900, "lat": 45.8150, "lon": 15.9819, "bbox": [15.85, 45.75, 16.12, 45.88]},
    {"city": "Belgrade", "country": "Serbia", "population": 1380000, "lat": 44.7866, "lon": 20.4489, "bbox": [20.30, 44.70, 20.60, 44.88]},
    {"city": "Chisinau", "country": "Moldova", "population": 639000, "lat": 47.0105, "lon": 28.8638, "bbox": [28.75, 46.95, 28.95, 47.08]},
    {"city": "Skopje", "country": "North Macedonia", "population": 540000, "lat": 41.9981, "lon": 21.4254, "bbox": [21.32, 41.93, 21.53, 42.05]},
    {"city": "Sarajevo", "country": "Bosnia and Herzegovina", "population": 275000, "lat": 43.8563, "lon": 18.4131, "bbox": [18.30, 43.80, 18.48, 43.90]},
    {"city": "Tallinn", "country": "Estonia", "population": 454000, "lat": 59.4370, "lon": 24.7536, "bbox": [24.60, 59.35, 24.90, 59.50]},
    {"city": "Riga", "country": "Latvia", "population": 605000, "lat": 56.9496, "lon": 24.1052, "bbox": [23.95, 56.88, 24.25, 57.02]},
    {"city": "Vilnius", "country": "Lithuania", "population": 592000, "lat": 54.6872, "lon": 25.2797, "bbox": [25.15, 54.60, 25.40, 54.75]},
    {"city": "Warsaw", "country": "Poland", "population": 1860000, "lat": 52.2297, "lon": 21.0122, "bbox": [20.85, 52.10, 21.20, 52.35]},
    {"city": "Krakow", "country": "Poland", "population": 800000, "lat": 50.0647, "lon": 19.9450, "bbox": [19.80, 49.98, 20.10, 50.12]},

    # Western & Central Europe
    {"city": "Berlin", "country": "Germany", "population": 3755000, "lat": 52.5200, "lon": 13.4050, "bbox": [13.10, 52.35, 13.75, 52.65]},
    {"city": "Munich", "country": "Germany", "population": 1488000, "lat": 48.1351, "lon": 11.5820, "bbox": [11.40, 48.05, 11.75, 48.22]},
    {"city": "Hamburg", "country": "Germany", "population": 1850000, "lat": 53.5511, "lon": 9.9937, "bbox": [9.80, 53.40, 10.20, 53.70]},
    {"city": "Vienna", "country": "Austria", "population": 1982000, "lat": 48.2082, "lon": 16.3738, "bbox": [16.20, 48.10, 16.55, 48.32]},
    {"city": "Prague", "country": "Czech Republic", "population": 1309000, "lat": 50.0755, "lon": 14.4378, "bbox": [14.25, 49.95, 14.65, 50.18]},
    {"city": "Budapest", "country": "Hungary", "population": 1752000, "lat": 47.4979, "lon": 19.0402, "bbox": [18.90, 47.38, 19.25, 47.60]},
    {"city": "Amsterdam", "country": "Netherlands", "population": 872000, "lat": 52.3676, "lon": 4.9041, "bbox": [4.75, 52.30, 5.05, 52.42]},
    {"city": "Brussels", "country": "Belgium", "population": 1220000, "lat": 50.8503, "lon": 4.3517, "bbox": [4.25, 50.80, 4.45, 50.92]},
    {"city": "Zurich", "country": "Switzerland", "population": 435000, "lat": 47.3769, "lon": 8.5417, "bbox": [8.45, 47.32, 8.62, 47.43]},

    # Southern Europe
    {"city": "Valencia", "country": "Spain", "population": 841558, "lat": 39.4697, "lon": -0.3763, "bbox": [-0.43, 39.27, -0.27, 39.56]},
    {"city": "Madrid", "country": "Spain", "population": 3223000, "lat": 40.4168, "lon": -3.7038, "bbox": [-3.85, 40.30, -3.55, 40.52]},
    {"city": "Barcelona", "country": "Spain", "population": 1636000, "lat": 41.3851, "lon": 2.1734, "bbox": [2.08, 41.32, 2.25, 41.46]},
    {"city": "Rome", "country": "Italy", "population": 2873000, "lat": 41.9028, "lon": 12.4964, "bbox": [12.35, 41.80, 12.65, 42.00]},
    {"city": "Milan", "country": "Italy", "population": 1378000, "lat": 45.4642, "lon": 9.1900, "bbox": [9.05, 45.38, 9.30, 45.54]},
    {"city": "Athens", "country": "Greece", "population": 664000, "lat": 37.9838, "lon": 23.7275, "bbox": [23.65, 37.90, 23.80, 38.05]},
    {"city": "Lisbon", "country": "Portugal", "population": 545000, "lat": 38.7223, "lon": -9.1393, "bbox": [-9.25, 38.68, -9.08, 38.80]},
    {"city": "Porto", "country": "Portugal", "population": 231000, "lat": 41.1579, "lon": -8.6291, "bbox": [-8.70, 41.12, -8.55, 41.20]}
]


def find_peer_cities(target_city: str, target_country: str, target_population: int, limit: int = 4) -> List[Dict[str, Any]]:
    """
    Find peer comparison cities using population similarity ratio.
    Prefers same country or same region for speed and relevance.
    """
    if target_population <= 0:
        target_population = 1000000
        
    candidates = []
    
    for item in GLOBAL_CITIES_CATALOG:
        c_name = item["city"]
        c_country = item["country"]
        c_pop = item["population"]
        
        if c_name.lower() == target_city.lower() and c_country.lower() == target_country.lower():
            continue
            
        ratio = c_pop / target_population if target_population > 0 else 1.0
        
        if 0.3 <= ratio <= 3.0:
            pop_diff = abs(c_pop - target_population)
            pop_score = math.exp(-pop_diff / max(target_population, 100000))
            
            same_country = (c_country.lower() == target_country.lower())
            final_score = pop_score * (2.5 if same_country else 1.0)
            
            cand = dict(item)
            cand["population_ratio"] = round(ratio, 2)
            cand["match_score"] = round(final_score, 3)
            cand["same_country"] = same_country
            candidates.append(cand)
            
    candidates.sort(key=lambda x: x["match_score"], reverse=True)
    
    if len(candidates) < limit:
        remaining = [c for c in GLOBAL_CITIES_CATALOG if c["city"].lower() != target_city.lower()]
        remaining.sort(key=lambda x: abs(x["population"] - target_population))
        for r in remaining:
            if not any(c["city"] == r["city"] for c in candidates):
                r_copy = dict(r)
                r_copy["population_ratio"] = round(r["population"] / target_population, 2)
                r_copy["match_score"] = 0.5
                r_copy["same_country"] = (r["country"].lower() == target_country.lower())
                candidates.append(r_copy)
            if len(candidates) >= limit:
                break
                
    return candidates[:limit]
