"use client";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../../../../firebase/firebase";
import { FirebaseError } from "firebase/app";

const errorMessages: Record<string, string> = {
  "auth/invalid-email": "E-mail inválido. Por favor, insira um e-mail válido.",
  "auth/user-disabled": "Esta conta está desativada.",
  "auth/user-not-found":
    "Usuário não encontrado. Verifique se o e-mail está correto ou cadastre-se.",
  "auth/wrong-password": "Senha incorreta. Tente novamente.",
  "auth/invalid-credential": "Usuário/Senha incorretos."
};

export default function Login() {
  const [formInputData, setFormInputData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const logged = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/home");
      }
    });

    return () => logged();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        formInputData.email,
        formInputData.password
      );

      router.push("/home");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(
          errorMessages[err.code] ||
            "Ocorreu um erro ao fazer login. Tente novamente."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();

    try {
      setIsLoading(true);
      setError(null);

      await signInWithPopup(auth, provider);

      router.push("/home");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Erro: ", err.message);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="font-raleway flex justify-center dark:bg-darkerCustomColor pb-[31px]">
        <div className="min-h-[90vh] flex flex-col justify-center py-6 px-4">
          <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
            {/* Form agora está à esquerda */}
            <form
              className="max-w-md md:mr-auto w-full"
              onSubmit={handleSubmit}
            >
              <h3 className="text-darkerCustomColor text-3xl font-extrabold mb-8 dark:text-white">
                Acessar minha conta
              </h3>

              <div className="space-y-4">
                <div>
                  <label>E-mail</label>
                  <input
                    name="email"
                    type="email"
                    value={formInputData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-100 w-full text-sm text-darkerCustomColor px-4 py-3.5 rounded-md outline-customBlueColor focus:bg-transparent dark:text-black dark:focus:bg-gray-100 placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label>Senha</label>
                  <input
                    name="password"
                    type="password"
                    value={formInputData.password}
                    onChange={handleChange}
                    required
                    className="bg-gray-100 w-full text-sm text-darkerCustomColor px-4 py-3.5 rounded-md outline-customBlueColor focus:bg-transparent dark:text-black dark:focus:bg-gray-100 placeholder:text-gray-600"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="text-sm">
                  <Link
                    href={"/recuperar-senha"}
                    className="transition ease-in-out duration-200 text-blue-600 hover:text-blue-500 h-4 font-semibold"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div>
                  {error && (
                    <p className="block text-red-500 text-sm  dark:text-red-500 ">
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white transition ease-in-out duration-200 bg-darkerCustomColor hover:bg-gray-700 focus:outline-none dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </button>
              </div>

              <div className="my-4 flex items-center gap-4">
                <hr className="w-full border-gray-300" />
                <p className="text-sm text-darkerCustomColor text-center dark:text-white">
                  ou
                </p>
                <hr className="w-full border-gray-300" />
              </div>

              <div className="space-x-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="border-none outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#fbbd00"
                      d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                      data-original="#fbbd00"
                    />
                    <path
                      fill="#0f9d58"
                      d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                      data-original="#0f9d58"
                    />
                    <path
                      fill="#31aa52"
                      d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                      data-original="#31aa52"
                    />
                    <path
                      fill="#3c79e6"
                      d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                      data-original="#3c79e6"
                    />
                    <path
                      fill="#cf2d48"
                      d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                      data-original="#cf2d48"
                    />
                    <path
                      fill="#eb4132"
                      d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                      data-original="#eb4132"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* Texto direita */}
            <div>
              <h2 className="hidden md:flex lg:text-5xl text-3xl font-extrabold lg:leading-[55px] text-darkerCustomColor dark:text-white">
                Faça login para acessar sua conta novamente
              </h2>

              <p className="text-md mt-12 text-darkerCustomColor dark:text-white">
                Ainda não tem uma conta?
                <Link
                  href="/cadastro"
                  className="text-blue-600 font-semibold hover:underline ml-1 dark:text-blue-600"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
