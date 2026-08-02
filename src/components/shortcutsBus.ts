const OPEN_SHORTCUTS = "portfolio:open-shortcuts";
const OPEN_COMMAND_PALETTE = "portfolio:open-command-palette";
const OPEN_CONTACT_MODAL = "portfolio:open-contact-modal";

export const openShortcuts = () => {
  window.dispatchEvent(new CustomEvent(OPEN_SHORTCUTS));
};

export const onOpenShortcuts = (handler: () => void): () => void => {
  window.addEventListener(OPEN_SHORTCUTS, handler);
  return () => window.removeEventListener(OPEN_SHORTCUTS, handler);
};

export const openCommandPalette = () => {
  window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE));
};

export const onOpenCommandPalette = (handler: () => void): () => void => {
  window.addEventListener(OPEN_COMMAND_PALETTE, handler);
  return () => window.removeEventListener(OPEN_COMMAND_PALETTE, handler);
};

export const openContactModal = () => {
  window.dispatchEvent(new CustomEvent(OPEN_CONTACT_MODAL));
};

export const onOpenContactModal = (handler: () => void): () => void => {
  window.addEventListener(OPEN_CONTACT_MODAL, handler);
  return () => window.removeEventListener(OPEN_CONTACT_MODAL, handler);
};
