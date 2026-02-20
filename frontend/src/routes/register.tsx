import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RegisterSchema, type RegisterSchemaType } from '@/schemas/auth'
import { useAuthStore } from '@/store/auth'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const user = useAuthStore((s) => s.user)

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const registerNow = async (values: RegisterSchemaType) => {
    try {
      await authApi.register(values)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed")
    }
  }

  if (user) return <Navigate to="/dashboard" />

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full" />

      <form
        onSubmit={form.handleSubmit(registerNow)}
        className="relative z-10 w-full max-w-md p-8 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">
            Get started with free quotation management
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <Input
              {...form.register("name")}
              placeholder="John Doe"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            {form.formState.errors.name && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="you@example.com"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            {form.formState.errors.email && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <Input
              {...form.register("password")}
              type="password"
              placeholder="••••••••"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            {form.formState.errors.password && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            Create Account
          </Button>
        </div>

        {/* Footer link */}
        <p className="text-center text-slate-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
