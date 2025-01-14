import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Dashboard/Navbar";
import Sidebar from "../_components/Dashboard/Sidebar";

export default function page() {
  return (
    <AuthGuard>
      <Navbar />
      <Sidebar />
    </AuthGuard>
  );
}
