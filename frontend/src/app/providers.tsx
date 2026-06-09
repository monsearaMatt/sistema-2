"use client";

/**
 * providers.tsx
 *
 * Envuelve la aplicación con los proveedores necesarios.
 * Debe importarse en app/layout.tsx y envolver el {children}.
 *
 * En Next.js App Router, los providers que usan hooks deben estar
 * en un Client Component separado — no pueden ir directamente
 * en layout.tsx porque ese archivo es un Server Component.
 */

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {

            staleTime: 1000 * 60, 
            retry: (failureCount, error: any) => {
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}