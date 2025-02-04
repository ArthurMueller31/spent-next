import AuthGuard from "../_components/Auth/AuthGuard";
import Charts from "../_components/Charts/Charts";

export default function page() {
  return (
    <AuthGuard>
      <Charts />
    </AuthGuard>
  );
}
