import LandingPage from '@/page/LandingPage'
import { useAuthStore } from '@/store/auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const user = useAuthStore((s) => s.user)

  if (user) return <Navigate to="/dashboard" />
  return (
    <div>
      <LandingPage />
    </div>
  )
}
