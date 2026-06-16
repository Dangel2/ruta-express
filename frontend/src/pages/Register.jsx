import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setMessage("❌ Completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await registerUser(form);

      if (result.customer) {
        setMessage(
          "✅ Cuenta creada correctamente. Redirigiendo a iniciar sesión..."
        );

        setForm({
          name: "",
          phone: "",
          email: "",
          password: ""
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMessage(
          result.message || "❌ Este correo ya está registrado."
        );
      }
    } catch (error) {
      console.error("Error registrando usuario:", error);
      setMessage("❌ Ocurrió un error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md bg-[#151515] border border-red-600/30 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-red-600 text-center">
          Crear cuenta
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Regístrate para solicitar mandados y ver tus pedidos.
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium border ${
              message.toLowerCase().includes("correctamente")
                ? "bg-green-600/10 border-green-500 text-green-400"
                : "bg-red-600/10 border-red-500 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <button
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition rounded-lg p-3 font-bold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
