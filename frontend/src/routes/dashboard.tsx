import { useAuthStore } from '@/store/auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" />

  return (
    <div className="text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  )
}
