"use client";

import { useState } from "react";
import { auth } from "../../../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";

export default function PasswordRecover() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "E-mail de redefinição de senha enviado! Verifique sua caixa de entrada."
      );
    } catch (error) {
      setError("Erro ao enviar e-mail. Verifique se o e-mail está correto.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[93vh] bg-gray-100 dark:bg-darkerCustomColor px-4 font-raleway">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center dark:text-black">
          Redefinir Senha
        </h2>
        <p className="text-gray-600 text-center mb-4 font-medium">
          Insira o seu e-mail para receber um link de redefinição de senha.
        </p>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          className="w-full border rounded px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {message && (
          <p className="text-green-600 text-center pb-4">{message}</p>
        )}
        {error && <p className="text-red-600 text-center pb-4">{error}</p>}

        <button
          onClick={handleResetPassword}
          className="w-full bg-darkerCustomColor text-white py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          Enviar E-mail
        </button>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-700 hover:underline">
            Voltar para Login
          </Link>
        </div>
      </div>
    </div>
  );
}
