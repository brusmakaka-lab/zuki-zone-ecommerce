import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const money = (value: number) => value.toFixed(2);

async function main() {
  const settingsData = {
    storeName: "Zuki Zone",
    tagline: "Bazar, deco y soluciones lindas para todos los dias.",
    heroTitle: "Todo para tu casa, con estilo propio y compra simple.",
    heroText:
      "Compras simples por catalogo, atencion por WhatsApp y seguimiento claro de cada pedido.",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491123456789",
    email: "hola@zukizone.com",
    address: "Atencion online y retiros coordinados",
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
    logoHeight: 48,
    ogImageUrl: "/zuki-hero-1.svg",
    bannerText: "Envio coordinado en CABA y alrededores. Consultanos por entregas al interior.",
    shippingText: "Despachos coordinados y retiros pactados.",
    paymentText: "Transferencia, efectivo o pago a coordinar por WhatsApp.",
    aboutText:
      "Zuki Zone selecciona productos de bazar, organizacion y deco para resolver compras cotidianas con una experiencia clara, rapida y cercana.",
    newsletterTitle: "Recibi novedades y ofertas de Zuki Zone",
    newsletterText: "Te avisamos cuando entran productos, ideas nuevas y promos especiales.",
  };

  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: settingsData,
    create: {
      id: "main",
      ...settingsData,
    },
  });

  const categories = [
    ["Cocina", "cocina", "Utensilios, ollas, tablas y soluciones para preparar mejor."],
    ["Mesa", "mesa", "Vajilla, vasos, fuentes y accesorios para servir."],
    ["Baño", "bano", "Organizacion, textiles y accesorios para renovar el bano."],
    ["Deco", "deco", "Detalles calidos para transformar ambientes."],
    ["Textil", "textil", "Mantas, almohadones, manteles y fibras para el hogar."],
    ["Organización", "organizacion", "Canastos, cajas y recursos para ordenar mejor."],
    ["Aire libre", "aire-libre", "Productos para salidas, camping y balcones."],
    ["Festividades", "festividades", "Temporadas, celebraciones y decoracion especial."],
    ["Regalos", "regalos", "Ideas listas para sorprender."],
  ] as const;

  const createdCategories = await Promise.all(
    categories.map(([name, slug, description], index) =>
      prisma.category.upsert({
        where: { slug },
        update: { name, description, sortOrder: index },
        create: {
          name,
          slug,
          description,
          sortOrder: index,
          imageUrl: `/zuki-category-${slug}.svg`,
        },
      }),
    ),
  );

  const bySlug = new Map(createdCategories.map((category) => [category.slug, category.id]));

  const subcategories = [
    ["Utensilios", "utensilios", "cocina"],
    ["Ollas y sartenes", "ollas-sartenes", "cocina"],
    ["Frascos y organizadores", "frascos-organizadores", "cocina"],
    ["Vajilla", "vajilla", "mesa"],
    ["Tazas y jarros", "tazas-jarros", "mesa"],
    ["Vasos y copas", "vasos-copas", "mesa"],
    ["Set de baño", "set-bano", "bano"],
    ["Laundry", "laundry", "bano"],
    ["Aromas", "aromas", "deco"],
    ["Objetos deco", "objetos-deco", "deco"],
    ["Almohadones", "almohadones", "textil"],
    ["Manteles", "manteles", "textil"],
    ["Canastos", "canastos", "organizacion"],
    ["Cajas", "cajas", "organizacion"],
    ["Camping", "camping", "aire-libre"],
    ["Navidad", "navidad", "festividades"],
    ["Combos", "combos", "regalos"],
  ] as const;

  await Promise.all(
    subcategories.map(([name, slug, parent]) =>
      prisma.category.upsert({
        where: { slug },
        update: { name, parentId: bySlug.get(parent), imageUrl: `/zuki-category-${parent}.svg` },
        create: {
          name,
          slug,
          parentId: bySlug.get(parent),
          imageUrl: `/zuki-category-${parent}.svg`,
          description: `Seleccion de ${name.toLowerCase()} para Zuki Zone.`,
        },
      }),
    ),
  );

  const products = [
    {
      name: "Set de bowls Serena",
      slug: "set-bowls-serena",
      category: "cocina",
      description:
        "Set de tres bowls apilables con terminacion mate. Ideales para servir, preparar y guardar sin ocupar espacio.",
      price: 28900,
      previousPrice: 34900,
      stock: 14,
      featured: true,
      onSale: true,
    },
    {
      name: "Lampara Aura de mesa",
      slug: "lampara-aura-mesa",
      category: "deco",
      description:
        "Lampara compacta con luz calida y base metalica. Suma ambiente en mesas de luz, escritorios o rincones de lectura.",
      price: 46200,
      stock: 8,
      featured: true,
      onSale: false,
    },
    {
      name: "Manta Nube tejida",
      slug: "manta-nube-tejida",
      category: "textil",
      description:
        "Manta suave de trama abierta, liviana y abrigada. Pensada para sofa, cama o espacios de descanso.",
      price: 53800,
      previousPrice: 61800,
      stock: 6,
      featured: true,
      onSale: true,
    },
    {
      name: "Canasto Oslo multiuso",
      slug: "canasto-oslo-multiuso",
      category: "organizacion",
      description:
        "Canasto firme con manijas reforzadas para juguetes, ropa, mantas o productos de limpieza.",
      price: 21900,
      stock: 20,
      featured: false,
      onSale: false,
    },
    {
      name: "Tabla Lima premium",
      slug: "tabla-lima-premium",
      category: "mesa",
      description:
        "Tabla de servir con veta natural, borde suave y tamano comodo para picadas o apoyo diario.",
      price: 31400,
      stock: 11,
      featured: true,
      onSale: false,
    },
    {
      name: "Difusor Botanico",
      slug: "difusor-botanico",
      category: "deco",
      description:
        "Difusor aromatico de larga duracion con varillas de fibra. Fragancia fresca para living, bano o dormitorio.",
      price: 17600,
      previousPrice: 19900,
      stock: 4,
      featured: false,
      onSale: true,
    },
  ];

  for (const product of products) {
    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: money(product.price),
        previousPrice: product.previousPrice ? money(product.previousPrice) : null,
        stock: product.stock,
        featured: product.featured,
        onSale: product.onSale,
        categoryId: bySlug.get(product.category)!,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: money(product.price),
        previousPrice: product.previousPrice ? money(product.previousPrice) : undefined,
        stock: product.stock,
        featured: product.featured,
        onSale: product.onSale,
        categoryId: bySlug.get(product.category)!,
      },
    });

    await prisma.productImage.upsert({
      where: { id: `${product.slug}-main` },
      update: { url: `/product-${product.slug}.svg`, alt: product.name, isMain: true },
      create: {
        id: `${product.slug}-main`,
        productId: saved.id,
        url: `/product-${product.slug}.svg`,
        alt: product.name,
        isMain: true,
      },
    });
  }

  const heroSlides = [
    {
      title: "Bazar funcional para casas con movimiento",
      subtitle: "Cocina, mesa, deco y organizacion con productos listos para sumar a tu rutina.",
      imageUrl: "/zuki-hero-1.svg",
      ctaLabel: "Comprar novedades",
      ctaHref: "/catalogo",
    },
    {
      title: "Ofertas para renovar sin esperar",
      subtitle: "Seleccion de oportunidades con consulta rapida por WhatsApp y seguimiento del pedido.",
      imageUrl: "/zuki-hero-2.svg",
      ctaLabel: "Ver ofertas",
      ctaHref: "/catalogo?oferta=1",
    },
  ];

  await Promise.all(
    heroSlides.map((slide, index) =>
      prisma.heroSlide.upsert({
        where: { id: `slide-${index + 1}` },
        update: { ...slide, sortOrder: index },
        create: { id: `slide-${index + 1}`, ...slide, sortOrder: index },
      }),
    ),
  );

  const ideas = [
    ["Orden visual en cocina chica", "Frascos, bandejas y canastos para ganar superficie sin perder estilo.", "/zuki-idea-cocina.svg", "/catalogo?categoria=cocina"],
    ["Mesa lista en diez minutos", "Piezas comodas para servir rico, simple y con una mesa bien armada.", "/zuki-idea-mesa.svg", "/catalogo?categoria=mesa"],
    ["Rincones que cambian el ambiente", "Aromas, luz y textiles para darle calidez a cualquier espacio.", "/zuki-idea-deco.svg", "/catalogo?categoria=deco"],
  ] as const;

  await Promise.all(
    ideas.map(([title, excerpt, imageUrl, href], index) =>
      prisma.inspirationIdea.upsert({
        where: { id: `idea-${index + 1}` },
        update: { title, excerpt, imageUrl, href, sortOrder: index },
        create: { id: `idea-${index + 1}`, title, excerpt, imageUrl, href, sortOrder: index },
      }),
    ),
  );

  const benefits = [
    ["Tarjeta o efectivo", "Pagas como prefieras al coordinar tu compra.", "credit-card"],
    ["Retiro coordinado", "Preparamos tu pedido para retirar sin vueltas.", "store"],
    ["Envios en el dia", "Opciones rapidas segun zona y disponibilidad.", "truck"],
    ["Envios a todo el pais", "Despachamos compras seleccionadas al interior.", "map"],
  ] as const;

  await Promise.all(
    benefits.map(([title, description, icon], index) =>
      prisma.storeBenefit.upsert({
        where: { id: `benefit-${index + 1}` },
        update: { title, description, icon, sortOrder: index },
        create: { id: `benefit-${index + 1}`, title, description, icon, sortOrder: index },
      }),
    ),
  );

  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@zukizone.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin1234";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        role: Role.ADMIN,
        name: "Administrador Zuki Zone",
        passwordHash: await hash(adminPassword, 12),
        mustChangePassword: adminPassword === "admin1234",
      },
    });
  } else if (existingAdmin.role !== Role.ADMIN || !existingAdmin.passwordHash) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        role: Role.ADMIN,
        passwordHash: existingAdmin.passwordHash ?? (await hash(adminPassword, 12)),
        mustChangePassword: !existingAdmin.passwordHash && adminPassword === "admin1234",
      },
    });
  }

  console.log(`Seed listo para ${settings.storeName}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
