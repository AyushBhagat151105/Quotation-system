import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quotations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/quotations/"!</div>
}
