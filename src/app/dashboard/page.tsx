import AuthGuard from "../_components/Auth/AuthGuard";

export default function page() {
  return (
    <AuthGuard>
      <div>Essa é a pg de dashboard</div>
    </AuthGuard>
  );
}
