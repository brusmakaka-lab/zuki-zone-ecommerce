import type { OrderStatus } from "@prisma/client";

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId?: string | null;
  children?: StoreCategory[];
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  price: number;
  previousPrice: number | null;
  stock: number;
  minStock?: number;
  tags?: string[];
  featured: boolean;
  onSale: boolean;
  isNew?: boolean;
  published: boolean;
  active: boolean;
  category: StoreCategory;
  images: { id: string; url: string; alt: string | null }[];
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  heroTitle: string;
  heroText: string;
  whatsappNumber: string;
  email: string;
  address: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl?: string | null;
  logoUrl?: string | null;
  logoHeight?: number;
  faviconUrl?: string | null;
  ogImageUrl?: string | null;
  primaryColor?: string;
  accentColor?: string;
  radius?: number;
  themeMode?: string;
  bannerText: string | null;
  shippingText: string | null;
  paymentText: string | null;
  aboutText?: string | null;
  newsletterTitle?: string | null;
  newsletterText?: string | null;
};

export type StoreOrder = {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  total: number;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  createdAt: Date;
  items: {
    id: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
  statusHistory: { id: string; status: OrderStatus; note: string | null; createdAt: Date }[];
};

export const demoSettings: StoreSettings = {
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
  tiktokUrl: null,
  logoUrl: null,
  logoHeight: 48,
  faviconUrl: null,
  ogImageUrl: "/zuki-hero-1.svg",
  primaryColor: "#7c3aed",
  accentColor: "#f97316",
  radius: 10,
  themeMode: "light",
  bannerText: "Envio coordinado en CABA y alrededores. Consultanos por entregas al interior.",
  shippingText: "Despachos coordinados y retiros pactados.",
  paymentText: "Transferencia, efectivo o pago a coordinar por WhatsApp.",
  aboutText:
    "Zuki Zone selecciona productos de bazar, organizacion y deco para resolver compras cotidianas con una experiencia clara, rapida y cercana.",
  newsletterTitle: "Recibi novedades y ofertas de Zuki Zone",
  newsletterText: "Te avisamos cuando entran productos, ideas nuevas y promos especiales.",
};

export const demoCategories: StoreCategory[] = [
  {
    id: "cat-cocina",
    name: "Cocina",
    slug: "cocina",
    description: "Utensilios, ollas, tablas y soluciones para preparar mejor.",
    imageUrl: "/zuki-category-cocina.svg",
    children: [
      { id: "sub-utensilios", name: "Utensilios", slug: "utensilios", description: null, imageUrl: null, parentId: "cat-cocina" },
      { id: "sub-ollas", name: "Ollas y sartenes", slug: "ollas-sartenes", description: null, imageUrl: null, parentId: "cat-cocina" },
      { id: "sub-frascos", name: "Frascos y organizadores", slug: "frascos-organizadores", description: null, imageUrl: null, parentId: "cat-cocina" },
    ],
  },
  {
    id: "cat-mesa",
    name: "Mesa",
    slug: "mesa",
    description: "Vajilla, vasos, fuentes y accesorios para servir.",
    imageUrl: "/zuki-category-mesa.svg",
    children: [
      { id: "sub-vajilla", name: "Vajilla", slug: "vajilla", description: null, imageUrl: null, parentId: "cat-mesa" },
      { id: "sub-tazas", name: "Tazas y jarros", slug: "tazas-jarros", description: null, imageUrl: null, parentId: "cat-mesa" },
      { id: "sub-vasos", name: "Vasos y copas", slug: "vasos-copas", description: null, imageUrl: null, parentId: "cat-mesa" },
    ],
  },
  {
    id: "cat-bano",
    name: "Baño",
    slug: "bano",
    description: "Organizacion, textiles y accesorios para renovar el baño.",
    imageUrl: "/zuki-category-bano.svg",
  },
  {
    id: "cat-deco",
    name: "Deco",
    slug: "deco",
    description: "Detalles calidos para transformar ambientes.",
    imageUrl: "/zuki-category-deco.svg",
  },
  {
    id: "cat-textiles",
    name: "Textiles",
    slug: "textiles",
    description: "Mantas, almohadones, manteles y fibras para el hogar.",
    imageUrl: "/zuki-category-textil.svg",
  },
  {
    id: "cat-organizacion",
    name: "Organizacion",
    slug: "organizacion",
    description: "Soluciones compactas para ordenar mejor.",
    imageUrl: "/zuki-category-organizacion.svg",
  },
  {
    id: "cat-aire-libre",
    name: "Aire libre",
    slug: "aire-libre",
    description: "Productos para salidas, camping y balcones.",
    imageUrl: "/zuki-category-aire-libre.svg",
  },
  {
    id: "cat-festividades",
    name: "Festividades",
    slug: "festividades",
    description: "Temporadas, celebraciones y decoracion especial.",
    imageUrl: "/zuki-category-festividades.svg",
  },
  {
    id: "cat-regalos",
    name: "Regalos",
    slug: "regalos",
    description: "Ideas listas para sorprender.",
    imageUrl: "/zuki-category-regalos.svg",
  },
];

const categoryBySlug = new Map(demoCategories.map((category) => [category.slug, category]));

export const demoProducts: StoreProduct[] = [
  {
    id: "prod-serena",
    name: "Set de bowls Serena",
    slug: "set-bowls-serena",
    description:
      "Set de tres bowls apilables con terminacion mate. Ideales para servir, preparar y guardar sin ocupar espacio.",
    price: 28900,
    previousPrice: 34900,
    stock: 14,
    featured: true,
    onSale: true,
    published: true,
    active: true,
    category: categoryBySlug.get("cocina")!,
    images: [{ id: "img-serena", url: "/product-set-bowls-serena.svg", alt: "Set de bowls Serena" }],
  },
  {
    id: "prod-aura",
    name: "Lampara Aura de mesa",
    slug: "lampara-aura-mesa",
    description:
      "Lampara compacta con luz calida y base metalica. Suma ambiente en mesas de luz, escritorios o rincones de lectura.",
    price: 46200,
    previousPrice: null,
    stock: 8,
    featured: true,
    onSale: false,
    published: true,
    active: true,
    category: categoryBySlug.get("deco")!,
    images: [{ id: "img-aura", url: "/product-lampara-aura-mesa.svg", alt: "Lampara Aura de mesa" }],
  },
  {
    id: "prod-nube",
    name: "Manta Nube tejida",
    slug: "manta-nube-tejida",
    description:
      "Manta suave de trama abierta, liviana y abrigada. Pensada para sofa, cama o espacios de descanso.",
    price: 53800,
    previousPrice: 61800,
    stock: 6,
    featured: true,
    onSale: true,
    published: true,
    active: true,
    category: categoryBySlug.get("textiles")!,
    images: [{ id: "img-nube", url: "/product-manta-nube-tejida.svg", alt: "Manta Nube tejida" }],
  },
  {
    id: "prod-oslo",
    name: "Canasto Oslo multiuso",
    slug: "canasto-oslo-multiuso",
    description:
      "Canasto firme con manijas reforzadas para juguetes, ropa, mantas o productos de limpieza.",
    price: 21900,
    previousPrice: null,
    stock: 20,
    featured: false,
    onSale: false,
    published: true,
    active: true,
    category: categoryBySlug.get("organizacion")!,
    images: [{ id: "img-oslo", url: "/product-canasto-oslo-multiuso.svg", alt: "Canasto Oslo multiuso" }],
  },
  {
    id: "prod-lima",
    name: "Tabla Lima premium",
    slug: "tabla-lima-premium",
    description:
      "Tabla de servir con veta natural, borde suave y tamano comodo para picadas o apoyo diario.",
    price: 31400,
    previousPrice: null,
    stock: 11,
    featured: true,
    onSale: false,
    published: true,
    active: true,
    category: categoryBySlug.get("mesa")!,
    images: [{ id: "img-lima", url: "/product-tabla-lima-premium.svg", alt: "Tabla Lima premium" }],
  },
  {
    id: "prod-botanico",
    name: "Difusor Botanico",
    slug: "difusor-botanico",
    description:
      "Difusor aromatico de larga duracion con varillas de fibra. Fragancia fresca para living, bano o dormitorio.",
    price: 17600,
    previousPrice: 19900,
    stock: 4,
    featured: false,
    onSale: true,
    published: true,
    active: true,
    category: categoryBySlug.get("deco")!,
    images: [{ id: "img-botanico", url: "/product-difusor-botanico.svg", alt: "Difusor Botanico" }],
  },
];

export const demoHeroSlides = [
  {
    id: "slide-1",
    title: "Bazar funcional para casas con movimiento",
    subtitle: "Cocina, mesa, deco y organizacion con productos listos para sumar a tu rutina.",
    imageUrl: "/zuki-hero-1.svg",
    ctaLabel: "Comprar novedades",
    ctaHref: "/catalogo",
  },
  {
    id: "slide-2",
    title: "Ofertas para renovar sin esperar",
    subtitle: "Seleccion de oportunidades con consulta rapida por WhatsApp y seguimiento del pedido.",
    imageUrl: "/zuki-hero-2.svg",
    ctaLabel: "Ver ofertas",
    ctaHref: "/catalogo?oferta=1",
  },
];

export const demoIdeas = [
  {
    id: "idea-1",
    title: "Orden visual en cocina chica",
    excerpt: "Frascos, bandejas y canastos para ganar superficie sin perder estilo.",
    imageUrl: "/zuki-idea-cocina.svg",
    href: "/catalogo?categoria=cocina",
  },
  {
    id: "idea-2",
    title: "Mesa lista en diez minutos",
    excerpt: "Piezas comodas para servir rico, simple y con una mesa bien armada.",
    imageUrl: "/zuki-idea-mesa.svg",
    href: "/catalogo?categoria=mesa",
  },
  {
    id: "idea-3",
    title: "Rincones que cambian el ambiente",
    excerpt: "Aromas, luz y textiles para darle calidez a cualquier espacio.",
    imageUrl: "/zuki-idea-deco.svg",
    href: "/catalogo?categoria=deco",
  },
];

export const demoBenefits = [
  { id: "benefit-1", title: "Tarjeta o efectivo", description: "Pagas como prefieras al coordinar tu compra.", icon: "credit-card" },
  { id: "benefit-2", title: "Retiro coordinado", description: "Preparamos tu pedido para retirar sin vueltas.", icon: "store" },
  { id: "benefit-3", title: "Envios en el dia", description: "Opciones rapidas segun zona y disponibilidad.", icon: "truck" },
  { id: "benefit-4", title: "Envios a todo el pais", description: "Despachamos compras seleccionadas al interior.", icon: "map" },
];
