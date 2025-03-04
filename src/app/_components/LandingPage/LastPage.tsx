import Image from "next/image";
import Link from "next/link";

export default function LastPage() {
  return (
    <section className="font-raleway px-6 py-8 dark:bg-darkModeCustomBg">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Primeira linha */}
          <div className="flex flex-col items-center lg:items-start space-y-5 order-2 lg:order-1">
            <p className="text-3xl leading-8 text-center lg:text-left hyphens-manual max-w-xl">
              Registre suas compras e acesse-as a qualquer momento. Ao inserir
              os dados, se a compra for realizada em um local já cadastrado, o
              sistema oferece suges&shy;tões automáticas de itens, permitindo
              que você complete o registro com apenas um clique!
            </p>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
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

          <div className="flex flex-col items-center lg:items-start space-y-4 order-3 lg:order-4">
            <div className="w-full lg:hidden">
              <hr className="border-gray-300 dark:border-gray-300" />
            </div>
            <p className="text-3xl leading-8 text-center lg:text-left hyphens-auto max-w-xl">
              Se você deseja gerenciar seus gastos de forma prática e obter
              visualizações claras, nosso site é a solução ideal para
              acompa&shy;nhar suas despesas com facilidade.
            </p>
          </div>

          <div className="flex justify-center order-4 lg:order-3">
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
