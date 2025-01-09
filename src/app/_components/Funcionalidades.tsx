import Image from "next/image";

export default function Funcionalidades() {
  return (
    <section className="font-raleway">
      <div>
        <h1 className="text-4xl font-bold">Funcionalidades</h1>
        <Image
          src={"/dollar-sign-w-circle.svg"}
          alt="dollar sign with circle"
          width={100}
          height={100}
        ></Image>
      </div>
    </section>
  );
}
