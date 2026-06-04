"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DeployRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground font-sans gap-3">
      <Loader2 className="animate-spin size-8 text-primary" />
      <p className="text-sm text-muted-foreground font-mono">Redirecting to Dashboard...</p>
    </div>
  );
}
