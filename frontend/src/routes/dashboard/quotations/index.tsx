import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/quotations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/dashboard" />
}
