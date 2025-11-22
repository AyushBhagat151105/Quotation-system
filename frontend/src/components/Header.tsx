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
      <header
        className="
          backdrop-blur-xl bg-white/10 dark:bg-black/10
          border-b border-white/10
          shadow-[0_0_20px_rgba(255,0,128,0.2)]
          sticky top-0 z-50
        "
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="
                p-2 rounded-lg text-pink-300 hover:bg-white/10
                transition-all duration-200
              "
            >
              <Menu size={24} />
            </button>

            <Link
              to="/"
              className="
                text-xl font-semibold
                bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent
              "
            >
              Quotation System
            </Link>
          </div>

          {/* Right Section */}
          <div>
            {!user ? (
              <Link
                to="/login"
                className="
                  px-4 py-1.5 rounded-lg
                  bg-linear-to-r from-pink-500 to-purple-500
                  text-white shadow-md hover:opacity-90
                  transition-all duration-200
                "
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="
                  px-4 py-1.5 rounded-lg
                  bg-linear-to-r from-red-500 to-red-700
                  text-white shadow-md hover:opacity-90
                "
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SIDE DRAWER */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-80
          backdrop-blur-2xl bg-black/40
          border-r border-white/10
          transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2
            className="
              text-xl font-bold
              bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent
            "
          >
            Navigation
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-pink-300 hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 p-4 space-y-4 text-white">
          {!user && (
            <>
              <Link
                to="/"
                className="block text-lg hover:text-pink-400 transition-colors"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="block text-lg hover:text-purple-400"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block text-lg hover:text-blue-400"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/dashboard"
                className="block text-lg hover:text-pink-400"
              >
                Dashboard
              </Link>

              <Link
                to="/quotations"
                className="block text-lg hover:text-purple-400"
              >
                Quotations
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="block text-left w-full text-lg hover:text-red-400"
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
