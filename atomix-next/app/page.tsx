import { getFirstFiveElements } from "@/lib/fetcher";
import ElementCard from "@/components/ElementCard";

export default async function Home() {
  const elements = await getFirstFiveElements();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#272826" }}>
      {/* Animated Background */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 20% 50%, #ff5333 0%, transparent 50%), radial-gradient(circle at 80% 80%, #b5b1a7 0%, transparent 50%)",
        }}
      />

      <header className="max-w-6xl mx-auto mb-16 text-center relative z-10">
        <div className="mb-6 inline-block">
          <h1 
            className="text-6xl lg:text-7xl font-black tracking-tighter mb-3"
            style={{ 
              color: "#ff5333",
              textShadow: "0 0 30px rgba(255, 83, 51, 0.3)"
            }}
          >
            ATOMIX
          </h1>
        </div>
        <p 
          style={{ color: "#b5b1a7" }} 
          className="font-medium text-lg"
        >
          Interactive 3D Periodic Table Explorer
        </p>
        <p 
          style={{ color: "#b5b1a7", opacity: 0.6 }} 
          className="font-light text-sm mt-2"
        >
          Hover over elements to explore • Click to view 3D models
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
        {elements.map((element) => (
          <ElementCard key={element.number} element={element} />
        ))}
      </main>
    </div>
  );
}