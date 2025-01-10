import Footer from "./_components/LandingPage/Footer";
import Funcionalidades from "./_components/LandingPage/Funcionalidades";
import Hero from "./_components/LandingPage/Hero";
import LastPage from "./_components/LandingPage/LastPage";
import SmallBanner from "./_components/LandingPage/SmallBanner";

export default function Home() {
  return (
    <>
      <div className="scroll-smooth">
        <Hero />
        <Funcionalidades />
        <SmallBanner />
        <LastPage />
        <Footer />
      </div>
    </>
  );
}
