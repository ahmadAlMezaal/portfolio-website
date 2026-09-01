import type { Coordinates } from "@/types";

const CITIES: Record<string, Coordinates> = {
  london: { lat: 51.5074, lon: -0.1278 },
  manchester: { lat: 53.4808, lon: -2.2426 },
  edinburgh: { lat: 55.9533, lon: -3.1883 },
  dublin: { lat: 53.3498, lon: -6.2603 },
  paris: { lat: 48.8566, lon: 2.3522 },
  berlin: { lat: 52.52, lon: 13.405 },
  amsterdam: { lat: 52.3676, lon: 4.9041 },
  brussels: { lat: 50.8503, lon: 4.3517 },
  zurich: { lat: 47.3769, lon: 8.5417 },
  munich: { lat: 48.1351, lon: 11.582 },
  copenhagen: { lat: 55.6761, lon: 12.5683 },
  stockholm: { lat: 59.3293, lon: 18.0686 },
  oslo: { lat: 59.9139, lon: 10.7522 },
  helsinki: { lat: 60.1699, lon: 24.9384 },
  madrid: { lat: 40.4168, lon: -3.7038 },
  barcelona: { lat: 41.3874, lon: 2.1686 },
  lisbon: { lat: 38.7223, lon: -9.1393 },
  rome: { lat: 41.9028, lon: 12.4964 },
  milan: { lat: 45.4642, lon: 9.19 },
  vienna: { lat: 48.2082, lon: 16.3738 },
  prague: { lat: 50.0755, lon: 14.4378 },
  warsaw: { lat: 52.2297, lon: 21.0122 },
  athens: { lat: 37.9838, lon: 23.7275 },
  istanbul: { lat: 41.0082, lon: 28.9784 },
  moscow: { lat: 55.7558, lon: 37.6173 },
  dubai: { lat: 25.2048, lon: 55.2708 },
  "abu dhabi": { lat: 24.4539, lon: 54.3773 },
  doha: { lat: 25.2854, lon: 51.531 },
  riyadh: { lat: 24.7136, lon: 46.6753 },
  "kuwait city": { lat: 29.3759, lon: 47.9774 },
  manama: { lat: 26.2285, lon: 50.586 },
  amman: { lat: 31.9454, lon: 35.9284 },
  beirut: { lat: 33.8938, lon: 35.5018 },
  cairo: { lat: 30.0444, lon: 31.2357 },
  lagos: { lat: 6.5244, lon: 3.3792 },
  nairobi: { lat: -1.2921, lon: 36.8219 },
  "cape town": { lat: -33.9249, lon: 18.4241 },
  johannesburg: { lat: -26.2041, lon: 28.0473 },
  "new york": { lat: 40.7128, lon: -74.006 },
  boston: { lat: 42.3601, lon: -71.0589 },
  toronto: { lat: 43.6532, lon: -79.3832 },
  chicago: { lat: 41.8781, lon: -87.6298 },
  austin: { lat: 30.2672, lon: -97.7431 },
  denver: { lat: 39.7392, lon: -104.9903 },
  seattle: { lat: 47.6062, lon: -122.3321 },
  vancouver: { lat: 49.2827, lon: -123.1207 },
  "san francisco": { lat: 37.7749, lon: -122.4194 },
  "los angeles": { lat: 34.0522, lon: -118.2437 },
  "mexico city": { lat: 19.4326, lon: -99.1332 },
  "sao paulo": { lat: -23.5505, lon: -46.6333 },
  "rio de janeiro": { lat: -22.9068, lon: -43.1729 },
  "buenos aires": { lat: -34.6037, lon: -58.3816 },
  bogota: { lat: 4.711, lon: -74.0721 },
  lima: { lat: -12.0464, lon: -77.0428 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  delhi: { lat: 28.6139, lon: 77.209 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  hyderabad: { lat: 17.385, lon: 78.4867 },
  karachi: { lat: 24.8607, lon: 67.0011 },
  lahore: { lat: 31.5204, lon: 74.3587 },
  dhaka: { lat: 23.8103, lon: 90.4125 },
  bangkok: { lat: 13.7563, lon: 100.5018 },
  singapore: { lat: 1.3521, lon: 103.8198 },
  "kuala lumpur": { lat: 3.139, lon: 101.6869 },
  jakarta: { lat: -6.2088, lon: 106.8456 },
  manila: { lat: 14.5995, lon: 120.9842 },
  "ho chi minh city": { lat: 10.8231, lon: 106.6297 },
  hanoi: { lat: 21.0278, lon: 105.8342 },
  "hong kong": { lat: 22.3193, lon: 114.1694 },
  shanghai: { lat: 31.2304, lon: 121.4737 },
  beijing: { lat: 39.9042, lon: 116.4074 },
  shenzhen: { lat: 22.5431, lon: 114.0579 },
  seoul: { lat: 37.5665, lon: 126.978 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  osaka: { lat: 34.6937, lon: 135.5023 },
  taipei: { lat: 25.033, lon: 121.5654 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  melbourne: { lat: -37.8136, lon: 144.9631 },
  brisbane: { lat: -27.4698, lon: 153.0251 },
  perth: { lat: -31.9505, lon: 115.8605 },
  auckland: { lat: -36.8485, lon: 174.7633 },
  wellington: { lat: -41.2865, lon: 174.7762 },
};

const normalise = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const lookupPlace = (location: string): Coordinates | null => {
  for (const part of location.split(",")) {
    const match = CITIES[normalise(part)];
    if (match) return match;
  }
  return null;
};

export const resolveCoordinates = (place: {
  location: string;
  coordinates?: Coordinates;
}): Coordinates | null => place.coordinates ?? lookupPlace(place.location);
