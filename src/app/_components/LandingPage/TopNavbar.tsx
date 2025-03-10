"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full flex justify-between items-center px-6 py-4 z-30 transition-colors duration-700 font-raleway text-white ${
        scrolled ? "bg-darkerCustomColor" : "bg-transparent"
      }`}
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="flex items-center justify-center rounded z-20">
          <Link href="/">
            <Image
              className="size-[50] md:size-[60]"
              src={"/images/spent-logo1.png"}
              alt="spent-logo"
              width={60}
              height={60}
              unoptimized={true}
              priority
            />
          </Link>
        </div>
        <Link href="/" className="z-20">
          <h1 className="hidden sm:text-3xl sm:block md:text-3xl z-20">
            SPENT
          </h1>
        </Link>
      </div>
      <nav className="flex gap-10">
        <Link
          href="sobre"
          className="hover:text-gray-300 text-3xl font-light z-20 transition ease-in-out duration-250"
        >
          Sobre
        </Link>
        <Link
          href="login"
          className="hover:text-gray-300 text-3xl font-medium z-20 transition ease-in-out duration-250"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
