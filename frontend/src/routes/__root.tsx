import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { ProtectedRoute } from '../components/protectedRoute'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDashboard = pathname.startsWith('/dashboard')

  if (isDashboard) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Outlet />
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
              TanStackQueryDevtools,
            ]}
          />
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <>
      <Header />
      <Outlet />
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          TanStackQueryDevtools,
        ]}
      />
    </>
  )
}
