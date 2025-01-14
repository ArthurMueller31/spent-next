import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
      <nav className="bg-darkerCustomColor w-screen h-16 flex items-center justify-between font-raleway overflow-hidden">
        <div>
          <Link href={"/"} className="p-10 flex flex-row items-center">
            <Image
              src={"/images/spent-logo1.png"}
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
            href={"/"}
            className="hover:text-gray-300 transition ease-in-out duration-250 text-2xl"
          >
            Sair
          </Link>
        </span>
      </nav>
  );
}
