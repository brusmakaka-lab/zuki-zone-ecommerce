# Zuki Zone E-commerce

E-commerce full-stack con Next.js App Router, TypeScript, TailwindCSS, Prisma, Auth.js/NextAuth, PostgreSQL Neon y panel administrador.

Produccion: https://zuki-zone.vercel.app
Panel admin: https://zuki-zone.vercel.app/gestion-2002/login

## Stack

- Next.js 16 App Router + React 19
- TypeScript + TailwindCSS 4
- Prisma 6 + PostgreSQL Neon
- Auth.js con Google OAuth y Prisma Adapter
- Carrito client-side, checkout con pedido persistido y consulta por WhatsApp
- Admin protegido por rol `ADMIN` en `/gestion-2002`; `/admin` redirige al home.

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/db?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/db?sslmode=require"
AUTH_SECRET="openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="mismo-valor-si-tu-entorno-lo-requiere"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ADMIN_EMAIL="admin@zukizone.com"
ADMIN_PASSWORD="admin1234"
BLOB_READ_WRITE_TOKEN=""
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="5491123456789"
MERCADOPAGO_ACCESS_TOKEN=""
```

`ADMIN_EMAIL` y `ADMIN_PASSWORD` crean el acceso inicial del panel. Cambiar la contraseña inicial desde `/gestion-2002/configuracion/seguridad`.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Prisma y Neon

1. Crear un proyecto Neon PostgreSQL.
2. Copiar connection strings pooled/direct en `DATABASE_URL` y `DIRECT_URL`.
3. Ejecutar:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run db:seed
```

Para producción:

```bash
npm run prisma:deploy
```

## Deploy en Vercel

1. Proyecto Vercel: `zuki-zone`.
2. Configurar todas las variables de entorno en Production, Preview y Development.
3. Usar build command `npm run build`.
4. Antes del primer deploy productivo, ejecutar migraciones contra Neon:

```bash
npm run prisma:deploy
npm run db:seed
```

## Pagos e imágenes

- Mercado Pago queda preparado con `MERCADOPAGO_ACCESS_TOKEN`; si no existe, el checkout usa consulta y pago a coordinar por WhatsApp.
- Las imágenes aceptan rutas locales, URLs externas o URLs de Vercel Blob. Para carga real desde admin falta conectar subida con `BLOB_READ_WRITE_TOKEN`.

## Panel editable

Entrar por `/gestion-2002/login` con las credenciales admin propias. El login de Google es solo para clientes y no habilita acceso al panel. Desde el panel se administran productos, categorias, subcategorias, pedidos, clientes, hero, ideas, beneficios, footer, redes, newsletter, apariencia basica y seguridad.

## Operacion

- Cambiar contrasena: `/gestion-2002/configuracion/seguridad`.
- Subir productos: `/gestion-2002/productos`.
- Imagenes: cargar una URL local, externa o de Vercel Blob en el campo de imagen. La subida directa a Blob queda pendiente si no existe `BLOB_READ_WRITE_TOKEN`.
- Apariencia y contenido: `/gestion-2002/contenido`.
- Migraciones: `npm run prisma:deploy`.
