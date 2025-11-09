// utils/map-preprocessor.ts
import { iso2CodesByCountry } from "./country-iso-codes";

export function preprocessMapData(rawData: any[]): { 'hc-key': string; value: number }[] {
  return rawData
    .map(entry => {
      const iso = iso2CodesByCountry[entry.country.trim().toLowerCase()];
      if (!iso) return null;  // Skip unrecognized locations
      return {
        'hc-key': iso.toLowerCase(),
        value: entry.count
      };
    })
    .filter((d): d is { 'hc-key': string; value: number } => d !== null);
}
