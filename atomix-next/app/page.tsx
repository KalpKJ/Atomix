import { getElements } from "@/lib/fetcher";
import ElementCard from "@/components/ElementCard";

export default async function Home() {
  const elements = await getElements();

  return (
    <div className="min-h-screen p-3 flex flex-col">
      <header className="mb-3 text-center">
        <h1 className="text-2xl font-black tracking-tighter mb-1 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          ATOMIC ATLAS
        </h1>
        <p className="text-xs text-slate-400 font-medium">Interactive 3D Elements Gallery</p>
      </header>

      <main className="flex-1 grid grid-cols-18 gap-1">
        {elements.map((element) => (
          <ElementCard key={element.number} element={element} />
        ))}
      </main>
    </div>
  );
}