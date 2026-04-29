import type { HomeContent } from '@/app/types/home';

export const homeContent: HomeContent = {
  hero: {
    title: 'MZ Exploration',
    subtitle: 'Running, trekking e viaggi raccontati con dati reali e visual pulito.',
    primaryCta: {
      label: 'Esplora le attivita',
      href: '/exploration',
    },
    secondaryCta: {
      label: 'Chi sono',
      href: '/about',
    },
  },
  introTitle: 'Una dashboard personale, non solo un diario',
  introText:
    'Questo progetto unisce metriche sportive, analisi e storytelling. Ogni sezione e pensata per rendere leggibili le attivita e trasformare i dati in insight utili.',
  featuresTitle: 'Esplora il progetto',
  features: [
    {
      id: 'about',
      title: 'Chi Sono',
      description: 'Profilo personale, obiettivi e contesto del progetto.',
      icon: '👤',
      href: '/about',
      gradientClass: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'exploration',
      title: 'Exploration',
      description: 'Running, trekking e trips in un hub unico.',
      icon: '🗺️',
      href: '/exploration',
      gradientClass: 'from-emerald-500 to-green-600',
    },
    {
      id: 'contact',
      title: 'Contatti',
      description: 'Canali diretti per collaborazioni e networking.',
      icon: '📩',
      href: '/contact',
      gradientClass: 'from-violet-500 to-purple-600',
    },
  ],
  statsTitle: 'Numeri chiave',
  stats: [
    { id: 'runs', label: 'Corse', value: '150+' },
    { id: 'hikes', label: 'Escursioni', value: '45+' },
    { id: 'countries', label: 'Paesi visitati', value: '25+' },
    { id: 'distance', label: 'km percorsi', value: '2000+' },
  ],
  finalCta: {
    title: 'Pronto a vedere i dettagli?',
    subtitle: 'Apri la sezione Exploration e consulta metriche, foto e schede attivita.',
    buttonLabel: 'Vai a Exploration',
    buttonHref: '/exploration',
  },
};

