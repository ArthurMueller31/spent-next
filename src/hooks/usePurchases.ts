import { useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";

export interface PurchaseItem {
  name: string;
  price: string;
  quantity: string;
  weight: string;
}

export interface Purchase {
  id: string; // id da compra
  category: string;
  createdAt: string;
  establishment: string;
  purchaseDate: string;
  items: PurchaseItem[];
}

interface UsePurchasesResult {
  purchases: Purchase[];
  error: string | null;
}

function savePurchasesToLocalStorage(purchases: Purchase[]) {
  try {
    localStorage.setItem("purchases", JSON.stringify(purchases));
  } catch (error) {
    console.error(error);
  }
}

function loadPurchasesFromLocalStorage(): Purchase[] {
  try {
    const data = localStorage.getItem("purchases");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Hook para buscar e sincronizar as compras do usuário com o Firestore e o localStorage
 * @param userId - ID do usuário
 */

export function usePurchases(userId: string | null): UsePurchasesResult {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const localData = loadPurchasesFromLocalStorage();
    if (localData && localData.length > 0) {
      setPurchases(localData);
    }

    const purchasesRef = collection(firestore, `users/${userId}/purchases`);
    const q = query(purchasesRef);

    const getRealTimeData = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const fetchedPurchases: Purchase[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPurchases.push({ id: doc.id, ...doc.data() } as Purchase);
        });

        if (JSON.stringify(fetchedPurchases) !== JSON.stringify(localData)) {
          setPurchases(fetchedPurchases);
          savePurchasesToLocalStorage(fetchedPurchases);
        }
      },
      (err) => {
        setError(err.message);
      }
    );

    return () => getRealTimeData();
  }, [userId]);

  return { purchases, error };
}
