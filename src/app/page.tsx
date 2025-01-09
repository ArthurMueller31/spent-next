import Funcionalidades from "./_components/Funcionalidades";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <>
      <div className="scroll-smooth">
        <Hero />
        <Funcionalidades />
      </div>
    </>
  );
}
