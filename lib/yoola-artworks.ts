import type { ArtworkOrientation } from "@/lib/archive-data.types";

export type YoolaArtworkCatalogItem = {
  category: string;
  filename: string;
  height: number;
  label: string;
  note: string;
  orientation: ArtworkOrientation;
  publicPath: string;
  rarity: string;
  slug: string;
  title: string;
  width: number;
  year: string;
};

export const yoolaArtworkCatalog = [
  {
    category: "PORTRAIT",
    filename: "bandaged-violet-closeup.png",
    height: 2124,
    label: "ARC-01",
    note: "A close violet portrait with a nose bandage, loose sketch lines, and warm blush tones.",
    orientation: "portrait",
    publicPath: "/artworks/bandaged-violet-closeup.png",
    rarity: "SSR",
    slug: "starter-signal",
    title: "Bandaged Violet Close-Up",
    width: 1440,
    year: "2026",
  },
  {
    category: "MOOD",
    filename: "reclining-rain-glance.png",
    height: 680,
    label: "ARC-02",
    note: "A reclining rain-lit glance with a small heart mark and soft ochre background.",
    orientation: "landscape",
    publicPath: "/artworks/reclining-rain-glance.png",
    rarity: "SR",
    slug: "pitline-static",
    title: "Reclining Rain Glance",
    width: 1024,
    year: "2026",
  },
  {
    category: "ARMOR",
    filename: "armored-violet-rider.png",
    height: 1440,
    label: "ARC-03",
    note: "A wide armored rider portrait with violet hair sweeping through a pale sky field.",
    orientation: "landscape",
    publicPath: "/artworks/armored-violet-rider.png",
    rarity: "SSR",
    slug: "horizon-break",
    title: "Armored Violet Rider",
    width: 2400,
    year: "2026",
  },
  {
    category: "STUDY",
    filename: "violet-face-study.png",
    height: 578,
    label: "ARC-04",
    note: "A compact face study centered on violet eyes, sharp brows, and cropped hair movement.",
    orientation: "landscape",
    publicPath: "/artworks/violet-face-study.png",
    rarity: "UR",
    slug: "trackside-idol",
    title: "Violet Face Study",
    width: 624,
    year: "2026",
  },
  {
    category: "MASK",
    filename: "masked-hat-profile.png",
    height: 1440,
    label: "ARC-05",
    note: "A square side profile framed by a violet hat, mask hardware, and high-contrast sketch strokes.",
    orientation: "square",
    publicPath: "/artworks/masked-hat-profile.png",
    rarity: "SR",
    slug: "neon-silence",
    title: "Masked Hat Profile",
    width: 1442,
    year: "2026",
  },
  {
    category: "MASK",
    filename: "masked-hat-portrait.png",
    height: 1960,
    label: "ARC-06",
    note: "A full torso masked-hat portrait with strong orange body color and black-violet costume shapes.",
    orientation: "portrait",
    publicPath: "/artworks/masked-hat-portrait.png",
    rarity: "SSR",
    slug: "pulse-vector",
    title: "Masked Hat Portrait",
    width: 1440,
    year: "2026",
  },
  {
    category: "STUDY",
    filename: "studio-violet-headshot.png",
    height: 618,
    label: "ARC-07",
    note: "A studio screenshot headshot study with visible drawing panels and a loose violet hair pass.",
    orientation: "landscape",
    publicPath: "/artworks/studio-violet-headshot.png",
    rarity: "R",
    slug: "crowd-transmission",
    title: "Studio Violet Headshot",
    width: 866,
    year: "2026",
  },
  {
    category: "MOOD",
    filename: "amber-salute-closeup.png",
    height: 1440,
    label: "ARC-08",
    note: "An amber close-up with a hand near the brow, sweat highlights, and saturated violet shadows.",
    orientation: "landscape",
    publicPath: "/artworks/amber-salute-closeup.png",
    rarity: "SSR",
    slug: "violet-draft",
    title: "Amber Salute Close-Up",
    width: 2360,
    year: "2026",
  },
  {
    category: "SKETCH",
    filename: "grayscale-back-study.png",
    height: 600,
    label: "ARC-09",
    note: "A grayscale back anatomy sketch captured inside the drawing workspace.",
    orientation: "landscape",
    publicPath: "/artworks/grayscale-back-study.png",
    rarity: "SR",
    slug: "token-glare",
    title: "Grayscale Back Study",
    width: 672,
    year: "2026",
  },
  {
    category: "SKETCH",
    filename: "orange-duo-sketch.png",
    height: 2360,
    label: "ARC-10",
    note: "An orange two-character sketch with crown-like headwear, catlike ears, and bright rough-line energy.",
    orientation: "portrait",
    publicPath: "/artworks/orange-duo-sketch.png",
    rarity: "UR",
    slug: "final-overtake",
    title: "Orange Duo Sketch",
    width: 1440,
    year: "2026",
  },
] as const satisfies YoolaArtworkCatalogItem[];

export function getYoolaArtworkCatalogItem(slug: string | null | undefined) {
  return yoolaArtworkCatalog.find((artwork) => artwork.slug === slug) ?? null;
}
