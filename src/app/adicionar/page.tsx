import AddProducts from "../_components/Add/AddProducts";
import Sidebar from "../_components/Sidebar/Sidebar"
import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Home/Navbar";

export default function page() {
  return (
    <>
      <AuthGuard>
        <Sidebar />
        <Navbar />
        <AddProducts />
      </AuthGuard>
    </>
  );
}
