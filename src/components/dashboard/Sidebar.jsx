import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Visão geral" },
    { href: "/dashboard/clients", label: "Clientes" },
    { href: "/dashboard/tabs", label: "Comandas" },
    { href: "/dashboard/products", label: "Produtos" },
    { href: "/dashboard/appointments", label: "Agendamentos" },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r shadow-sm">
      <div className="p-6 text-2xl font-bold">Painel</div>

      <nav className="px-4 space-y-2">
        {links.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md transition 
                ${active ? "bg-blue-600 text-white" : "hover:bg-gray-200"}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
