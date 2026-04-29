export interface HomeHero {
  title: string;
  subtitle: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface HomeFeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  gradientClass: string;
}

export interface HomeStat {
  id: string;
  label: string;
  value: string;
}

export interface HomeCta {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface HomeContent {
  hero: HomeHero;
  introTitle: string;
  introText: string;
  featuresTitle: string;
  features: HomeFeatureCard[];
  statsTitle: string;
  stats: HomeStat[];
  finalCta: HomeCta;
}
