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

export function isTyping(target: EventTarget | null): boolean {
  const node = target as HTMLElement | null;
  return (
    !!node &&
    (node.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(node.tagName))
  );
}

export function isCvAvailable(): boolean {
  return process.env.NEXT_PUBLIC_CV_AVAILABLE !== "false";
}
