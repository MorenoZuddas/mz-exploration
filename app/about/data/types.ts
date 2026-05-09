export type AboutIconName =
  | 'Code2'
  | 'Smartphone'
  | 'Cpu'
  | 'Network'
  | 'Users'
  | 'Activity'
  | 'Plane'
  | 'Lightbulb'
  | 'Puzzle'
  | 'Mail'
  | 'Github'
  | 'Linkedin'
  | 'ExternalLink';

export interface AboutHeroData {
  headline: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  favoriteQuote?: {
    text: string;
    source?: string;
  };
}

export interface AboutSkillData {
  category: string;
  name: string;
  description: string;
  icon: AboutIconName;
  tone?: string; // Colore della flip-card: 'blue'|'purple'|'pear'|'crimson'|'navy'|'black'
}

export interface AboutPassionData {
  title: string;
  description: string;
  icon: AboutIconName;
  tone?: string; // Colore della flip-card
}

export interface AboutContactData {
  label: string;
  href: string;
  icon: AboutIconName;
}

export interface AboutContentData {
  hero: AboutHeroData;
  mission: {
    title: string;
    paragraphs: string[];
  };
  skills: AboutSkillData[];
  passions: AboutPassionData[];
  contacts: AboutContactData[];
}

