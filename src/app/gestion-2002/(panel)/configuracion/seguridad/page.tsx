import { requireAdminSession } from "@/lib/admin-auth";
import { AdminSecurityForm } from "@/components/admin-security-form";

export default async function AdminSecurityPage() {
  const admin = await requireAdminSession();

  return (
    <div>
      <h1 className="text-3xl font-black text-stone-950">Seguridad</h1>
      {admin.mustChangePassword ? (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Por seguridad cambia la contraseña inicial.
        </div>
      ) : null}
      <AdminSecurityForm email={admin.email ?? ""} />
    </div>
  );
}
