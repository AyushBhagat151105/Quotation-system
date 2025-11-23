import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quotation-public/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/quotation-public/$id"!</div>
}
