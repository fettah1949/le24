"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import { SlugInput } from "./ImageUpload";

interface CrudFormProps {
  type: "categories" | "tags" | "authors";
  initialData?: Record<string, string>;
  editId?: string;
}

export function CrudForm({ type, initialData, editId }: CrudFormProps) {
  const router = useRouter();
  const isEdit = !!editId;

  const [form, setForm] = useState<Record<string, string>>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    bio: initialData?.bio ?? "",
    email: initialData?.email ?? "",
    twitter: initialData?.twitter ?? "",
    website: initialData?.website ?? "",
    avatar: initialData?.avatar ?? "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/${type}/${editId}` : `/api/${type}`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }

      router.push(`/admin/${type}`);
      router.refresh();
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label className="label-field">Nom *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="input-field"
          required
        />
      </div>

      <SlugInput
        title={form.name}
        value={form.slug}
        onChange={(slug) => updateField("slug", slug)}
      />

      {type === "categories" && (
        <div>
          <label className="label-field">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="input-field"
          />
        </div>
      )}

      {type === "authors" && (
        <>
          <div>
            <label className="label-field">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              rows={3}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Twitter</label>
            <input
              type="text"
              value={form.twitter}
              onChange={(e) => updateField("twitter", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Avatar URL</label>
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => updateField("avatar", e.target.value)}
              className="input-field"
            />
          </div>
        </>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "..." : isEdit ? "Mettre à jour" : "Créer"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Annuler
        </button>
      </div>
    </form>
  );
}

export function DeleteButton({
  id,
  type,
  name,
}: {
  id: string;
  type: string;
  name: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Impossible de supprimer");
  }

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline text-sm">
      Supprimer
    </button>
  );
}
