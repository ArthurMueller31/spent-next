import AuthGuard from "../_components/Auth/AuthGuard";
import Charts from "../_components/Charts/Charts";
import EmptyPurchasesScreen from "../_components/EmptyPurchases/EmptyPurchasesScreen";

export default function page() {
  return (
    <AuthGuard>
      <EmptyPurchasesScreen>
        <Charts />
      </EmptyPurchasesScreen>
    </AuthGuard>
  );
}
