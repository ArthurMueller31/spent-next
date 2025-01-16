import Image from "next/image";
import Link from "next/link";

export default function AddPageSidebar() {

  const totalSpent = "1000,00"

  return (
    <>
      <aside className="flex flex-col fixed w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 font-raleway ">

        <div className="relative mt-16 flex flex-row items-center justify-center font-workSans border rounded-md">
          <div className="flex flex-row items-center m-2 font-medium">
            <Image
              src={"/icons/sidebar-moneybag.svg"}
              alt="home-icon"
              width={40}
              height={40}
            />
            <span>Gastos:</span>
          </div>
          <span className="flex flex-row items-center w-auto p-2 text-gray-700 bg-white dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 ">
            <p className="font-medium">R${totalSpent}</p>
          </span>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            <Link
              className="flex items-center px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="/home"
            >
              <Image
                src={"/icons/sidebar-home.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Home</span>
            </Link>

            <Link
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="/adicionar"
            >
              <Image
                src={"/icons/sidebar-add.svg"}
                alt="add-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Adicionar</span>
            </Link>

            <Link
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="/tabelas"
            >
              <Image
                src={"/icons/sidebar-table.svg"}
                alt="table-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Tabelas</span>
            </Link>

            <Link
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
            </Link>

            <hr className="my-6 border-gray-200 dark:border-gray-600" />

            <Link
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="/conta"
            >
              <Image
                src={"/icons/sidebar-account.svg"}
                alt="account-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Conta</span>
            </Link>

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
