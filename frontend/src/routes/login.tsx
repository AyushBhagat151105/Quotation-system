import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useAuthStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/dashboard" />;

  const loginNow = async () => {
    try {
      await authApi.login({ email, password });
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-linear-to-br from-pink-500/20 via-purple-600/10 to-blue-500/20 blur-3xl" />

      {/* Auth card */}
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-2xl 
        backdrop-blur-2xl bg-white/5 
        border border-white/10 shadow-2xl text-white"
      >
        <h1 className="text-4xl font-extrabold text-center 
          bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent
        ">
          Welcome Back
        </h1>

        <p className="text-center text-gray-300 mt-2 mb-6">
          Login to access your dashboard
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Email"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="
              w-full py-3 text-lg
              bg-linear-to-r from-pink-500 to-purple-500
              hover:opacity-90 transition-all shadow-lg
            "
            onClick={loginNow}
          >
            Login
          </Button>
        </div>

        <p className="text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <span className="text-pink-400 hover:underline cursor-pointer">
            <Link to="/register">Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
