export const EASE_OUT = [0.32, 0.72, 0, 1] as const;
export const EASE_IN = [0.55, 0, 1, 0.45] as const;

export const SPRING_PILL = {
  type: 'spring' as const,
  duration: 0.35,
  bounce: 0,
};

export const TIMING = {
  fast: 0.16,
  panel: 0.24,
  page: 0.3,
  hero: 0.58,
  stagger: 0.045,
} as const;
