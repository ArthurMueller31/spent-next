import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <>
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 font-raleway">
        <Link href="/" className="flex flex-row items-center justify-center ">
          <Image
            className="w-14 h-14 sm:h-14"
            src="/images/spent-black-logo.png"
            alt="spent-logo"
            width={60}
            height={60}
          />
        </Link>

        <div className="relative mt-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>

          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            placeholder="Pesquisar"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            <a
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
              href="#"
            >
              <Image
                src={"/icons/sidebar-home.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Home</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <Image
                src={"/icons/sidebar-add.svg"}
                alt="add-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Adicionar</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <Image
                src={"/icons/sidebar-table.svg"}
                alt="table-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Tabelas</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <Image
                src={"/icons/sidebar-graph.svg"}
                alt="graph-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Gráficos</span>
            </a>

            <hr className="my-6 border-gray-200 dark:border-gray-600" />

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <Image
                src={"/icons/sidebar-account.svg"}
                alt="account-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Conta</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <Image
                src={"/icons/sidebar-logout.svg"}
                alt="logout-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Sair</span>
            </a>
          </nav>

          <a href="#" className="flex items-center px-4 -mx-2">
            <Image
              width={100}
              height={100}
              className="object-cover mx-2 rounded-full h-9 w-9"
              src="/images/last-page-img2.jpeg"
              alt="avatar"
            />
            <span className="mx-2 font-medium text-gray-800 dark:text-gray-200">
              John Doe
            </span>
          </a>
        </div>
      </aside>
    </>
  );
}
