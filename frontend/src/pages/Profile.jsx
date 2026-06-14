import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile
} from "../services/api";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const result = await getMyProfile();

      if (result.customer) {
        setForm({
          name: result.customer.name || "",
          phone: result.customer.phone || "",
          email: result.customer.email || ""
        });
      }
    }

    loadProfile();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await updateMyProfile({
      name: form.name,
      phone: form.phone
    });

    if (result.customer) {
      setMessage("Perfil actualizado correctamente.");
      localStorage.setItem("customer", JSON.stringify(result.customer));
    } else {
      setMessage(result.message || "? No se pudo actualizar el perfil.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <section className="max-w-xl mx-auto bg-[#151515] border border-red-600/30 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-red-600 text-center">
          Mi Perfil
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Actualiza tus datos personales de Ruta Express.
        </p>

        {message && (
          <div
            className={`mb-5 p-3 rounded-lg text-center font-medium border ${
              message.includes("?")
                ? "bg-green-600/10 border-green-500 text-green-400"
                : "bg-red-600/10 border-red-500 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">
              Nombre
            </label>
            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 mt-1"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Telefono
            </label>
            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 mt-1"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Correo
            </label>
            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none mt-1 opacity-60 cursor-not-allowed"
              type="email"
              name="email"
              value={form.email}
              disabled
            />
          </div>

          <button
            className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg p-3 font-bold"
            type="submit"
          >
            Guardar Cambios
          </button>
        </form>
      </section>
    </main>
  );
}