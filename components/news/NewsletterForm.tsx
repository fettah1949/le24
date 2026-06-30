"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className }: NewsletterFormProps) {
  const { dict } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Error");
        return;
      }

      setStatus("success");
      setMessage(dict.newsletter.success);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Error");
    }
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-bold text-white">{dict.newsletter.title}</h3>
      <p className="mt-1 text-sm text-white/70">{dict.newsletter.description}</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.newsletter.placeholder}
          required
          className="flex-1 rounded-md border-0 px-4 py-2 text-sm text-news-text placeholder:text-news-muted focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-white/90 disabled:opacity-50"
        >
          {status === "loading" ? dict.newsletter.loading : dict.newsletter.subscribe}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "success" ? "text-green-300" : "text-red-300"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
