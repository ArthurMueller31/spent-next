import AuthGuard from "../_components/Auth/AuthGuard";
import Sidebar from "../_components/Dashboard/Sidebar";

export default function page() {
  return (
    <AuthGuard>
      
      <Sidebar />
    </AuthGuard>
  );
}
