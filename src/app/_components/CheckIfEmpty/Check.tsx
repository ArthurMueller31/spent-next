"use client";

import { useEffect, useState } from "react";
import { firestore } from "../../../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AddProductsModal from "../Modals/AddProductsModal";

export default function Check() {
  const [hasProducts, setHasProducts] = useState<boolean | null>(null); // null para carregar
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("Usuário não autenticado");
          return;
        }

        const userId = user.uid;
        const purchasesRef = collection(
          firestore,
          "users",
          userId,
          "purchases"
        );
        const querySnapshot = await getDocs(purchasesRef);

        // Atualiza o estado com base no número de documentos encontrados
        setHasProducts(!querySnapshot.empty);
      } catch (error) {
        console.error("Erro ao buscar produtos: ", error);
      }
    };

    fetchProducts();
  }, []);

  if (hasProducts === null) {
    // Tela de carregamento enquanto verifica
    return <div>Carregando...</div>;
  }

  if (!hasProducts) {
    // Tela para quando não há produtos
    return (
      <div
        className="flex items-center justify-center h-screen bg-gray-100"
        onClick={handleModalToggle}
      >
        <p className="text-gray-500 text-lg">
          Você ainda não possui produtos cadastrados. Clique em qualquer lugar
          para adicionar.
        </p>

        {/* Modal para adicionar produtos */}
        {isModalOpen && (
          <AddProductsModal
            isModalOpen={isModalOpen}
            handleModalToggle={handleModalToggle}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Tela normal com as informações */}
      <h1 className="text-2xl font-bold">Seus Produtos</h1>
      {/* Aqui vai sua tabela ou outras informações */}
    </div>
  );
}
