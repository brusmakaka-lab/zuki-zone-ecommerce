import type { OrderStatus } from "@prisma/client";
import { Check } from "lucide-react";
import { orderStatusFlow, orderStatusLabels } from "@/lib/order-status";

export function StatusTracker({ status }: { status: OrderStatus }) {
  const activeIndex = status === "CANCELADO" ? -1 : orderStatusFlow.indexOf(status);

  return (
    <div className="grid gap-3">
      {status === "CANCELADO" ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-4 font-semibold text-rose-800">
          Pedido cancelado
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-7">
        {orderStatusFlow.map((current, index) => {
          const done = index <= activeIndex;
          return (
            <div
              key={current}
              className="flex items-center gap-3 rounded-md border border-stone-200 bg-white p-3 md:block"
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                  done ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <p className="mt-0 text-sm font-semibold text-stone-800 md:mt-3">{orderStatusLabels[current]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
