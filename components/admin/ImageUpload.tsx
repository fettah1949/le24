"use client";

import { useState } from "react";
import { generateSlug } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'upload");
        return;
      }

      if (!data.url) {
        setError("Réponse serveur invalide");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="label-field">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setError("");
            onChange(e.target.value);
          }}
          placeholder="https://... ou /uploads/image.jpg"
          className="input-field flex-1"
        />
        <label className="btn-secondary cursor-pointer whitespace-nowrap">
          {uploading ? "Upload..." : "Upload"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {value && (
        <img src={value} alt="Preview" className="mt-2 h-20 rounded object-cover" />
      )}
    </div>
  );
}

interface SlugInputProps {
  title: string;
  value: string;
  onChange: (slug: string) => void;
}

export function SlugInput({ title, value, onChange }: SlugInputProps) {
  return (
    <div>
      <label className="label-field">Slug</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={() => onChange(generateSlug(title))}
          className="btn-secondary whitespace-nowrap"
        >
          Auto
        </button>
      </div>
    </div>
  );
}
