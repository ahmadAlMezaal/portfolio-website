// Base path for asset URLs (GitHub Pages support).
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

export function assetPath(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const basePath = getBasePath();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

// Defaults to true; CI sets NEXT_PUBLIC_CV_AVAILABLE="false" when no CV is configured.
export function isCvAvailable(): boolean {
  return process.env.NEXT_PUBLIC_CV_AVAILABLE !== "false";
}
