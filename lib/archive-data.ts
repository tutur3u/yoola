export type ArtworkCategory = 'SPEED' | 'STAMINA' | 'POWER' | 'GUTS' | 'WISDOM';
export type ArtworkOrientation = 'portrait' | 'landscape' | 'square';

export type ArchiveArtwork = {
  id: number;
  src: string;
  title: string;
  label: string;
  category: ArtworkCategory;
  rarity: 'R' | 'SR' | 'SSR';
  width: number;
  height: number;
  orientation: ArtworkOrientation;
  year: string;
  note: string;
};

export type LoreCapsule = {
  slug: string;
  title: string;
  channel: string;
  status: 'LOCKED' | 'IN TRANSIT' | 'STAGING';
  date: string;
  excerpt: string;
  teaser: string;
  tags: string[];
  artworkId: number;
};

export const archiveArtworks: ArchiveArtwork[] = [
  {
    id: 1,
    src: '/artworks/1.png',
    title: 'STARTER SIGNAL',
    label: 'ARC-01',
    category: 'SPEED',
    rarity: 'SSR',
    width: 1440,
    height: 2124,
    orientation: 'portrait',
    year: '2026',
    note: 'Launch-frame portrait with podium lighting and high-contrast violet bleed.',
  },
  {
    id: 2,
    src: '/artworks/2.png',
    title: 'PITLINE STATIC',
    label: 'ARC-02',
    category: 'GUTS',
    rarity: 'SR',
    width: 1024,
    height: 680,
    orientation: 'landscape',
    year: '2025',
    note: 'Low-angle scene study built around pressure, steel, and idle momentum.',
  },
  {
    id: 3,
    src: '/artworks/3.png',
    title: 'HORIZON BREAK',
    label: 'ARC-03',
    category: 'POWER',
    rarity: 'SSR',
    width: 2400,
    height: 1440,
    orientation: 'landscape',
    year: '2025',
    note: 'Wide environmental composition with broadcast-scale framing.',
  },
  {
    id: 4,
    src: '/artworks/4.png',
    title: 'TRACKSIDE IDOL',
    label: 'ARC-04',
    category: 'WISDOM',
    rarity: 'R',
    width: 624,
    height: 578,
    orientation: 'square',
    year: '2024',
    note: 'Compact square study centered on gesture, charm, and sticker-like attitude.',
  },
  {
    id: 5,
    src: '/artworks/5.png',
    title: 'NEON SILENCE',
    label: 'ARC-05',
    category: 'STAMINA',
    rarity: 'SR',
    width: 1442,
    height: 1440,
    orientation: 'square',
    year: '2026',
    note: 'Symmetrical close-frame image with soft bloom and poster-grade contrast.',
  },
  {
    id: 6,
    src: '/artworks/6.png',
    title: 'PULSE VECTOR',
    label: 'ARC-06',
    category: 'SPEED',
    rarity: 'SSR',
    width: 1440,
    height: 1960,
    orientation: 'portrait',
    year: '2025',
    note: 'Vertical acceleration piece with layered motion cues and hard edge lighting.',
  },
  {
    id: 7,
    src: '/artworks/7.png',
    title: 'CROWD TRANSMISSION',
    label: 'ARC-07',
    category: 'POWER',
    rarity: 'SR',
    width: 866,
    height: 618,
    orientation: 'landscape',
    year: '2024',
    note: 'Broadcast-style moment capture with heavy implied noise and audience energy.',
  },
  {
    id: 8,
    src: '/artworks/8.png',
    title: 'VIOLET DRAFT',
    label: 'ARC-08',
    category: 'WISDOM',
    rarity: 'SSR',
    width: 2360,
    height: 1440,
    orientation: 'landscape',
    year: '2026',
    note: 'Large-format spread with editorial negative space and directional flare.',
  },
  {
    id: 9,
    src: '/artworks/9.png',
    title: 'TOKEN GLARE',
    label: 'ARC-09',
    category: 'GUTS',
    rarity: 'R',
    width: 672,
    height: 600,
    orientation: 'square',
    year: '2023',
    note: 'Punchy square cut built like a badge or stamped collectible.',
  },
  {
    id: 10,
    src: '/artworks/10.png',
    title: 'FINAL OVERTAKE',
    label: 'ARC-10',
    category: 'STAMINA',
    rarity: 'SSR',
    width: 1440,
    height: 2360,
    orientation: 'portrait',
    year: '2026',
    note: 'Tall key visual with posterized silhouette work and ceremonial framing.',
  },
];

export const loreCapsules: LoreCapsule[] = [
  {
    slug: 'violet-horizon',
    title: 'The Violet Horizon',
    channel: 'Main Transmission',
    status: 'IN TRANSIT',
    date: '2026.04.12',
    excerpt:
      'The stadium emptied in waves, but the violet glow on the far rail refused to die. She stayed to watch it anyway, like a final split time still waiting to be read.',
    teaser:
      'A post-race scene file about silence, pressure, and the strange calm that follows a win nobody understands.',
    tags: ['MAIN_STORY', 'AFTERMATH', 'ANGST'],
    artworkId: 10,
  },
  {
    slug: 'midnight-strategy',
    title: 'Midnight Strategy',
    channel: 'Draft Capsule',
    status: 'STAGING',
    date: '2026.05.02',
    excerpt:
      'Sheets of telemetry crawled across the desk while the city outside dimmed to static. Winning stopped looking like instinct and started looking like architecture.',
    teaser:
      'A planner-room fragment built around tactics, fatigue, and the cost of optimizing everything.',
    tags: ['TACTICS', 'CHARACTER', 'EXTRA'],
    artworkId: 3,
  },
  {
    slug: 'crowd-noise-protocol',
    title: 'Crowd Noise Protocol',
    channel: 'Event Archive',
    status: 'LOCKED',
    date: '2026.05.19',
    excerpt:
      'By the time the announcement hit, the cheering had already turned into weather. She smiled at nobody in particular and adjusted her gloves like the room had gone quiet.',
    teaser:
      'An event-night placeholder file focused on public image, performance, and the split between persona and self.',
    tags: ['EVENT', 'PUBLIC_MASK', 'SLICE_OF_LIFE'],
    artworkId: 7,
  },
];

export function getArtworkById(id: number) {
  return archiveArtworks.find((artwork) => artwork.id === id);
}

export function getLoreCapsule(slug: string) {
  return loreCapsules.find((capsule) => capsule.slug === slug);
}
