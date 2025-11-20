import LoginPage from '@/components/LoginPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <LoginPage />
    </div>
  )
}
