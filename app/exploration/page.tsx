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
		<main className="min-h-screen bg-sky-50 dark:bg-slate-900 ex-main-1" data-testid="ex-main-1">
			<section className="relative w-full h-[34vh] sm:h-[38vh] overflow-hidden ex-hero-2" data-testid="ex-hero-2">
				<div
					className="absolute inset-0 bg-cover bg-center scale-105 ex-hero-background-2"
					style={{
						backgroundImage:
							'url(https://res.cloudinary.com/derbnvxif/image/upload/v1777890348/exploration_uo7dnb.png)',
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 ex-hero-overlay-2" />

				<div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-7 sm:px-10 sm:pb-8 ex-hero-content-2" data-testid="ex-hero-content-2">
					<div className="w-full max-w-2xl space-y-2 mb-5 text-center ex-hero-text-2">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight ex-title-2" data-testid="ex-title-2">
							Exploration
						</h1>
						<p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto ex-subtitle-2" data-testid="ex-subtitle-2">
							Scopri tutte le mie avventure: dalle corse mattutine alle escursioni in montagna, fino ai viaggi internazionali.
						</p>
					</div>
				</div>
			</section>

			<CardGrid
				title="Categorie"
				subtitle="Scegli da dove iniziare"
				items={explorationCards}
				titlePosition="left"
				showTypeBadge={false}
				showDate={false}
				showDescription={true}
				sectionClassName="px-4 pt-8 pb-12 sm:px-6 lg:px-8 bg-sky-50 dark:bg-slate-900"
				data-testid="ex-categories-grid-4"
			/>
		</main>
	);
}