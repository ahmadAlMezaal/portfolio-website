// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the base path for the application.
 * Used for constructing asset URLs that work with GitHub Pages.
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

/**
 * Construct an asset URL with the correct base path.
 * @param path - The path to the asset (e.g., "/cv.pdf", "/icon.svg")
 * @returns The full path including base path
 */
export function assetPath(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

/**
 * Check if the CV is available for download.
 * This is set during build time based on whether cv.pdf exists.
 */
export function isCvAvailable(): boolean {
  return process.env.NEXT_PUBLIC_CV_AVAILABLE === "true";
}
