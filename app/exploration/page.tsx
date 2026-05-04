import { CardGrid, type CardGridItem } from '@/components/generic';

const explorationCards: CardGridItem[] = [
	{
		id: 'exp-running',
		title: 'Running',
		description: 'Le mie corse e i percorsi preferiti',
		href: '/exploration/running',
		image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/running_Large_zorzw2.jpg',
	},
	{
		id: 'exp-trekking',
		title: 'Trekking',
		description: 'Escursioni in montagna e natura',
		href: '/exploration/trekking',
		image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trekking_h2lev5.jpg',
	},
	{
		id: 'exp-trips',
		title: 'Trips',
		description: 'Viaggi e avventure internazionali',
		href: '/exploration/trips',
		image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trips_exvdmu.avif',
	},
];

export default function ExplorationPage() {
	return (
		<main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 ex-main-1" data-testid="ex-main-1">
			{/* Hero Section */}
			<section className="px-4 py-16 sm:px-6 lg:px-8 ex-hero-2" data-testid="ex-hero-2">
				<div className="max-w-4xl mx-auto text-center ex-hero-content-2" data-testid="ex-hero-content-2">
					<h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 ex-title-2" data-testid="ex-title-2">
						Exploration
					</h1>
					<p className="text-lg text-slate-600 dark:text-slate-300 mb-8 ex-subtitle-2" data-testid="ex-subtitle-2">
						Scopri tutte le mie avventure: dalle corse mattutine alle escursioni in
						montagna, fino ai viaggi internazionali.
					</p>
				</div>
			</section>

			<CardGrid
				title="Categorie"
				subtitle="Scegli da dove iniziare"
				items={explorationCards}
				showTypeBadge={false}
				showDate={false}
				showDescription={true}
				sectionClassName="px-4 py-12 sm:px-6 lg:px-8"
				data-testid="ex-categories-grid-3"
			/>

			{/* Stats Section */}
			<section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-700 ex-stats-4" data-testid="ex-stats-4">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center ex-stats-title-4" data-testid="ex-stats-title-4">
						Statistiche Generali
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 ex-stats-grid-4" data-testid="ex-stats-grid-4">
						<div className="text-center ex-stats-item-runs-4" data-testid="ex-stats-item-runs-4">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400 ex-stats-value-runs-4" data-testid="ex-stats-value-runs-4">
								150+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2 ex-stats-label-4">Corse</p>
						</div>
						<div className="text-center ex-stats-item-treks-4" data-testid="ex-stats-item-treks-4">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400 ex-stats-value-treks-4" data-testid="ex-stats-value-treks-4">
								45+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2 ex-stats-label-4">
								Escursioni
							</p>
						</div>
						<div className="text-center ex-stats-item-countries-4" data-testid="ex-stats-item-countries-4">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400 ex-stats-value-countries-4" data-testid="ex-stats-value-countries-4">
								25+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2 ex-stats-label-4">
								Paesi Visitati
							</p>
						</div>
						<div className="text-center ex-stats-item-distance-4" data-testid="ex-stats-item-distance-4">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400 ex-stats-value-distance-4" data-testid="ex-stats-value-distance-4">
								2000+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2 ex-stats-label-4">
								km Percorsi
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}