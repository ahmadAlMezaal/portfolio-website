const OPEN_SHORTCUTS = "portfolio:open-shortcuts";
const OPEN_COMMAND_PALETTE = "portfolio:open-command-palette";

export function openShortcuts() {
  window.dispatchEvent(new CustomEvent(OPEN_SHORTCUTS));
}

export function onOpenShortcuts(handler: () => void): () => void {
  window.addEventListener(OPEN_SHORTCUTS, handler);
  return () => window.removeEventListener(OPEN_SHORTCUTS, handler);
}

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE));
}

export function onOpenCommandPalette(handler: () => void): () => void {
  window.addEventListener(OPEN_COMMAND_PALETTE, handler);
  return () => window.removeEventListener(OPEN_COMMAND_PALETTE, handler);
}
