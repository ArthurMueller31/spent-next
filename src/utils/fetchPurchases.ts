import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

type Purchase = {
  id?: string;
  establishment: string;
  purchaseDate: string;
  createdAt: string;
  items: Item[];
};

type Item = {
  name: string;
  price: string;
  quantity: string;
  weight: string;
};

export async function fetchPurchases(userId: string): Promise<Purchase[]> {
  const purchasesRef = collection(firestore, `users/${userId}/purchases`);
  const querySnapshot = await getDocs(purchasesRef);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Purchase[];
}

function formatDate(dateString: string): string {
  const dateParts = dateString.split("-"); // "2025-01-30" -> ["2025", "01", "30"]
  const date = new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );
  return Intl.DateTimeFormat("pt-BR").format(date);
}

function calculateTotalItems(items: Item[]): number {
  return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function standardPriceFormat(price: string): number {
  const standard = price.replace(/[^0-9,.-]/g, "").replace(",", ".");
  const parsed = parseFloat(standard);
  return isNaN(parsed) ? 0 : parsed;
}

function calculateTotalPrice(items: Item[]): number {
  return items.reduce((total, item) => {
    const price = standardPriceFormat(item.price);
    const quantity = parseFloat(item.quantity) || 1;
    return total + price * quantity;
  }, 0);
}

function formatCurrencyToBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

useEffect(() => {
  const setUidFromLoggedUser = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId(null);
    }
  });

  return () => setUidFromLoggedUser();
}, []);

useEffect(() => {
  // Busca as compras somente se o usuário estiver autenticado
  const fetchData = async () => {
    if (userId) {
      const data = await fetchPurchases(userId);

      // ordenar compras de mais recente para mais antiga
      // mais de uma compra no mesmo dia = ordenar por preço
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.purchaseDate).getTime();
        const dateB = new Date(b.purchaseDate).getTime();

        if (dateB !== dateA) {
          return dateB - dateA;
        }

        const totalPriceA = calculateTotalPrice(a.items);
        const totalPriceB = calculateTotalPrice(b.items);
        return totalPriceB - totalPriceA;
      });

      const total = sortedData.reduce((sum, purchase) => {
        return sum + calculateTotalPrice(purchase.items);
      }, 0);

      setPurchases(sortedData);
      setTotalSpent(formatCurrencyToBRL(total));
    }
  };

  fetchData();
}, [userId, setTotalSpent]);
