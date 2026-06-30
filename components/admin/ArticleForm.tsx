"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload, SlugInput } from "./ImageUpload";

interface SelectOption {
  id: string;
  name: string;
}

interface ArticleFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    status: string;
    publishedAt: string;
    categoryId: string;
    authorId: string;
    seoTitle: string;
    seoDescription: string;
    ogImage: string;
    isBreaking: boolean;
    tagIds: string[];
  };
  categories: SelectOption[];
  authors: SelectOption[];
  tags: SelectOption[];
}

export function ArticleForm({
  initialData,
  categories,
  authors,
  tags,
}: ArticleFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    featuredImage: initialData?.featuredImage ?? "",
    status: initialData?.status ?? "DRAFT",
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    categoryId: initialData?.categoryId ?? categories[0]?.id ?? "",
    authorId: initialData?.authorId ?? authors[0]?.id ?? "",
    seoTitle: initialData?.seoTitle ?? "",
    seoDescription: initialData?.seoDescription ?? "",
    ogImage: initialData?.ogImage ?? "",
    isBreaking: initialData?.isBreaking ?? false,
    tagIds: initialData?.tagIds ?? [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleTag(tagId: string) {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit
      ? `/api/articles/${initialData!.id}`
      : "/api/articles";
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

      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label-field">Titre *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="md:col-span-2">
          <SlugInput
            title={form.title}
            value={form.slug}
            onChange={(slug) => updateField("slug", slug)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label-field">Extrait</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={2}
            className="input-field"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label-field">Contenu (HTML) *</label>
          <textarea
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={12}
            className="input-field font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="label-field">Catégorie *</label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className="input-field"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-field">Auteur *</label>
          <select
            value={form.authorId}
            onChange={(e) => updateField("authorId", e.target.value)}
            className="input-field"
            required
          >
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-field">Statut</label>
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="input-field"
          >
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
            <option value="SCHEDULED">Planifié</option>
          </select>
        </div>

        <div>
          <label className="label-field">Date de publication</label>
          <input
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => updateField("publishedAt", e.target.value)}
            className="input-field"
          />
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            label="Image à la une"
            value={form.featuredImage}
            onChange={(url) => updateField("featuredImage", url)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isBreaking}
              onChange={(e) => updateField("isBreaking", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Breaking news</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="label-field">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  form.tagIds.includes(tag.id)
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-2 text-sm font-semibold">SEO</legend>
        <div className="space-y-4 mt-2">
          <div>
            <label className="label-field">SEO Title</label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">SEO Description</label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              rows={2}
              className="input-field"
            />
          </div>
          <ImageUpload
            label="OG Image"
            value={form.ogImage}
            onChange={(url) => updateField("ogImage", url)}
          />
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
