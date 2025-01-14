"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;
