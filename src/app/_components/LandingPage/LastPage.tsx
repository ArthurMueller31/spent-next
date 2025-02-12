import Image from "next/image";
import Link from "next/link";

export default function LastPage() {
  return (
    <section className="font-raleway px-6 py-8 dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Primeira linha */}
          <div className="flex flex-col items-center  md:items-start space-y-5 order-2 md:order-1">
            <p className="text-2xl leading-8 text-center md:text-justify">
              Invés de anotar tudo manualmente, você pode adicionar notas
              fiscais e armazená-las para fácil acesso, ver quanto gastou em
              datas que deseja e várias outras funções.
            </p>
          </div>

          <div className="flex justify-center order-1 md:order-2">
            <Image
              src="/images/last-page-img1.jpeg"
              alt="Homem com várias notas fiscais"
              width={600}
              height={300}
              className="rounded-lg shadow-md"
              unoptimized={true}
              priority
            />
          </div>

          <div className="flex flex-col items-center md:items-start space-y-4 order-3 md:order-4">
            <p className="text-2xl leading-8 text-center md:text-justify">
              Se você é uma pessoa que controla seus gastos, nosso site é
              perfeito para seu propósito.
            </p>
          </div>

          <div className="flex justify-center order-4 md:order-3">
            <Image
              src="/images/last-page-img2.jpeg"
              alt="Homem controlando dinheiro no notebook"
              width={600}
              height={300}
              className="rounded-lg shadow-md"
              unoptimized={true}
              priority
            />
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <Link href={"cadastro"}>
            <button
              className="flex flex-row justify-center items-center
              px-6 py-3 w-72 h-16 font-medium
              text-3xl
              text-white
              rounded-xl 
              transition ease-in-out duration-250
            bg-darkerCustomColor hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700
            "
            >
              Crie sua conta
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
