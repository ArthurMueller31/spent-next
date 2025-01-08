import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] text-white font-raleway">
      {/* Imagem de fundo */}
      <Image
        src={"/hero-img.jpeg"}
        alt="spent-hero"
        layout="fill"
        objectFit="cover"
        priority
      />

      <div className="absolute inset-0 flex flex-col justify-between">
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded">
              <Image
                src={"/spent-logo1.png"}
                alt="spent-logo"
                width={100}
                height={100}
              />
            </div>
            <h1 className=" text-5xl ">SPENT</h1>
          </div>
          <nav className="space-x-6 gap-3"> {/* VOLTAR AQUI */}
            <a href="sobre" className="hover:text-gray-300 text-3xl font-light">
              Sobre
            </a>
            <a href="login" className="hover:text-gray-300 text-3xl font-medium">
              Login
            </a>
          </nav>
        </header>
      </div>
    </section>
  );
}
