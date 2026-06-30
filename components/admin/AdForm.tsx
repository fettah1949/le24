"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AD_SLOTS, AD_SLOT_IDS } from "@/lib/ads/slots";

interface AdFormProps {
  initialData?: {
    name: string;
    slot: string;
    type: "IMAGE" | "HTML";
    imageUrl: string;
    linkUrl: string;
    htmlCode: string;
    isActive: boolean;
    priority: number;
    startDate: string;
    endDate: string;
  };
  editId?: string;
}

export function AdForm({ initialData, editId }: AdFormProps) {
  const router = useRouter();
  const isEdit = !!editId;

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slot: initialData?.slot ?? "header-banner",
    type: initialData?.type ?? ("IMAGE" as "IMAGE" | "HTML"),
    imageUrl: initialData?.imageUrl ?? "",
    linkUrl: initialData?.linkUrl ?? "",
    htmlCode: initialData?.htmlCode ?? "",
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority ?? 0,
    startDate: initialData?.startDate ?? "",
    endDate: initialData?.endDate ?? "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/ads/${editId}` : "/api/ads";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }

      router.push("/admin/ads");
      router.refresh();
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label className="label-field">Nom interne *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Emplacement *</label>
          <select
            value={form.slot}
            onChange={(e) => updateField("slot", e.target.value)}
            className="input-field"
          >
            {AD_SLOT_IDS.map((slotId) => (
              <option key={slotId} value={slotId}>
                {AD_SLOTS[slotId].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Type *</label>
          <select
            value={form.type}
            onChange={(e) => updateField("type", e.target.value as "IMAGE" | "HTML")}
            className="input-field"
          >
            <option value="IMAGE">Image + lien</option>
            <option value="HTML">Code HTML</option>
          </select>
        </div>
      </div>

      {form.type === "IMAGE" ? (
        <>
          <ImageUpload
            label="Image publicitaire *"
            value={form.imageUrl}
            onChange={(url) => updateField("imageUrl", url)}
          />
          <div>
            <label className="label-field">URL de destination</label>
            <input
              type="url"
              value={form.linkUrl}
              onChange={(e) => updateField("linkUrl", e.target.value)}
              className="input-field"
              placeholder="https://..."
            />
          </div>
        </>
      ) : (
        <div>
          <label className="label-field">Code HTML *</label>
          <textarea
            value={form.htmlCode}
            onChange={(e) => updateField("htmlCode", e.target.value)}
            rows={6}
            className="input-field font-mono text-xs"
            placeholder="<div>...</div>"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label-field">Priorité (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.priority}
            onChange={(e) => updateField("priority", parseInt(e.target.value, 10) || 0)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Date début</label>
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Date fin</label>
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => updateField("isActive", e.target.checked)}
          className="rounded border-gray-300"
        />
        Publicité active
      </label>

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
