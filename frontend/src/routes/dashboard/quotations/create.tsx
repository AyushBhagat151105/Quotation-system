import CreateQuotationForm from '@/components/dashboard/CreateQuotationForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/quotations/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Create Quotation</h1>
      <CreateQuotationForm />
    </div>
  )
}
