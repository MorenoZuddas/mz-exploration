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
		<main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
			{/* Hero Section */}
			<section className="px-4 py-16 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
						Exploration
					</h1>
					<p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
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
			/>

			{/* Stats Section */}
			<section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-700">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
						Statistiche Generali
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								150+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2">Corse</p>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								45+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2">
								Escursioni
							</p>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								25+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2">
								Paesi Visitati
							</p>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
								2000+
							</div>
							<p className="text-slate-600 dark:text-slate-300 mt-2">
								km Percorsi
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}