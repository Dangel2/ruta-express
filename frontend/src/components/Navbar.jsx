import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  function logoutClient() {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    navigate("/");
    window.location.reload();
  }

  function logoutAdmin() {
    localStorage.removeItem("adminToken");
    navigate("/");
    window.location.reload();
  }

  return (
    <nav className="bg-red-600 text-white p-4 shadow">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
        <Link to="/" className="font-bold text-2xl">
          Ruta Express
        </Link>

        <div className="flex flex-wrap gap-4 items-center">
          <Link to="/">Inicio</Link>

          {!token && (
            <>
              <Link to="/register">Registro</Link>
              <Link to="/login">Login</Link>
            </>
          )}

          {token && (
            <>
              <Link to="/profile">Perfil</Link>
              <Link to="/create-order">Crear Pedido</Link>
              <Link to="/my-orders">Mis Pedidos</Link>

              <button
                onClick={logoutClient}
                className="bg-black px-3 py-1 rounded"
              >
                Cerrar sesión
              </button>
            </>
          )}

          {!adminToken && <Link to="/admin">Admin</Link>}

          {adminToken && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>

              <button
                onClick={logoutAdmin}
                className="bg-black px-3 py-1 rounded"
              >
                Salir admin
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}