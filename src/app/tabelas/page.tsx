import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Navigation/Navbar/Navbar";
import Sidebar from "../_components/Navigation/Sidebar/Sidebar";
import ProductTable from "../_components/Tables/ProductTable";

export default function page() {
  return (
    // Navbar e check
    <>
      <AuthGuard>
        <Sidebar />
        <Navbar />
        <ProductTable />
      </AuthGuard>
    </>
  );
}
