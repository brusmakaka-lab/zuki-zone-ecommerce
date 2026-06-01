import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";

type SearchParams = Promise<{ callbackUrl?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const params = await searchParams;
  if (session?.user) redirect(params.callbackUrl ?? "/mi-cuenta");
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-stone-950">Ingresar</h1>
        <p className="mt-3 text-stone-600">Usa tu cuenta de Google para comprar, guardar datos y seguir pedidos.</p>
        {googleConfigured ? (
          <form
            className="mt-8"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: params.callbackUrl ?? "/mi-cuenta" });
            }}
          >
            <button className="h-12 w-full rounded-md bg-stone-950 font-bold text-white">Continuar con Google</button>
          </form>
        ) : (
          <p className="mt-8 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-800">
            Login con Google no configurado.
          </p>
        )}
        <a href="/checkout" className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-md border border-stone-300 font-bold">
          Comprar como invitado
        </a>
      </div>
    </div>
  );
}
