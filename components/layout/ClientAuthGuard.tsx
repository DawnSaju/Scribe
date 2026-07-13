"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Helper to push the router on the client
function RedirectToAuth() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth");
  }, [router]);
  return null;
}

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Only render protected UI if the user is truly authenticated */}
      <Authenticated>{children}</Authenticated>
      
      {/* If the session drops (e.g. logout), unmount UI instantly and redirect */}
      <Unauthenticated>
        <RedirectToAuth />
      </Unauthenticated>
    </>
  );
}
