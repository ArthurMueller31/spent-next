import AccountPage from "../_components/Account/AccountPage";
import AuthGuard from "../_components/Auth/AuthGuard";
import Navbar from "../_components/Navigation/Navbar/Navbar";

export default function page() {
  return (
    <>
      <AuthGuard>
        <Navbar />
        <AccountPage />
      </AuthGuard>
    </>
  );
}
