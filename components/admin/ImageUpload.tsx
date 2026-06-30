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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) onChange(data.url);
    } catch {
      alert("Erreur upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="label-field">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/image.jpg ou URL"
          className="input-field flex-1"
        />
        <label className="btn-secondary cursor-pointer whitespace-nowrap">
          {uploading ? "..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
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
