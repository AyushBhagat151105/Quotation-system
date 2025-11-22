import { useAuthStore } from "@/store/auth";
import { Navigate } from "@tanstack/react-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((s) => s.user);

    if (!user) return <Navigate to="/login" />;

    return <>{children}</>;
}
