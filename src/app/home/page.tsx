import AuthGuard from "../_components/Auth/AuthGuard";
import Charts from "../_components/Charts/Charts";
import Navbar from "../_components/Navigation/Navbar/Navbar";
import Sidebar from "../_components/Navigation/Sidebar/Sidebar";

export default function page() {
  return (
    <AuthGuard>
      <Sidebar />
      <Navbar />
      <Charts />
    </AuthGuard>
  );
}
