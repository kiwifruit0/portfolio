// Colorschemes are pure CSS custom properties. Every theme redefines the same
// sixteen slots (named after Nord, the original palette) plus a page backdrop,
// so :colorscheme repaints the whole site without touching a single component.
export const THEMES = [
  {
    id: "nord",
    label: "nord",
    kind: "dark",
    blurb: "the original. arctic, bluish, calm.",
    pixelArt: true
  },
  {
    id: "tokyonight",
    label: "tokyonight",
    kind: "dark",
    blurb: "neon on deep navy."
  },
  {
    id: "gruvbox",
    label: "gruvbox",
    kind: "dark",
    blurb: "retro groove, warm and high contrast."
  },
  {
    id: "catppuccin",
    label: "catppuccin",
    kind: "dark",
    blurb: "mocha. soothing pastels."
  },
  {
    id: "rose-pine",
    label: "rose-pine",
    kind: "dark",
    blurb: "moon variant. all natural pine and rose."
  },
  {
    id: "everforest",
    label: "everforest",
    kind: "dark",
    blurb: "green based, easy on the eyes."
  },
  {
    id: "latte",
    label: "latte",
    kind: "light",
    blurb: "catppuccin latte. for the daylight people."
  }
];

export const DEFAULT_THEME = "nord";
const STORAGE_KEY = "portfolio:colorscheme";

export function isTheme(id) {
  return THEMES.some((theme) => theme.id === id);
}

export function loadTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function persistTheme(id) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Private browsing or blocked storage: the theme just won't survive a reload.
  }
}

export function applyTheme(id) {
  const next = isTheme(id) ? id : DEFAULT_THEME;
  document.documentElement.setAttribute("data-theme", next);
  return next;
}
