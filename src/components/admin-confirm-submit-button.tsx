"use client";

import { Trash2 } from "lucide-react";

export function AdminConfirmSubmitButton({
  disabled,
  message,
  children,
}: {
  disabled?: boolean;
  message: string;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={(event) => {
        if (!confirm(message)) event.preventDefault();
      }}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-3 text-sm font-bold text-rose-700 disabled:cursor-not-allowed disabled:opacity-45"
    >
      <Trash2 size={16} />
      {children}
    </button>
  );
}
