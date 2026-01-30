"use client";

import { useState, useEffect, type ReactNode } from "react";

const isMockEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

interface MSWProviderProps {
  children: ReactNode;
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [ready, setReady] = useState(!isMockEnabled);

  useEffect(() => {
    if (!isMockEnabled) {
      setReady(true);
      return;
    }

    async function startWorker() {
      const { worker } = await import("@/mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
        quiet: false,
      });
      setReady(true);
    }

    startWorker();
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        MSW 준비 중…
      </div>
    );
  }

  return <>{children}</>;
}
