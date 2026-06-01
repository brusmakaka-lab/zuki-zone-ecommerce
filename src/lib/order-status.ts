import type { OrderStatus } from "@prisma/client";

export const orderStatusLabels: Record<OrderStatus, string> = {
  CONSULTA_RECIBIDA: "Consulta recibida",
  PENDIENTE_DE_PAGO: "Pendiente de pago",
  PAGO_EN_REVISION: "Pago en revision",
  PAGO_CONFIRMADO: "Pago confirmado",
  PREPARANDO_PEDIDO: "Preparando pedido",
  ENVIADO: "Enviado / en camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const orderStatusFlow: OrderStatus[] = [
  "CONSULTA_RECIBIDA",
  "PENDIENTE_DE_PAGO",
  "PAGO_EN_REVISION",
  "PAGO_CONFIRMADO",
  "PREPARANDO_PEDIDO",
  "ENVIADO",
  "ENTREGADO",
];
