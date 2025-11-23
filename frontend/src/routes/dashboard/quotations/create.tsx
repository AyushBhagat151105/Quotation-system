import CreateQuotationForm from '@/components/dashboard/CreateQuotationForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/quotations/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Create Quotation</h1>
      <CreateQuotationForm />
    </div>
  )
}
