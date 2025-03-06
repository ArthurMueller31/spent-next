import Image from "next/image";
import Link from "next/link";

export default function Funcionalidades() {
  return (
    <section className="font-raleway dark:bg-darkModeCustomBg">
      <div className="m-16 mobile-width:mt-10">
        <h1 className="text-5xl font-bold text-center lg:text-start lg:text-6xl lg:pl-12 mobile-width:text-[36px]">
          Funcionalidades
        </h1>
        <div className="flex flex-col my-20 lg:flex-row items-center lg:items-start w-full justify-evenly">
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

            <p className="text-4xl text-center p-7 leading-tight mobile-width:text-3xl">
              Exibição <strong>clara e direta</strong> de todas as compras
              registradas, com a opção de editar qualquer item conforme sua
              necessidade
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

            <p className="text-4xl text-center p-7 leading-tight mobile-width:text-3xl">
              Gráficos que possibilitam <strong>monitorar suas despesas</strong>{" "}
              ao longo do tempo e manter o controle dos seus gastos
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
            <p className="text-4xl text-center p-7 leading-tight mobile-width:text-3xl">
              Tabelas organizadas que <strong>facilitam a consulta</strong> das
              suas aquisições, permitindo identificar detalhadamente cada item
              adquirido
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:flex lg:justify-end lg:pr-28">
          <Link href={"sobre"}>
            <button
              className="flex flex-row items-center
              px-6 py-3 w-30 h-16 font-medium
              text-xl
              md:text-3xl
              text-white
              rounded-xl 
              transition ease-in-out duration-250
            bg-darkerCustomColor  hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
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
