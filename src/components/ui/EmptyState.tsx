"use client";

import { motion } from "framer-motion";
import { Link2, type LucideIcon } from "lucide-react";
import { Button } from "./Button";
import { useMounted } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  const mounted = useMounted();

  const content = (
    <motion.div
      initial={mounted ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-luxury-gold/10">
        <Icon className="h-7 w-7 text-luxury-gold" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-platinum-400">{description}</p>
      {actionLabel && (
        <div className="mt-5">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="gold" size="md">
                <Link2 className="h-4 w-4" />
                {actionLabel}
              </Button>
            </Link>
          ) : onAction ? (
            <Button variant="gold" size="md" onClick={onAction}>
              <Link2 className="h-4 w-4" />
              {actionLabel}
            </Button>
          ) : null}
        </div>
      )}
    </motion.div>
  );

  return content;
}
