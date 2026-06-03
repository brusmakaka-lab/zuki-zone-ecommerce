import { TrackedWhatsAppLink } from "@/components/analytics-trackers";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappUrl } from "@/lib/utils";

export function WhatsAppFloat({ phone }: { phone: string }) {
  return (
    <TrackedWhatsAppLink
      href={whatsappUrl(phone, "Hola Zuki Zone, quiero hacer una consulta.")}
      className="group fixed bottom-5 right-5 z-[80] grid h-[52px] w-[52px] place-items-center rounded-full bg-white shadow-[0_14px_34px_rgba(21,128,61,0.28)] ring-1 ring-emerald-900/10 transition duration-200 hover:scale-[1.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 before:absolute before:inset-0 before:rounded-full before:bg-emerald-500/35 before:animate-ping sm:h-14 sm:w-14"
      ariaLabel="Consultar por WhatsApp"
    >
      <WhatsAppIcon size={56} className="relative h-full w-full p-0.5 transition duration-200 group-hover:drop-shadow-sm" alt="WhatsApp" />
    </TrackedWhatsAppLink>
  );
}
