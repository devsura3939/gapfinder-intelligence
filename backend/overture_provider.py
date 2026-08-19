"""
Overture Maps Places Data Provider.
Queries DuckDB S3 GeoParquet for Overture Places with spatial filtering,
taxonomy mapping, contact details (phone, email, website), and data quality cleaning.
Uses Shapely prepared geometry (prep) for ultra-fast point-in-polygon checks.
"""

import logging
import re
import httpx
import xml.etree.ElementTree as ET
import duckdb
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from shapely.geometry import shape, Point
from shapely.prepared import prep

logger = logging.getLogger(__name__)

_duckdb_conn = None
_latest_release = None

def get_duckdb_connection():
    global _duckdb_conn
    if _duckdb_conn is None:
        conn = duckdb.connect(database=':memory:')
        conn.execute("INSTALL spatial; LOAD spatial;")
        conn.execute("INSTALL httpfs; LOAD httpfs;")
        conn.execute("SET s3_region='us-west-2';")
        _duckdb_conn = conn
    return _duckdb_conn


def resolve_latest_release() -> str:
    global _latest_release
    if _latest_release:
        return _latest_release
    try:
        url = 'https://overturemaps-us-west-2.s3.amazonaws.com/?list-type=2&prefix=release/&delimiter=/'
        resp = httpx.get(url, timeout=6.0)
        root = ET.fromstring(resp.text)
        ns = {'s3': 'http://s3.amazonaws.com/doc/2006-03-01/'}
        prefixes = [p.find('s3:Prefix', ns).text for p in root.findall('s3:CommonPrefixes', ns)]
        releases = []
        for p in prefixes:
            m = re.search(r'release/([\d\.\-]+)/', p)
            if m:
                releases.append(m.group(1))
        if releases:
            releases.sort()
            _latest_release = releases[-1]
            return _latest_release
    except Exception as e:
        logger.warning(f"Failed to fetch dynamic Overture release list: {e}")
    _latest_release = '2026-07-22.0'
    return _latest_release


def safe_list(val) -> list:
    if val is None:
        return []
    if isinstance(val, (list, tuple)):
        return list(val)
    try:
        if pd.isna(val):
            return []
        if isinstance(val, np.ndarray):
            return val.tolist()
    except Exception:
        pass
    try:
        return list(val)
    except Exception:
        return []


def fetch_city_places(
    bbox: List[float], 
    geojson_boundary: Optional[Dict[str, Any]] = None,
    min_confidence: float = 0.1,
    max_limit: int = 35000
) -> List[Dict[str, Any]]:
    """
    Fetch all Overture Places in a bounding box [minx, miny, maxx, maxy].
    Applies Shapely prepared polygon containment for high performance.
    """
    conn = get_duckdb_connection()
    release = resolve_latest_release()
    s3_path = f"s3://overturemaps-us-west-2/release/{release}/theme=places/type=place/*"
    
    minx, miny, maxx, maxy = bbox
    
    dx = maxx - minx
    dy = maxy - miny
    if dx > 0.35:
        mid_x = (minx + maxx) / 2.0
        minx = mid_x - 0.175
        maxx = mid_x + 0.175
    if dy > 0.35:
        mid_y = (miny + maxy) / 2.0
        miny = mid_y - 0.175
        maxy = mid_y + 0.175
    
    query = f"""
    SELECT 
        id,
        names.primary as name,
        categories.primary as category_primary,
        categories.alternate as category_alternates,
        basic_category,
        taxonomy.primary as taxonomy_primary,
        taxonomy.hierarchy as taxonomy_hierarchy,
        confidence,
        operating_status,
        websites[1] as website,
        phones[1] as phone,
        emails[1] as email,
        socials[1] as social,
        brand.names.primary as brand,
        addresses[1].freeform as address,
        addresses[1].locality as locality,
        ST_X(geometry) as lon,
        ST_Y(geometry) as lat
    FROM read_parquet('{s3_path}')
    WHERE bbox.xmin >= {minx} AND bbox.xmax <= {maxx} 
      AND bbox.ymin >= {miny} AND bbox.ymax <= {maxy}
      AND (operating_status IS NULL OR operating_status != 'permanently_closed')
      AND (confidence IS NULL OR confidence >= {min_confidence})
    LIMIT {max_limit};
    """
    
    try:
        df = conn.execute(query).df()
    except Exception as e:
        logger.error(f"DuckDB Overture query error: {e}")
        return []

    if df is None or getattr(df, 'empty', True):
        logger.warning(f"No POIs returned from DuckDB query for bbox {bbox}.")
        return []

    prep_poly = None
    if geojson_boundary:
        try:
            poly_geom = shape(geojson_boundary)
            prep_poly = prep(poly_geom)
        except Exception as pe:
            logger.warning(f"Failed to parse city boundary geojson: {pe}")
            
    places = []
    for row in df.itertuples():
        lon, lat = getattr(row, 'lon', None), getattr(row, 'lat', None)
        if lon is None or lat is None or pd.isna(lon) or pd.isna(lat):
            continue
            
        if prep_poly and dx <= 0.35 and dy <= 0.35:
            pt = Point(lon, lat)
            if not prep_poly.contains(pt):
                continue
                
        hier = safe_list(getattr(row, 'taxonomy_hierarchy', None))
        alt_cats = safe_list(getattr(row, 'category_alternates', None))
        
        c_prim = getattr(row, 'category_primary', None)
        b_cat = getattr(row, 'basic_category', None)
        t_prim = getattr(row, 'taxonomy_primary', None)
        conf = getattr(row, 'confidence', None)
        op_stat = getattr(row, 'operating_status', None)
        web = getattr(row, 'website', None)
        ph = getattr(row, 'phone', None)
        em = getattr(row, 'email', None)
        soc = getattr(row, 'social', None)
        br = getattr(row, 'brand', None)
        addr = getattr(row, 'address', None)
        loc = getattr(row, 'locality', None)
        nm = getattr(row, 'name', None)
        
        place_obj = {
            "id": str(getattr(row, 'id', '')),
            "name": str(nm) if (nm is not None and str(nm) != 'nan') else "Unnamed Business",
            "category_primary": str(c_prim) if (c_prim is not None and str(c_prim) != 'nan') else "unclassified",
            "category_alternates": [str(c) for c in alt_cats if c is not None],
            "basic_category": str(b_cat) if (b_cat is not None and str(b_cat) != 'nan') else "unclassified",
            "taxonomy_primary": str(t_prim) if (t_prim is not None and str(t_prim) != 'nan') else "unclassified",
            "taxonomy_hierarchy": [str(h) for h in hier if h is not None],
            "confidence": float(conf) if (conf is not None and not (isinstance(conf, float) and np.isnan(conf))) else 0.5,
            "operating_status": str(op_stat) if (op_stat is not None and str(op_stat) != 'nan') else "operating",
            "website": str(web) if (web is not None and str(web) != 'nan') else None,
            "phone": str(ph) if (ph is not None and str(ph) != 'nan') else None,
            "email": str(em) if (em is not None and str(em) != 'nan') else None,
            "social": str(soc) if (soc is not None and str(soc) != 'nan') else None,
            "brand": str(br) if (br is not None and str(br) != 'nan') else None,
            "address": str(addr) if (addr is not None and str(addr) != 'nan') else None,
            "locality": str(loc) if (loc is not None and str(loc) != 'nan') else None,
            "lon": float(lon),
            "lat": float(lat),
            "source": "Overture Maps Places",
            "release": release
        }
        places.append(place_obj)
        
    logger.info(f"Retrieved {len(places)} places from Overture Maps release {release}.")
    return places
