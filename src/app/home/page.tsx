import AuthGuard from "../_components/Auth/AuthGuard";
import Sidebar from "../_components/Home/Sidebar";

export default function page() {
  return (
    <AuthGuard>
      
      <Sidebar />
    </AuthGuard>
  );
}
