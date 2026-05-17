"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink, PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import { Button } from "@/components/ui/Button";
import { Link2, Loader2 } from "lucide-react";

interface PlaidLinkButtonProps {
  userId: string;
  onSuccess: (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => void;
  onExit?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function PlaidLinkButton({
  userId,
  onSuccess,
  onExit,
  className,
  variant = "gold",
  size = "md",
  children,
}: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createLinkToken() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/plaid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create_link_token", userId }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else if (data.link_token) {
          setLinkToken(data.link_token);
        } else {
          setError("Failed to create link token");
        }
      } catch {
        setError("Failed to connect to Plaid");
      } finally {
        setLoading(false);
      }
    }

    createLinkToken();
  }, [userId]);

  const handleSuccess = useCallback(
    (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      onSuccess(publicToken, metadata);
    },
    [onSuccess]
  );

  const handleExit = useCallback(() => {
    onExit?.();
  }, [onExit]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: handleExit,
  });

  if (error) {
    return (
      <Button variant="secondary" size={size} className={className} disabled>
        <Link2 className="h-4 w-4" />
        Plaid Not Configured
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => open()}
      disabled={!ready || loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Link2 className="h-4 w-4" />
      )}
      {children || (loading ? "Connecting..." : "Connect Bank Account")}
    </Button>
  );
}
