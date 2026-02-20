import { quotationApi } from '@/api/quotation'
import QuotationTable from '@/components/dashboard/QuotationTable'
import StatsCards from '@/components/dashboard/StatsCards'
import { useAuthStore } from '@/store/auth'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useAuthStore((s) => s.user)

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => quotationApi.stats().then((res) => res.data),
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
      </div>
    )

  if (error)
    return (
      <p className="text-red-400 p-8">
        Failed to load dashboard stats. Try again.
      </p>
    )

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here's an overview of your quotation activity.
        </p>
      </div>

      <StatsCards stats={data} />

      <div className="mt-8">
        <QuotationTable />
      </div>
    </div>
  )
}
