/**
 * components/icons.tsx
 *
 * Registro centralizzato di tutte le icone del sito.
 * - Icone lucide-react (UI, domain, social ove disponibili)
 * - Icone SVG custom brand (GitHub, LinkedIn)
 * - Componente <Icon> con supporto size, scheme dark/light, strokeWidth
 *
 * Uso:
 *   import { Icon, type IconName } from '@/components/Icons';
 *   <Icon name="github" size="lg" scheme="dark" />
 *
 * Per aggiungere una nuova icona:
 *   1. Importarla da lucide-react (o definire SVG custom)
 *   2. Aggiungerla a IconName e ICON_REGISTRY
 */
import {
  Activity,
  Backpack,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  ExternalLink,
  Footprints,
  Gauge,
  HeartHandshake,
  Library,
  Lightbulb,
  ListMusic,
  Mail,
  MapPin,
  Mountain,
  Network,
  Plane,
  PlaneTakeoff,
  Puzzle,
  Route,
  Ruler,
  Shirt,
  SlidersHorizontal,
  Smartphone,
  SportShoe,
  Timer,
  Users,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { SVGProps, ComponentType, CSSProperties } from 'react';

// Alias esportati per import centralizzati nei consumer (senza import diretto da lucide-react).
export const ActivityIcon = Activity;
export const BackpackIcon = Backpack;
export const CalendarDaysIcon = CalendarDays;
export const CameraIcon = Camera;
export const ChevronDownIcon = ChevronDown;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const Code2Icon = Code2;
export const CpuIcon = Cpu;
export const ExternalLinkIcon = ExternalLink;
export const FootprintsIcon = Footprints;
export const GaugeIcon = Gauge;
export const HeartHandshakeIcon = HeartHandshake;
export const LibraryIcon = Library;
export const LightbulbIcon = Lightbulb;
export const ListMusicIcon = ListMusic;
export const MailIcon = Mail;
export const MapPinIcon = MapPin;
export const MountainIcon = Mountain;
export const NetworkIcon = Network;
export const PlaneIcon = Plane;
export const PlaneTakeoffIcon = PlaneTakeoff;
export const PuzzleIcon = Puzzle;
export const RouteIcon = Route;
export const RulerIcon = Ruler;
export const ShirtIcon = Shirt;
export const SlidersHorizontalIcon = SlidersHorizontal;
export const SmartphoneIcon = Smartphone;
export const SportShoeIcon = SportShoe;
export const TimerIcon = Timer;
export const UsersIcon = Users;
export const XIcon = X;
export const ZapIcon = Zap;

// ── Re-export tipo LucideIcon per consumatori ─────────────────────────
export type { LucideIcon };

// ── SVG brand custom (non disponibili in lucide) ──────────────────────

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.493.997.106-.775.418-1.305.762-1.605-2.665-.303-5.466-1.333-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.118-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.8c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.625-5.476 5.921.43.372.823 1.103.823 2.222v3.293c0 .319.192.69.801.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12Z" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ── IconName: union di tutti i nomi icona del sito ────────────────────

export type IconName =
  // Social
  | 'github' | 'linkedin' | 'mail' | 'activity' | 'strava'
  // Sport / domain
  | 'sport-shoe' | 'mountain' | 'plane-takeoff' | 'backpack'
  | 'footprints' | 'route' | 'gauge' | 'timer' | 'ruler' | 'map-pin'
  // UI generica
  | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'x'
  | 'external-link' | 'sliders-horizontal' | 'zap'
  // Content / categorie
  | 'code2' | 'cpu' | 'network' | 'puzzle' | 'smartphone' | 'users'
  | 'lightbulb' | 'heart-handshake' | 'plane'
  // Media
  | 'camera' | 'list-music' | 'library'
  // Style
  | 'shirt'
  // CalendarDays
  | 'calendar-days';

// ── Registry: mappa nome → componente ────────────────────────────────

type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

export const ICON_REGISTRY: Record<IconName, IconComponent> = {
  // Social
  github:           GithubIcon,
  linkedin:         LinkedinIcon,
  mail:             Mail,
  activity:         Activity,
  strava:           Activity, // alias

  // Sport / domain
  'sport-shoe':     SportShoe,
  mountain:         Mountain,
  'plane-takeoff':  PlaneTakeoff,
  backpack:         Backpack,
  footprints:       Footprints,
  route:            Route,
  gauge:            Gauge,
  timer:            Timer,
  ruler:            Ruler,
  'map-pin':        MapPin,

  // UI
  'chevron-down':   ChevronDown,
  'chevron-left':   ChevronLeft,
  'chevron-right':  ChevronRight,
  x:                X,
  'external-link':  ExternalLink,
  'sliders-horizontal': SlidersHorizontal,
  zap:              Zap,

  // Content
  code2:            Code2,
  cpu:              Cpu,
  network:          Network,
  puzzle:           Puzzle,
  smartphone:       Smartphone,
  users:            Users,
  lightbulb:        Lightbulb,
  'heart-handshake': HeartHandshake,
  plane:            Plane,

  // Media
  camera:           Camera,
  'list-music':     ListMusic,
  library:          Library,

  // Style
  shirt:            Shirt,

  // Calendario
  'calendar-days':  CalendarDays,
};

// ── Categorie per Storybook ───────────────────────────────────────────

export const ICON_CATEGORIES: { label: string; icons: IconName[] }[] = [
  {
    label: 'Social',
    icons: ['github', 'linkedin', 'mail', 'activity', 'strava'],
  },
  {
    label: 'Sport & Domain',
    icons: ['sport-shoe', 'mountain', 'plane-takeoff', 'backpack', 'footprints', 'route', 'gauge', 'timer', 'ruler', 'map-pin'],
  },
  {
    label: 'Content',
    icons: ['code2', 'cpu', 'network', 'puzzle', 'smartphone', 'users', 'lightbulb', 'heart-handshake', 'plane'],
  },
  {
    label: 'Media',
    icons: ['camera', 'list-music', 'library'],
  },
  {
    label: 'UI',
    icons: ['chevron-down', 'chevron-left', 'chevron-right', 'x', 'external-link', 'sliders-horizontal', 'zap', 'shirt', 'calendar-days'],
  },
];

// ── Prop types per <Icon> ─────────────────────────────────────────────

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconScheme = 'inherit' | 'light' | 'dark';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  scheme?: IconScheme;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

const ICON_SIZE_PX: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const ICON_SIZE_CLASS: Record<IconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const ICON_SCHEME_STYLE: Record<IconScheme, CSSProperties> = {
  inherit: {},
  light:   { color: '#0f172a' },   // slate-900
  dark:    { color: '#f1f5f9' },   // slate-100
};

/** Icone custom SVG (non LucideIcon): non accettano `size`/`strokeWidth` prop diretti */
const CUSTOM_ICONS = new Set<IconName>(['github', 'linkedin']);

// ── Componente <Icon> ─────────────────────────────────────────────────

/**
 * Componente universale per tutte le icone del sito.
 *
 * @example
 * <Icon name="github" size="lg" scheme="dark" />
 * <Icon name="sport-shoe" size="md" strokeWidth={1.5} />
 */
export function Icon({
  name,
  size = 'md',
  scheme = 'inherit',
  strokeWidth = 2,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  const IconComp = ICON_REGISTRY[name];
  const sizeClass = ICON_SIZE_CLASS[size];
  const schemeStyle = ICON_SCHEME_STYLE[scheme];
  const combinedClass = `${sizeClass} ${className}`.trim();

  if (!IconComp) return null;

  if (CUSTOM_ICONS.has(name)) {
    // SVG custom: passano solo className e style (no size/strokeWidth numerici)
    const Comp = IconComp as ComponentType<SVGProps<SVGSVGElement>>;
    return (
      <Comp
        className={combinedClass}
        style={schemeStyle}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    );
  }

  // Icone lucide: supportano size e strokeWidth
  const LucideComp = IconComp as LucideIcon;
  return (
    <LucideComp
      size={ICON_SIZE_PX[size]}
      strokeWidth={strokeWidth}
      style={schemeStyle}
      className={className || undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    />
  );
}

// ── Mappe dati social (retrocompatibilità) ────────────────────────────

export type SocialType = 'github' | 'linkedin' | 'email' | 'strava';

export const SOCIAL_BRAND_COLORS: Record<SocialType, string> = {
  github:   '#171515',
  linkedin: '#0077B5',
  email:    '#FF5722',
  strava:   '#FC4C02',
};

export const SOCIAL_LABELS: Record<SocialType, string> = {
  github:   'GitHub',
  linkedin: 'LinkedIn',
  email:    'Email',
  strava:   'Strava',
};





