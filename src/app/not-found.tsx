import Link from "next/link";
import Navbar from "./_components/Navigation/Navbar/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen font-hostGrotesk">
        <h1>Erro 404</h1>
        <div className="m-5">
          A página que você está tentando acessar não existe.
        </div>
        <div>
          <Link href={"/"}>
            <button className="p-2 border border-darkerCustomColor bg-darkerCustomColor text-white dark:text-black dark:bg-white rounded">
              Voltar à página inicial
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
