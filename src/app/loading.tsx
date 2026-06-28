export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-primary-content font-bold text-sm">PF</span>
        </div>
        <span className="loading loading-dots loading-md text-primary" />
      </div>
    </div>
  );
}
