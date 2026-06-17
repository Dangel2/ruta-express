import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  const customerData = localStorage.getItem("customer");
  const customer = customerData ? JSON.parse(customerData) : null;

  const customerName =
    customer?.name?.split(" ")[0] ||
    customer?.email?.split("@")[0] ||
    "Cliente";

  function closeMenu() {
    setMenuOpen(false);
  }

  function logoutClient() {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    closeMenu();
    navigate("/");
    window.location.reload();
  }

  function logoutAdmin() {
    localStorage.removeItem("adminToken");
    closeMenu();
    navigate("/");
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur border-b border-red-600/20 text-white">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-red-600 border border-red-400/40 flex items-center justify-center shadow-lg shadow-red-950/30 group-hover:scale-105 transition shrink-0">
              <span className="text-white font-extrabold text-lg md:text-xl">
                RX
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-lg md:text-xl font-extrabold leading-none truncate">
                Ruta <span className="text-red-500">Express</span>
              </p>

              <p className="hidden sm:block text-xs text-gray-400 mt-1">
                Mandados • Delivery • Envíos
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            {token && (
              <div className="hidden sm:flex items-center gap-3 bg-[#151515] border border-gray-800 rounded-2xl px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 font-bold">
                  {customerName.charAt(0).toUpperCase()}
                </div>

                <div className="leading-tight">
                  <p className="text-xs text-gray-500">Sesión activa</p>
                  <p className="text-sm font-bold text-white">
                    {customerName}
                  </p>
                </div>
              </div>
            )}

            {!token && (
              <>
                <Link
                  to="/login"
                  className="bg-red-600 hover:bg-red-700 px-3 md:px-4 py-2 rounded-xl font-bold text-sm md:text-base transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hidden sm:inline-flex bg-[#151515] hover:bg-[#202020] border border-gray-700 px-3 md:px-4 py-2 rounded-xl font-bold text-sm md:text-base transition"
                >
                  Registro
                </Link>
              </>
            )}

            {token && (
              <button
                onClick={logoutClient}
                className="bg-red-600 hover:bg-red-700 px-3 md:px-4 py-2 rounded-xl font-bold text-sm md:text-base transition"
              >
                Salir
              </button>
            )}

            {adminToken && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="bg-[#151515] hover:bg-[#202020] border border-gray-700 px-3 md:px-4 py-2 rounded-xl font-bold text-sm md:text-base transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logoutAdmin}
                  className="bg-red-600 hover:bg-red-700 px-3 md:px-4 py-2 rounded-xl font-bold text-sm md:text-base transition"
                >
                  Salir admin
                </button>
              </>
            )}

            {!adminToken && (
              <Link
                to="/admin"
                className="hidden md:inline-flex text-gray-400 hover:text-red-400 text-sm font-semibold transition"
              >
                Admin
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="w-11 h-11 rounded-xl bg-[#151515] hover:bg-[#202020] border border-gray-800 flex items-center justify-center text-2xl font-bold transition"
              aria-label="Abrir menú"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-4 bg-[#101010] border border-red-600/20 rounded-3xl p-5 shadow-2xl shadow-red-950/20">
            {token && (
              <div className="sm:hidden mb-5 bg-[#151515] border border-gray-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 font-bold text-lg">
                  {customerName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-xs text-gray-500">Bienvenido</p>
                  <p className="font-bold text-white">{customerName}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-gray-300 font-semibold">
              <Link
                to="/"
                onClick={closeMenu}
                className="bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
              >
                Inicio
              </Link>

              <a
                href="/#servicios"
                onClick={closeMenu}
                className="bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
              >
                Servicios
              </a>

              <a
                href="/#tarifas"
                onClick={closeMenu}
                className="bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
              >
                Tarifas
              </a>

              <a
                href="/#cobertura"
                onClick={closeMenu}
                className="bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
              >
                Cobertura
              </a>

              {token && (
                <>
                  <Link
                    to="/create-order"
                    onClick={closeMenu}
                    className="bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
                  >
                    Crear Pedido
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={closeMenu}
                    className="bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
                  >
                    Mis Pedidos
                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
                  >
                    Perfil
                  </Link>
                </>
              )}

              {!token && (
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="sm:hidden bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
                >
                  Registro
                </Link>
              )}

              {!adminToken && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="md:hidden bg-[#151515] hover:bg-red-600/10 border border-gray-800 hover:border-red-600/40 rounded-2xl p-4 transition"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}