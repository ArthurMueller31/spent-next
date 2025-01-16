import AddProducts from "../_components/Add/AddProducts";
import AddPageSidebar from "../_components/Add/Sidebar";
import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Home/Navbar";

export default function page() {
  return (
    <>
      <AuthGuard>
        <AddPageSidebar />
        <Navbar />
        <AddProducts />
      </AuthGuard>
    </>
  );
}
