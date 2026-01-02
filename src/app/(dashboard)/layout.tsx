'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, UtensilsCrossed, Menu, X, Home, Settings, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Agenda", icon: Calendar, href: "/agenda" },
    { name: "Comandas", icon: UtensilsCrossed, href: "/comandas" },
    { name: "Cozinha", icon: ChefHat, href: "/cozinha" },
    { name: "Cardápio", icon: Settings, href: "/cardapio" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#151515] border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="text-[#ff6b35] font-bold text-lg neon-text-orange">BG LAGUNAS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-[#2a2a2a]"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#151515] border-r border-[#2a2a2a] z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[#2a2a2a] hidden lg:flex items-center gap-3">
          <div>
            <h1 className="text-[#ff6b35] font-bold text-xl neon-text-orange">BG LAGUNAS</h1>
            <p className="text-[#00d4ff] text-xs neon-text-cyan">DRINKS - TATTOO - BAR</p>
          </div>
        </div>

        <nav className="p-4 mt-16 lg:mt-0">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-[#00d4ff]/10 text-[#00d4ff] neon-glow-cyan' 
                        : 'text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-white'
                      }
                    `}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#00d4ff]' : ''}`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 lg:pl-6 pt-20 lg:pt-0 min-h-screen p-4 lg:p-6">
        <div className="max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
