import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Navigation/Navbar/Navbar";
import Sidebar from "../_components/Navigation/Sidebar/Sidebar";
import AllPurchases from "../_components/Tables/AllPurchases";

export default function page() {
  return (
    // Navbar e check
    <>
      <AuthGuard>
        <Sidebar />
        <Navbar />
        <AllPurchases />
      </AuthGuard>
    </>
  );
}
