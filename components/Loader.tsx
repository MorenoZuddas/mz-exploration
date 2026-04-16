export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        {/* Text */}
        <p className="text-slate-900 dark:text-white font-semibold text-lg">
          Caricamento...
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Preparando la pagina per te
        </p>
      </div>
    </div>
  );
}

