"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [folders, setFolders] = useState({
    bar: false,
    studio: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studio_unlocked");
      if (saved === "true") setUnlocked(true);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleFolder = (folderName) => {
    setFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const handleAgendaClick = (e) => {
    e.preventDefault();
    if (unlocked) {
      router.push("/agenda");
      return;
    }
    setShowPasswordModal(true);
    setPasswordError("");
  };

  const submitPassword = (e) => {
    e.preventDefault();
    if (password === "studiolagunas") {
      try {
        localStorage.setItem("studio_unlocked", "true");
      } catch (err) {}
      setUnlocked(true);
      setShowPasswordModal(false);
      setPassword("");
      setPasswordError("");
      router.push("/agenda");
    } else {
      setPasswordError("Senha incorreta");
      setPassword("");
    }
  };

  const FolderButton = ({ name, label, children }) => (
    <div>
      <button
        onClick={() => toggleFolder(name)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100 transition text-left font-medium"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${folders[name] ? "rotate-180" : ""}`}
        />
      </button>
      {folders[name] && <div className="pl-6 space-y-1 mt-1">{children}</div>}
    </div>
  );

  const NavLink = ({ href, label, isLocked = false }) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={isLocked ? "#" : href}
        onClick={(e) => isLocked && handleAgendaClick(e)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        {isLocked && <Lock className="h-3 w-3" />}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm p-4 overflow-y-auto">
      <div className="text-2xl font-bold mb-6">Painel</div>

      <nav className="space-y-2">
        <NavLink href="/dashboard" label="Visão geral" />
        <NavLink href="/dashboard/clients" label="Clientes" />

        {/* Bar Folder */}
        <FolderButton name="bar" label="🍷 Bar">
          <NavLink href="/comandas" label="Comandas" />
          <NavLink href="/cardapio" label="Cardápio" />
        </FolderButton>

        <NavLink href="/dashboard/products" label="Produtos" />

        {/* Studio Folder */}
        <FolderButton name="studio" label="🎨 Studio">
          <NavLink
            href="/agenda"
            label={`${unlocked ? "" : "🔒 "}Agenda`}
            isLocked={!unlocked}
          />
        </FolderButton>
      </nav>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Acesso ao Studio</h2>
            <p className="text-gray-600 text-sm mb-4">
              Digite a senha para acessar a Agenda
            </p>

            <form onSubmit={submitPassword}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Senha"
                className={`w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-600 text-sm mb-4">{passwordError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                    setPasswordError("");
                  }}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
