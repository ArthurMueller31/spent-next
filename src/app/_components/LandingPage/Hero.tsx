import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] text-white font-raleway">
      {/* Bg image */}
      <Image
        className="bg-black bg-opacity-50"
        src={"/hero-img.jpeg"}
        alt="spent-hero"
        layout="fill"
        objectFit="cover"
        priority
      />

      {/* Reduce bg opacity */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <div className="absolute inset-0 flex flex-col justify-between z-20">
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="flex items-center justify-center rounded z-20">
              <Link href="#">
                <Image className="size-[50] md:size-[80]"
                  src={"/spent-logo1.png"}
                  alt="spent-logo"
                  width={100}
                  height={100}
                  unoptimized={true}
                  priority
                />
              </Link>
            </div>
            <Link href="#" className="z-20">
              <h1 className="hidden sm:text-3xl sm:block md:text-4xl z-20">SPENT</h1>
            </Link>
          </div>
          <nav className="flex gap-10">
            <Link
              href="sobre"
              className="hover:text-gray-300 text-3xl font-light z-20 transition ease-in-out duration-250"
            >
              Sobre
            </Link>
            <Link
              href="login"
              className="hover:text-gray-300 text-3xl font-medium z-20 transition ease-in-out duration-250"
            >
              Login
            </Link>
          </nav>
        </header>

        {/* Main text for hero */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="text-center px-6 space-y-6">
            <h1 className="text-4xl leading-snug sm:text-5xl md:text-7xl font-bold text-center md:leading-snug">
              Seus gastos organizados <br /> da melhor forma.
            </h1>
            <div className="pt-5">
              <Link href="cadastro">
                <button
                  className="
              px-6 py-3 w-60 h-20 font-medium
              text-3xl
              rounded-xl 
              transition ease-in-out duration-250
            bg-customBlueColor  hover:bg-customBlueLighterColor 
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
  );
}
