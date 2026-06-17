import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyEmail } from "../services/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedEmail =
    location.state?.email ||
    localStorage.getItem("pendingVerificationEmail") ||
    "";

  const [email] = useState(savedEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("❌ No se encontró el correo. Inicia sesión o regístrate nuevamente.");
      return;
    }

    if (!code.trim()) {
      setMessage("❌ Ingresa el código de verificación.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await verifyEmail({
        email,
        code: code.trim()
      });

      setMessage(result.message || "No se pudo verificar el correo.");

      if (result.message === "Correo verificado correctamente") {
        localStorage.removeItem("pendingVerificationEmail");

        setTimeout(() => {
          navigate("/login", {
            state: {
              email
            },
            replace: true
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error verificando correo:", error);
      setMessage("❌ Ocurrió un error al verificar el correo.");
    } finally {
      setLoading(false);
    }
  };

  function getMessageClass() {
    if (message.includes("✅") || message.toLowerCase().includes("correctamente")) {
      return "bg-green-600/10 border-green-500 text-green-400";
    }

    return "bg-red-600/10 border-red-500 text-red-400";
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-[#151515] p-8 rounded-2xl border border-red-600/30 shadow-xl">
        <h1 className="text-3xl font-bold text-red-600 text-center">
          Verificar correo
        </h1>

        <p className="text-center text-gray-400 mt-2 mb-6">
          Hemos enviado un código de verificación a tu correo electrónico.
          Ingresa el código para activar tu cuenta.
        </p>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center font-medium border ${getMessageClass()}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-gray-700 outline-none focus:border-red-600 text-center tracking-[0.35em] font-bold"
            autoComplete="one-time-code"
            maxLength={6}
            required
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed p-3 rounded-lg font-bold transition"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿Ya verificaste tu cuenta?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
