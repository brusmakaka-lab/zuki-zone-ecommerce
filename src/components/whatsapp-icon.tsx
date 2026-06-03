import Image from "next/image";
import { cn } from "@/lib/utils";

export function WhatsAppIcon({
  className,
  size = 20,
  alt = "",
}: {
  className?: string;
  size?: number;
  alt?: string;
}) {
  return (
    <Image
      src="/whatsapp-icon.png"
      alt={alt}
      width={size}
      height={size}
      aria-hidden={alt ? undefined : true}
      className={cn("shrink-0 object-contain", className)}
      priority={size >= 52}
    />
  );
}
