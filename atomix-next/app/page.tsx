import { getFirstFiveElements } from "@/lib/fetcher";
import ElementCard from "@/components/ElementCard";

export default async function Home() {
  const elements = await getFirstFiveElements();

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          ATOMIC ATLAS
        </h1>
        <p className="text-slate-400 font-medium">Interactive 3D Elements Gallery</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
        {elements.map((element) => (
          <ElementCard key={element.number} element={element} />
        ))}
      </main>
    </div>
  );
}