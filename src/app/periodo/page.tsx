import CustomDateBarChart from "../_components/CustomPurchaseDates/CustomDateBarChart";
import Navbar from "../_components/Navigation/Navbar/Navbar";
import Sidebar from "../_components/Navigation/Sidebar/Sidebar";
import EmptyPurchasesScreen from "../_components/EmptyPurchases/EmptyPurchasesScreen";
import AuthGuard from "../_components/Auth/AuthGuard";

export default function page() {
  return (
    <>
      <AuthGuard>
        <EmptyPurchasesScreen>
          <Navbar />
          <Sidebar />
          <CustomDateBarChart />
        </EmptyPurchasesScreen>
      </AuthGuard>
    </>
  );
}
