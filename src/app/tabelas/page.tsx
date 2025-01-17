import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Home/Navbar";
import ProductTable from "../_components/Tables/ProductTable";
import Sidebar from "../_components/Sidebar/Sidebar"

export default function page() {
  return (
    <>
      <AuthGuard>
        <Sidebar />
        <Navbar />
        <ProductTable />
      </AuthGuard>
    </>
  );
}
