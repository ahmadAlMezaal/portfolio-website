const OPEN_SHORTCUTS = "portfolio:open-shortcuts";

export function openShortcuts() {
  window.dispatchEvent(new CustomEvent(OPEN_SHORTCUTS));
}

export function onOpenShortcuts(handler: () => void): () => void {
  window.addEventListener(OPEN_SHORTCUTS, handler);
  return () => window.removeEventListener(OPEN_SHORTCUTS, handler);
}
