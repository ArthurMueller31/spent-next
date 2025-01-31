import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/firebase"; // Certifique-se de ajustar a importação
import useSidebarStore from "@/app/_components/Navigation/Sidebar/sidebarStore"; // O hook Zustand

interface Item {
  name: string;
  price: string; // Ou `number`, se o preço for um número
  quantity: number;
  weight: string; // Ou `number`, dependendo de como você armazena o peso
}

interface PurchaseData {
  items: Item[];
}

const useTotalSpent = (userId: string | null) => {
  const setTotalSpent = useSidebarStore((state) => state.setTotalSpent);

  useEffect(() => {
    if (!userId) return;

    // Refere-se à coleção de compras do usuário
    const purchasesRef = collection(firestore, "users", userId, "purchases");

    // Configura o listener para obter dados em tempo real
    const unsubscribe = onSnapshot(purchasesRef, (snapshot) => {
      let total = 0;

      snapshot.forEach((doc) => {
        const purchaseData = doc.data() as PurchaseData; // Aplica o tipo

        purchaseData.items.forEach((item) => {
          total += parseFloat(item.price) * item.quantity; // Calcula o total gasto
        });
      });

      // Atualiza a store do Zustand com o total
      setTotalSpent(total);
    });

    // Limpa o listener quando o componente for desmontado ou o userId mudar
    return () => unsubscribe();
  }, [userId, setTotalSpent]); // Re-rodar sempre que o userId mudar
};

export default useTotalSpent;
