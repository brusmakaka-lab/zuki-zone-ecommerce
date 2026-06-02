# Zuki Zone E-commerce

E-commerce full-stack con Next.js App Router, TypeScript, TailwindCSS, Prisma, Auth.js/NextAuth, PostgreSQL Neon y panel administrador.

Produccion: https://zuki-zone.vercel.app
Panel admin: https://zuki-zone.vercel.app/gestion-2002/login

## Stack

- Next.js 16 App Router + React 19
- TypeScript + TailwindCSS 4
- Prisma 6 + PostgreSQL Neon
- Auth.js con Google OAuth opcional para clientes
- Admin propio con email/password y cookie httpOnly
- Carrito client-side, checkout invitado y pedido por WhatsApp

## Variables de entorno

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

`ADMIN_EMAIL` y `ADMIN_PASSWORD` crean el acceso inicial. Cambiar la contrasena desde `/gestion-2002/configuracion/seguridad`.

## Desarrollo

```bash
npm install
npm run dev
npm run prisma:migrate -- --name init
npm run db:seed
```

## Produccion

```bash
npm run prisma:deploy
npm run db:seed
npm run build
npx vercel deploy --prod --yes
```

## Imagenes y Blob

- Upload real: `/api/admin/upload`, protegido por sesion admin.
- Formatos: jpg, jpeg, png, webp, svg e ico.
- Maximo: 4 MB.
- Requiere `BLOB_READ_WRITE_TOKEN`.
- Si falta el token, el admin muestra error claro y no simula exito.

## Mapa de imagenes editables

- Logo: `SiteSettings.logoUrl`, alto `SiteSettings.logoHeight`; se renderiza en header, footer y metadata fallback.
- Favicon: `SiteSettings.faviconUrl`; se aplica en `generateMetadata().icons`.
- OpenGraph: `SiteSettings.ogImageUrl`; se aplica en `generateMetadata().openGraph.images`.
- Hero: `HeroSlide.imageUrl`; se renderiza en el slider de home.
- Categorias/subcategorias: `Category.imageUrl`; se renderiza en home y catalogo.
- Productos: `ProductImage.url`, `ProductImage.isMain`, `ProductImage.sortOrder`; catalogo usa la principal y detalle muestra galeria.
- Ideas: `InspirationIdea.imageUrl`; se renderiza en Inspiracion Zuki.

## Operacion admin

- Login: `/gestion-2002/login`.
- Productos e imagenes: `/gestion-2002/productos`.
- Categorias/subcategorias: `/gestion-2002/categorias`.
- Hero, logo, favicon, OG, ideas, beneficios y apariencia: `/gestion-2002/contenido`.
- Seguridad: `/gestion-2002/configuracion/seguridad`.

Despues de cambios admin se revalidan home, catalogo, producto y vistas internas relevantes.
