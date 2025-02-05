"use client";

import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../../../../../firebase/firebase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AddProductsModal from "../../Modals/AddProductsModal";
import { doc, getDoc } from "firebase/firestore";
import useSidebarStore from "./sidebarStore";
import useTotalSpent from "@/hooks/useTotalSpent";

const navItems = [
  { href: "/home", label: "Página Inicial", icon: "/icons/sidebar-home.svg" },
  {
    href: "/minhas-compras",
    label: "Minhas compras",
    icon: "/icons/sidebar-table.svg"
  }
];

export default function Sidebar() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const totalSpent = useSidebarStore((state) => state.totalSpent);

  const handleModalToggle = () => {
    if (!isModalVisible) {
      setIsModalVisible(true);
      setTimeout(() => setIsModalOpen(true), 10);
    } else {
      setIsModalOpen(false);
      setTimeout(() => setIsModalVisible(false), 0);
    }
  };

  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getUserID = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "Usuário");
        } else {
          setUserName("Usuário");
        }
      } else {
        setUserId(null);
        setUserName(null);
      }
    });

    return () => getUserID();
  }, []);

  useTotalSpent(userId);

  return (
    <>
      <aside className="flex flex-col fixed w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 font-raleway ">
        <div className="relative mt-16 flex flex-col items-center justify-center font-workSans border rounded-md">
          <div className="flex flex-row items-center m-2 font-medium">
            <Image
              src={"/icons/sidebar-moneybag.svg"}
              alt="home-icon"
              width={40}
              height={40}
            />
            <span title="Seus gastos até hoje">Gastos:</span>
            <span className="flex flex-row items-center w-auto p-2 bg-white dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600">
              <p className="font-medium">
                {totalSpent.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>
            </span>
          </div>

          {isModalVisible && (
            <AddProductsModal
              isModalOpen={isModalOpen}
              handleModalToggle={handleModalToggle}
            />
          )}
        </div>

        <div className="">
          <span className="flex items-center justify-center px-4 py-2 mt-5 text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300 transform rounded-md  ">
            <button
              onClick={handleModalToggle}
              className="flex flex-row items-center "
            >
              <Image
                className="mr-2"
                src={"/icons/sidebar-add.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />
              Adicionar compra
            </button>
          </span>
        </div>

        <hr className="mt-4 border-gray-200 dark:border-gray-600" />

        <div className="flex flex-col justify-between flex-1">
          <nav>
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 ${
                  pathname === href
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-100 dark:text-white"
                    : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                }`}
              >
                <Image
                  src={icon}
                  alt={`${label}-icon`}
                  width={30}
                  height={30}
                />
                <span className="mx-4 font-medium">{label}</span>
              </Link>
            ))}

            <Link
              key={"/conta"}
              href={"conta"}
              className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 ${
                pathname === "/conta"
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Image
                src={"/icons/sidebar-settings.svg"}
                alt="settings-icon"
                width={30}
                height={30}
              />
              <span className="mx-4 font-medium">Conta</span>
            </Link>

            <hr className="mt-4 border-gray-200 dark:border-gray-600" />

            <button
              className="flex items-center px-4 py-2 mt-5 w-full text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              onClick={handleLogout}
            >
              <Image
                src={"/icons/sidebar-logout.svg"}
                alt="logout-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Sair</span>
            </button>
          </nav>

          <a href="#" className="flex items-center px-4 -mx-2">
            <Image
              width={100}
              height={100}
              className="object-cover mx-2 rounded-full h-9 w-9"
              src="/icons/sidebar-account.svg"
              alt="account-icon"
            />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {userName ? userName : ""}
            </span>
          </a>
        </div>
      </aside>
    </>
  );
}
