import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Home/Navbar";
import Sidebar from "../_components/Home/Sidebar";

export default function page() {
  return (
    <AuthGuard>
      <Sidebar />
      <Navbar />
    </AuthGuard>
  );
}
