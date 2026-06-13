import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-red-600 text-white p-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-2xl">
          Ruta Express
        </h1>

        <div className="flex gap-4">
          <Link to="/">Inicio</Link>

          <Link to="/register">
            Registro
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/create-order">
            Crear Pedido
          </Link>

          <Link to="/my-orders">
            Mis Pedidos
          </Link>

          <Link to="/admin">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}