import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Navigation/Navbar/Navbar";
import Sidebar from "../_components/Navigation/Sidebar/Sidebar"

export default function page() {
  return (
    <AuthGuard>
      <Sidebar />
      <Navbar />
    </AuthGuard>
  );
}
