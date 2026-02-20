import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { LoginSchemaType } from '@/schemas/auth'
import { LoginDtoSchema } from '@/types/api'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const user = useAuthStore((s) => s.user)

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginDtoSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginNow = async (values: LoginSchemaType) => {
    try {
      await authApi.login(values)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials")
    }
  }

  if (user) return <Navigate to="/dashboard" />

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      <div className="absolute inset-0 bg-linear-to-br from-pink-500/20 via-purple-600/10 to-blue-500/20 blur-3xl" />

      <form
        onSubmit={form.handleSubmit(loginNow)}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl 
          backdrop-blur-2xl bg-white/5 
          border border-white/10 shadow-2xl text-white space-y-4"
      >
        <h1 className="text-4xl font-extrabold text-center 
          bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent
        ">
          Welcome Back
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Login to access your dashboard
        </p>

        <div className="space-y-4">
          <Input
            {...form.register("email")}
            placeholder="Email"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          {form.formState.errors.email && (
            <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
          )}

          <Input
            {...form.register("password")}
            type="password"
            placeholder="Password"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          {form.formState.errors.password && (
            <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
          )}

          <Button
            type="submit"
            className="w-full py-3 text-lg bg-linear-to-r from-pink-500 to-purple-500 hover:opacity-90 transition-all shadow-lg"
          >
            Login
          </Button>
        </div>

        <p className="text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
