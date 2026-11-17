# Zuki Zone E-commerce

Tienda online con catálogo, carrito, checkout por WhatsApp y administración de productos y contenidos.

Respaldo público del código local seleccionado el **16 de noviembre de 2026**. Las cuatro variantes Zuki se revisaron por archivos y esquema; tienen diferencias funcionales y se conservan en repositorios independientes. Este respaldo identifica el estado vigente encontrado; no presenta los prototipos como productos terminados.

## Qué contiene

- Catálogo y detalle de productos, categorías, imágenes y carrito.
- Pedidos, estados e historial; perfiles de clientes y suscripción al newsletter.
- Autenticación con Auth.js y proveedor Google configurable.
- Administración en `/gestion-2002`: productos y contenido de la tienda, como slides, beneficios e ideas.
- Código para subir imágenes mediante Vercel Blob. El checkout principal prepara la comunicación por WhatsApp.

**Tecnologías:** Next.js 16.2.6 · React 19.2.4 · Prisma 6.19.3 · Auth.js · Tailwind CSS 4. Las versiones exactas de las dependencias están fijadas en `package-lock.json`. El indicador `private: true` de package.json evita publicar el paquete en npm; no define la visibilidad de GitHub.

## Instalación local

Entorno verificado: Node.js 24.13.1 y npm 11.8.0 en Windows, con el lockfile incluido. Crear una configuración local desde `.env.example`, completar únicamente valores propios y preparar una base de desarrollo cuando corresponda.

```bash
npm ci
npm run prisma:generate
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

Los pasos de base que aparecen abajo deben realizarse antes de usar las pantallas que consultan datos. `npm run start` sirve el build ya generado. Los comandos anteriores no publican un despliegue.

## Configuración

| Variables | Uso |
| --- | --- |
| `DATABASE_URL`, `DIRECT_URL` | PostgreSQL de la aplicación y conexión para herramientas de base |
| `AUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | Configuración de Auth.js y compatibilidad |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth de Google, si se habilita |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Cuenta inicial usada por el seed; definir valores propios |
| `BLOB_READ_WRITE_TOKEN` | Subida de imágenes |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` | URL pública y número de contacto |
| `MERCADOPAGO_ACCESS_TOKEN` | Variable prevista; no certifica un flujo de cobro integrado |

Las variables de servidor no deben usar el prefijo `NEXT_PUBLIC_`. Los secretos y credenciales reales no forman parte del repositorio.

## Datos y esquema

Incluye 19 modelos Prisma y 8 migraciones SQL. En una base de desarrollo nueva configurada por vos, aplicar `npx prisma migrate deploy`. El seed `npm run db:seed` modifica esa base: revisar su contenido y definir una contraseña propia antes de ejecutarlo.

## Validación y límites

La generación/validación de Prisma, lint, tipos y build pasaron con variables sintéticas. No se conectó una base real ni se probaron Google, login, WhatsApp, Blob o cobros. No hay suite de tests automatizados configurada.

Más detalles en [VALIDACION-GITHUB.md](VALIDACION-GITHUB.md). Una compilación correcta no certifica una tienda operativa en producción.

## Procedencia y alcance del respaldo

Se conserva el historial original de 17 commits y se añade un commit de respaldo/documentación. El árbol original estaba limpio.

Incluye fuentes, configuración versionable, lockfile, esquema y migraciones existentes, tests existentes y recursos locales seleccionados. No incluye `.env` privados, credenciales, bases de datos, pedidos/clientes reales, archivos de sesión, imágenes alojadas únicamente en servicios externos, capturas privadas, `node_modules`, `.next` ni otros derivados. Los datos de operación y medios externos necesitan un respaldo privado aparte. No se movió ni borró la fuente original.

## Variantes relacionadas

| Repositorio | Identidad |
| --- | --- |
| [zuki-zone-ecommerce](https://github.com/brusmakaka-lab/zuki-zone-ecommerce) | Tienda con Auth.js, contenido administrable y checkout WhatsApp |
| [zuki-shop](https://github.com/brusmakaka-lab/zuki-shop) | Tienda con variantes, JWT y código de pagos |
| [zuki-ropa-v46](https://github.com/brusmakaka-lab/zuki-ropa-v46) | Variante visual V4.6; integración Prisma 7 pendiente |
| [zuki-commerce-os](https://github.com/brusmakaka-lab/zuki-commerce-os) | Gestión comercial por organización en desarrollo |

