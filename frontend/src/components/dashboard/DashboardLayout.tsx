import { Link, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/dashboard/quotations/create", label: "New Quotation", icon: FileText, exact: false },
    { to: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;

    const isActive = (path: string, exact: boolean) => {
        if (exact) return currentPath === path || currentPath === path + "/";
        return currentPath.startsWith(path);
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
                {!collapsed && (
                    <span className="text-lg font-bold text-emerald-400 tracking-tight">
                        Quotation<span className="text-white">System</span>
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <ChevronLeft
                        size={18}
                        className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const active = isActive(item.to, item.exact);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                                    ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
                                }
              `}
                        >
                            <item.icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="px-3 py-4 border-t border-slate-800 space-y-2">
                {!collapsed && user && (
                    <div className="px-3 py-2">
                        <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                )}
                <button
                    onClick={logout}
                    className={`
            flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm
            text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors
          `}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950">
            {/* Desktop Sidebar */}
            <aside
                className={`
          hidden lg:flex flex-col flex-shrink-0
          bg-slate-900 border-r border-slate-800
          transition-all duration-300
          ${collapsed ? "w-[68px]" : "w-64"}
        `}
            >
                {sidebarContent}
            </aside>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-slate-900 border-r border-slate-800
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:hidden
        `}
            >
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar for mobile */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <span className="text-sm font-bold text-emerald-400">
                        Quotation<span className="text-white">System</span>
                    </span>
                </div>

                {/* Scrollable content area */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
