import { useSession } from "next-auth/react";

export function usePermission(key: string) {
  const { data: session } = useSession();

  return session?.user?.permissions?.some((m: string) => m === key) || false;
}
