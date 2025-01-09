import Funcionalidades from "./_components/Funcionalidades";
import Hero from "./_components/Hero";
import SmallBanner from "./_components/SmallBanner";

export default function Home() {
  return (
    <>
      <div className="scroll-smooth">
        <Hero />
        <Funcionalidades />
        <SmallBanner />
      </div>
    </>
  );
}
