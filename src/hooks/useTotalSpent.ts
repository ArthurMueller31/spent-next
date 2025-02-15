import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/firebase"; 
import useSidebarStore from "@/app/_components/Navigation/Sidebar/sidebarStore"; // O hook Zustand

interface Item {
  name: string;
  price: string;
  quantity: number;
  weight: string; 
}

interface PurchaseData {
  items: Item[];
}

const useTotalSpent = (userId: string | null) => {
  const setTotalSpent = useSidebarStore((state) => state.setTotalSpent);

  useEffect(() => {
    if (!userId) return;

    
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
