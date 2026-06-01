import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) redirect("/gestion-2002/dashboard");

  return (
    <div className="grid min-h-dvh place-items-center bg-stone-100 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 shadow-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-violet-700 text-white">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center text-3xl font-black text-stone-950">Zuki Zone</h1>
        <p className="mt-2 text-center text-sm text-stone-500">Acceso privado de gestion</p>
        <AdminLoginForm />
        <Link href="/" className="mt-5 block text-center text-sm font-bold text-violet-800">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
