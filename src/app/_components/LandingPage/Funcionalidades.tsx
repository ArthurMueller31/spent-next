import Image from "next/image";
import Link from "next/link";

export default function Funcionalidades() {
  return (
    <section className="font-raleway dark:bg-black">
      <div className="m-16">
        <h1 className="text-4xl font-bold text-center lg:text-start lg:text-6xl lg:pl-12">
          Funcionalidades
        </h1>
        <div className="flex flex-col m-20 md:flex-row justify-around items-center space-y-10 md:space-y-0">
          <div className="flex flex-col items-center max-w-xl">
            <Image
              src={"/icons/dollar-sign-w-circle.svg"}
              alt="dollar-circle-icon"
              width={150}
              height={150}
              className="block dark:hidden"
            />
            <Image
              src={"/icons/dollar-sign-w-circle-white.svg"}
              alt="dollar-circle-icon"
              width={150}
              height={150}
              className="hidden dark:block"
            />
            <p className="text-4xl text-center p-5 leading-tight">
              Veja suas notas fiscais adicionadas e gastos gerais
            </p>
          </div>

          <div className="flex flex-col items-center max-w-xl">
            <Image
              src={"/icons/graphic.svg"}
              width={150}
              height={150}
              alt="graphic-icon"
              className="block dark:hidden"
            />
            <Image
              src={"/icons/graphic-white.svg"}
              width={150}
              height={150}
              alt="graphic-icon"
              className="hidden dark:block"
            />

            <p className="text-4xl text-center p-5 leading-tight">
              Gráficos para você acompanhar despesas ao longo do tempo
            </p>
          </div>

          <div className="flex flex-col items-center max-w-xl">
            <Image
              src={"/icons/table.svg"}
              width={150}
              height={150}
              alt="table-icon"
              className="block dark:hidden"
            />
            <Image
              src={"/icons/table-white.svg"}
              width={150}
              height={150}
              alt="table-icon"
              className="hidden dark:block"
            />
            <p className="text-4xl text-center p-5 leading-tight">
              Tabelas para fácil e rápida visualização das compras
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:flex lg:justify-end lg:pr-28">
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
              <Image
                className="ml-2"
                src={"/icons/arrow-forward.svg"}
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
