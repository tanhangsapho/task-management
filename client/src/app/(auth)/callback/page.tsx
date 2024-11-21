"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const from = searchParams.get("from") || "/board";
  useEffect(() => {
    setMounted(true);
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) return;

      try {
        const provider = state?.includes("github") ? "github" : "google";
        await authAPI.handleAuthCallback(provider, code);
        if (mounted) {
          router.replace(from);
        }
      } catch (error) {
        console.error("Authentication callback failed:", error);
        router.push("/login?error=callback_failed");
      }
    };

    if (mounted) {
      handleCallback();
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
