import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/quotations/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/quotations/$id/"!</div>
}
