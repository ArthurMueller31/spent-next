import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Home/Navbar";
import ProductTable from "../_components/Tables/ProductTable";
import TablePageSidebar from "../_components/Tables/Sidebar";

export default function page() {
  return (
    <>
      <AuthGuard>
        <TablePageSidebar />
        <Navbar />
        <ProductTable />
      </AuthGuard>
    </>
  );
}
