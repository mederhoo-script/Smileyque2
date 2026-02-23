/** Map of color names (lowercase) to approximate CSS hex colors for product swatches.
 *  Keys are sorted longest-first inside getSwatchColor to prevent substring false matches
 *  (e.g. "rose gold" must be matched before "rose" or "gold").
 */
export const COLOR_MAP: Record<string, string> = {
  "rose gold":     "#B76E79",
  "midnight blue": "#191970",
  ivory:           "#FFFFF0",
  black:           "#1a1a1a",
  white:           "#FFFFFF",
  gold:            "#C9A96E",
  navy:            "#1B2A4A",
  red:             "#C0392B",
  blue:            "#2980B9",
  green:           "#27AE60",
  pink:            "#E91E8C",
  purple:          "#8E44AD",
  brown:           "#795548",
  beige:           "#F5F0E8",
  cream:           "#FFFDD0",
  silver:          "#B2BEB5",
  grey:            "#9E9E9E",
  gray:            "#9E9E9E",
  orange:          "#E67E22",
  yellow:          "#F1C40F",
  turquoise:       "#1ABC9C",
  burgundy:        "#800020",
  maroon:          "#800000",
  coral:           "#FF6B6B",
  rose:            "#E8B4B8",
  midnight:        "#191970",
  sand:            "#C2B280",
  wine:            "#722F37",
  champagne:       "#F7E7CE",
  olive:           "#808000",
  charcoal:        "#36454F",
  teal:            "#008080",
  peach:           "#FFCBA4",
  lilac:           "#C8A2C8",
  emerald:         "#50C878",
  cobalt:          "#0047AB",
  mustard:         "#FFDB58",
};

// Pre-sort keys by length descending so multi-word keys match before their substrings
const SORTED_KEYS = Object.keys(COLOR_MAP).sort((a, b) => b.length - a.length);

export function getSwatchColor(name: string): string {
  const lower = name.toLowerCase();
  for (const key of SORTED_KEYS) {
    if (lower.includes(key)) return COLOR_MAP[key];
  }
  return "#D4AF37"; // fallback gold
}
