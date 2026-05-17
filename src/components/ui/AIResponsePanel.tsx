"use client";

import { Sparkles, Loader2, AlertCircle, X } from "lucide-react";

interface AIResponsePanelProps {
  response: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function AIResponsePanel({
  response,
  loading,
  error,
  onClose,
}: AIResponsePanelProps) {
  if (!loading && !response && !error) return null;

  return (
    <div className="mt-4 rounded-2xl border border-luxury-gold/20 bg-gradient-to-br from-luxury-gold/[0.04] to-transparent p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-luxury-gold" />
          ) : error ? (
            <AlertCircle className="h-4 w-4 text-red-400" />
          ) : (
            <Sparkles className="h-4 w-4 text-luxury-gold" />
          )}
          <span className="text-sm font-semibold text-luxury-gold">
            {loading
              ? "AI is thinking..."
              : error
              ? "AI Error"
              : "AI Response"}
          </span>
        </div>
        {!loading && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-platinum-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-3 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {response && !loading && (
        <div className="ai-response mt-3 space-y-2 text-sm leading-relaxed text-platinum-300">
          {response.split("\n").map((line, i) => {
            if (!line.trim()) return <br key={i} />;
            if (line.startsWith("### "))
              return (
                <h3 key={i} className="mt-3 text-base font-semibold text-white">
                  {line.replace("### ", "")}
                </h3>
              );
            if (line.startsWith("## "))
              return (
                <h2 key={i} className="mt-4 text-lg font-bold text-white">
                  {line.replace("## ", "")}
                </h2>
              );
            if (line.startsWith("# "))
              return (
                <h1 key={i} className="mt-4 text-xl font-bold text-luxury-gold">
                  {line.replace("# ", "")}
                </h1>
              );
            if (line.startsWith("- ") || line.startsWith("* "))
              return (
                <li key={i} className="ml-4 list-disc text-platinum-300">
                  {formatInlineMarkdown(line.replace(/^[-*] /, ""))}
                </li>
              );
            if (/^\d+\.\s/.test(line))
              return (
                <li key={i} className="ml-4 list-decimal text-platinum-300">
                  {formatInlineMarkdown(line.replace(/^\d+\.\s/, ""))}
                </li>
              );
            return <p key={i}>{formatInlineMarkdown(line)}</p>;
          })}
        </div>
      )}
    </div>
  );
}

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}
