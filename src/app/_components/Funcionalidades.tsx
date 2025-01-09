import Image from "next/image";
import Link from "next/link";

export default function Funcionalidades() {
  return (
    <section className="font-raleway">
      <div className="m-16">
        <h1 className="text-5xl font-bold text-center lg:text-start lg:text-6xl">
          Funcionalidades
        </h1>
        <div className="flex flex-col m-20 md:flex-row justify-around items-center space-y-10 md:space-y-0">
          <div className="flex flex-col items-center max-w-xl">
            <Image
              src={"/dollar-sign-w-circle.svg"}
              alt="dollar sign with circle"
              width={150}
              height={150}
            />
            <p className="text-4xl text-center p-5">
              Veja suas notas fiscais adicionadas e gastos gerais
            </p>
          </div>

          <div className="flex flex-col items-center max-w-xl">
            <Image
              src={"/graphic.svg"}
              width={150}
              height={150}
              alt="graphic svg"
            />

            <p className="text-4xl text-center p-5">
              Gráficos para você acompanhar despesas ao longo do tempo
            </p>
          </div>

          <div className="flex flex-col items-center max-w-xl">
            <Image src={"table.svg"} width={150} height={150} alt="table svg" />
            <p className="text-4xl text-center p-5">
              Tabelas para fácil e rápida visualização das compras
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:flex lg:justify-end">
          <Link href={"sobre"}>
            <button
              className="flex flex-row items-center
              px-6 py-3 w-30 h-16 font-medium
              text-3xl
              text-white
              rounded-xl 
              transition ease-in-out duration-250
            bg-customBlueColor  hover:bg-customBlueLighterColor
            
            "
            >
              Saiba mais
              <Image className="ml-2"
                src={"/arrow-forward.svg"}
                width={30}
                height={30}
                alt="arrow"
              ></Image>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
