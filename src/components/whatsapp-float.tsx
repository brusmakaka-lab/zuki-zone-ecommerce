import { MessageCircle } from "lucide-react";
import { TrackedWhatsAppLink } from "@/components/analytics-trackers";
import { whatsappUrl } from "@/lib/utils";

export function WhatsAppFloat({ phone }: { phone: string }) {
  return (
    <TrackedWhatsAppLink
      href={whatsappUrl(phone, "Hola Zuki Zone, quiero hacer una consulta.")}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-900/30 before:absolute before:inset-0 before:rounded-full before:bg-emerald-500 before:opacity-40 before:animate-ping"
      ariaLabel="Consultar por WhatsApp"
    >
      <MessageCircle className="relative h-7 w-7" />
    </TrackedWhatsAppLink>
  );
}
