import Image from "next/image";
import Link from "next/link";
import TopNavbar from "./TopNavbar";

export default function Hero() {
  return (
    <>
      <TopNavbar />
      <section className="relative w-full h-[80vh] text-white font-raleway">
        {/* Bg image */}
        <Image
          className="bg-black bg-opacity-50 object-cover w-full h-[80vh]"
          src={"/images/hero-img.jpeg"}
          alt="spent-hero"
          fill={true}
          priority
        />

        {/* Reduce bg opacity */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        <div className="absolute inset-0 flex flex-col justify-between z-20">
          {/* Main text for hero */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div className="text-center px-6 md:space-y-2 ">
              <h1 className="text-4xl leading-snug sm:text-5xl md:text-7xl font-bold text-center md:leading-snug max-w-6xl mobile-height:text-3xl mobile-height:max-w-md">
                Seus gastos organizados da melhor forma.
              </h1>
              <div className="pt-5">
                <Link href="cadastro">
                  <button
                    className="
              px-6 py-3 w-60 h-20 font-medium
              text-3xl
              mobile-height:text-xl
              mobile-height:w-[170px]
              mobile-height:h-12
              rounded-xl 
              transition ease-in-out duration-250
            bg-darkerCustomColor  hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700
            "
                  >
                    Cadastre-se
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
