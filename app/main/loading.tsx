
export default function LoadingHomePage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-stone-800 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-stone-400 text-sm font-medium animate-pulse">
        Curating your feed...
      </p>
    </div>
  )
}