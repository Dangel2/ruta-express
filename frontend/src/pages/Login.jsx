import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await loginUser({
        email,
        password
      });

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("customer", JSON.stringify(result.customer));

        setMessage("✅ Inicio de sesión correcto. Redirigiendo...");

        setTimeout(() => {
          navigate("/");
        }, 700);
      } else {
        setMessage(result.message || "No se pudo iniciar sesión.");
      }
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      setMessage("Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  function getMessageClass() {
    if (message.includes("✅") || message.toLowerCase().includes("correcto")) {
      return "bg-green-600/10 border-green-500 text-green-400";
    }

    return "bg-red-600/10 border-red-500 text-red-400";
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-[#151515] border border-red-600/30 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-red-600 text-center">
          Iniciar sesión
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Entra a tu cuenta para solicitar y revisar tus pedidos.
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium border ${getMessageClass()}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition rounded-lg p-3 font-bold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-red-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}
