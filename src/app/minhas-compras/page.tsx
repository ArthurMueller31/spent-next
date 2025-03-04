import AuthGuard from "../_components/Auth/AuthGuard";
import EmptyPurchasesScreen from "../_components/EmptyPurchases/EmptyPurchasesScreen";
import Navbar from "../_components/Navigation/Navbar/Navbar";
import Sidebar from "../_components/Navigation/Sidebar/Sidebar";
import AllPurchasesTable from "../_components/Tables/AllPurchasesTable";

export default function page() {
  return (
    // Navbar e check
    <>
      <AuthGuard>
        <EmptyPurchasesScreen>
          <Sidebar />
          <Navbar />
          <AllPurchasesTable />
        </EmptyPurchasesScreen>
      </AuthGuard>
    </>
  );
}
