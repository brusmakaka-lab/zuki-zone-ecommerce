export default function AdminSettingsPage() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <h1 className="text-3xl font-black text-stone-950">Configuracion</h1>
      <div className="mt-5 grid gap-3 text-sm text-stone-700">
        <p><strong>Imagenes:</strong> preparado para URLs locales, remotas o Vercel Blob con BLOB_READ_WRITE_TOKEN.</p>
        <p><strong>Pagos:</strong> Mercado Pago queda pendiente de activar con MERCADOPAGO_ACCESS_TOKEN.</p>
        <p><strong>Administrador:</strong> el acceso inicial se define con ADMIN_EMAIL y ADMIN_PASSWORD. Cambiar contraseña desde Seguridad.</p>
        <p><strong>Base de datos:</strong> usar Neon PostgreSQL con DATABASE_URL y DIRECT_URL.</p>
      </div>
    </div>
  );
}
