import { quotationApi } from '@/api/quotation'
import QuotationTable from '@/components/dashboard/QuotationTable'
import StatsCards from '@/components/dashboard/StatsCards'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => quotationApi.stats().then((res) => res.data),
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-white" />
      </div>
    )

  if (error)
    return (
      <p className="text-red-400 p-8">
        Failed to load dashboard stats. Try again.
      </p>
    )

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-6 bg-linear-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
        Dashboard
      </h1>

      <StatsCards stats={data} />


      <div className="mt-10">
        <QuotationTable />
      </div>
    </div>
  )
}
