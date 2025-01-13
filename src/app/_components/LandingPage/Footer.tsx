import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex md:flex-row justify-around items-center bg-darkerCustomColor p-6 font-workSans text-white">
      <h1 className="p-2">
        <a
          href="https://www.linkedin.com/in/arthurmueller31/"
          className="underline"
        >
          Desenvolvedor
        </a>
      </h1>

      <h1 className="p-2">
        <a href="#" className="underline">
          Feedback/Suporte
        </a>
      </h1>

      <span className="flex p-2">
        <Image
          src={"/icons/info.svg"}
          width={20}
          height={20}
          alt="info svg"
          className="mr-2"
        />
        Imagens geradas com IA
      </span>

      <h1 className="text-xl p-2">$PENT, 2025.</h1>
    </footer>
  );
}
