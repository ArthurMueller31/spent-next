import Image from "next/image";
import Link from "next/link";

export default function LoginAndSignUp() {
  return (
    <>
      <section className="font-raleway">
        <nav className="bg-darkerCustomColor w-screen h-16 flex items-center justify-between">
          <div>
            <Link href={"/"} className="p-10 flex flex-row items-center">
              <Image
                src={"/spent-logo1.png"}
                width={50}
                height={50}
                alt="spent logo"
                className="mr-1"
                unoptimized={true}
                priority
              />
              <h1 className="text-white text-xl">SPENT</h1>
            </Link>
          </div>
          <span className="text-white p-10">
            <Link
              href={"/sobre"}
              className="hover:text-gray-300 transition ease-in-out duration-250 text-2xl"
            >
              Sobre
            </Link>
          </span>
        </nav>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-light">Faça seu cadastro para usar o nosso serviço.</h1>

          <form action="#" method="post">
            <label>Nome:</label>
            <input type="text" className="border-b-2"/>
          </form>
        </div>
      </section>
    </>
  );
}
