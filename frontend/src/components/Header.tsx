import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <>
      {/* MAIN NAVBAR */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xl font-bold text-emerald-400 tracking-tight"
            >
              Quotation<span className="text-white">System</span>
            </Link>

            {/* Desktop nav links (public only) */}
            {!user && (
              <nav className="hidden md:flex items-center gap-5 text-sm text-slate-400">
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </nav>
            )}
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="px-4 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
              >
                Logout
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72
          bg-slate-900 border-r border-slate-800
          transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <span className="text-lg font-bold text-emerald-400">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {!user ? (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-red-400 hover:bg-slate-800 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
