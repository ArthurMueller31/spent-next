"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "../../../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../Navigation/Navbar/Navbar";
import AddProductsModal from "../Modals/AddProductsModal";
import { onAuthStateChanged } from "firebase/auth";

interface EmptyPurchasesScreenProps {
  children: React.ReactNode;
}

export default function EmptyPurchasesScreen({
  children
}: EmptyPurchasesScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  useEffect(() => {
    const getUserID = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const purchasesRef = collection(
        firestore,
        "users",
        user.uid,
        "purchases"
      );
      const purchasesSnapshot = await getDocs(purchasesRef);

      if (purchasesSnapshot.empty) {
        setShowWelcomeScreen(true);
      }

      setIsLoading(false);
    });

    return () => getUserID();
  }, []);

  const handleModalToggle = () => {
    if (!isModalVisible) {
      setIsModalVisible(true);
      setTimeout(() => setIsModalOpen(true), 10);
    } else {
      setIsModalOpen(false);
      setTimeout(() => setIsModalVisible(false), 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-darkerCustomColor">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-transparent dark:border-t-transparent border-black dark:border-white rounded-full animate-spin"></div>
          <p className="mt-4 text-black dark:text-white font-raleway">
            Carregando...
          </p>
        </div>
      </div>
    );
  }
  if (showWelcomeScreen) {
    return (
      <>
        {isModalVisible && (
          <AddProductsModal
            isModalOpen={isModalOpen}
            handleModalToggle={handleModalToggle}
          />
        )}

        <Navbar />
        <div
          className="fixed inset-0 flex items-center justify-center bg-white text-black text-center cursor-pointer font-raleway"
          onClick={() => handleModalToggle()}
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Spent!</h2>
            <p className="text-lg">
              Clique em qualquer lugar para adicionar sua primeira compra.
            </p>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
