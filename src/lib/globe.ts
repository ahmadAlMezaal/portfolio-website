import type { Coordinates } from "@/types";

export const LAND_STEP = 2.5;
export const LAND_LAT_MAX = 84;

const LAND_MASK =
  "P/58/+Pz//wfw///AD4P//8AAYB/v/wAAAAD9/8AAAQAAICUAAAAQAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAABIAAAAAAAAAAAAAAwAAAAAQAAAAAAAABgAAAAA" +
  "AAAAAgAAAADgAAAAAAAAAAIAAAAAcAAAAAAAAAAQEAAAAAHAAAAAAAAAAAAIAAAAAPgAAAAAAAAA" +
  "BwAAAAAAB+AAABAAAAAYPgAAAAAAA/AAAA8AAAAD/8AAAAAAAH+AAAD8AAAAH/8AAAAAAAB/gAAB" +
  "/AAAAB//gAAAAAAAH/AAAD/EAAAD//AAAAAAAAH/wAAB/iAAAA//gAAAAAAAA//AAAf8YAAAA/8A" +
  "CAAAAAAH/+AAA/+YAAAAfIAAAAAAAAH/+AAAf/EAAAABgAAAAAAAAB//wAAD/4AAAAAAAAAAAAAA" +
  "Af//gAAP/AAAAAACgAAAAAAAB//+AAA/8AAAAQAPAAAAAAAAD//4AAB/8AAABiw8AAAAAAAAD//A" +
  "AAD/+AAABOhAAAAAAAAAB/+AAAD//AAADPEAAAAAAAAAA/8AAAD//gAAFCAAAAAAAAAAB/gAAPv/" +
  "/gAACCQAAAAAAAAAL+AAB////AAgQAAAAAAAAAACGAAAP///sAIAwAAAAAAAAAAwAAAD///+ADAe" +
  "CAAAAAAAADgAAAB///7wDgeEAAAAAAAAOwcAAB///n4Hh6AAAAAAAABxEAAAP//9/A+fQAAAAAAA" +
  "A8AAAAD//+/h//8AAAAAAAB4AAAAH//3x///4AAAAAAAfBAAAA///7///+AAAAAAB/+AAAA/73//" +
  "//4AAAAAAf/wAAAPwD////4AAAAAB//wAAAHAP///+TAAAAA//4AAA4B/P//8gAAAAD//wAAHC35" +
  "///4gAAAB//wAAL3jf///mAAAA///AAD/nf///gAAAD//sAB//////wAAAf//AAP/////4AAAf/f" +
  "ABX/////EAAf+OAAA////wgCP/HAAM////CB//jCAO////2D/9JgD/////f/zcw9///9/rTwPP//" +
  "5BeeBA/+ALjwCfAAQ8AGQA/EAAD4AAAAAA==";

const decodeMask = (encoded: string): Uint8Array => {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

export const bandSampleCount = (lat: number): number =>
  Math.max(1, Math.round((360 / LAND_STEP) * Math.cos((lat * Math.PI) / 180)));

export const landPoints = (): Coordinates[] => {
  const bytes = decodeMask(LAND_MASK);
  const points: Coordinates[] = [];
  let bit = 0;

  for (let lat = -LAND_LAT_MAX; lat <= LAND_LAT_MAX + 1e-9; lat += LAND_STEP) {
    const samples = bandSampleCount(lat);
    for (let i = 0; i < samples; i++, bit++) {
      if ((bytes[bit >> 3] & (128 >> (bit & 7))) === 0) continue;
      points.push({ lat, lon: -180 + (360 * i) / samples });
    }
  }

  return points;
};

export type Projected = { x: number; y: number; z: number };

const RAD = Math.PI / 180;

export const project = (
  point: Coordinates,
  yaw: number,
  pitch: number
): Projected => {
  const phi = point.lat * RAD;
  const lambda = point.lon * RAD - yaw;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);

  return {
    x: cosPhi * Math.sin(lambda),
    y: cosPitch * sinPhi - sinPitch * cosPhi * Math.cos(lambda),
    z: sinPitch * sinPhi + cosPitch * cosPhi * Math.cos(lambda),
  };
};

export const graticule = (): Coordinates[][] => {
  const lines: Coordinates[][] = [];

  for (let lon = -180; lon < 180; lon += 30) {
    const meridian: Coordinates[] = [];
    for (let lat = -90; lat <= 90; lat += 3) meridian.push({ lat, lon });
    lines.push(meridian);
  }

  for (let lat = -60; lat <= 60; lat += 30) {
    const parallel: Coordinates[] = [];
    for (let lon = -180; lon <= 180; lon += 3) parallel.push({ lat, lon });
    lines.push(parallel);
  }

  return lines;
};
