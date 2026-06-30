"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteArticleButtonProps {
  id: string;
  title: string;
}

export function DeleteArticleButton({ id, title }: DeleteArticleButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer "${title}" ?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "..." : "Supprimer"}
    </button>
  );
}
