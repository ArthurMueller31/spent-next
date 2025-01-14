import AuthGuard from "../_components/Auth/AuthGuard";

export default function Dashboard() {
  return (
    <AuthGuard>
      <div>aqui está a página principal</div>
    </AuthGuard>
  );
}
