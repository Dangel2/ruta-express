import { useState } from "react";
import { createOrder } from "../services/api";

export default function CreateOrder() {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    description: "",
    price: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createOrder({
      ...form,
      price: Number(form.price)
    });

    if (result.order) {
      setMessage("✅ Pedido creado correctamente.");

      setForm({
        origin: "",
        destination: "",
        description: "",
        price: ""
      });
    } else {
      setMessage(result.message || "❌ No se pudo crear el pedido.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">
            Solicitar Mandado
          </h1>

          <p className="text-gray-400 mt-3">
            Completa los datos de tu pedido y Ruta Express se encargará del viaje.
          </p>
        </div>

        <div className="bg-[#151515] border border-red-600/30 rounded-2xl shadow-xl p-8">
          {message && (
            <div
              className={`mb-5 p-3 rounded-lg text-center font-medium border ${
                message.includes("✅")
                  ? "bg-green-600/10 border-green-500 text-green-400"
                  : "bg-red-600/10 border-red-500 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="origin"
              placeholder="Origen del mandado"
              value={form.origin}
              onChange={handleChange}
            />

            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="destination"
              placeholder="Destino del mandado"
              value={form.destination}
              onChange={handleChange}
            />

            <textarea
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 min-h-[120px]"
              name="description"
              placeholder="Describe qué necesitas: compra, retiro, entrega, pago o trámite"
              value={form.description}
              onChange={handleChange}
            />

            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="price"
              type="number"
              placeholder="Precio estimado en C$"
              value={form.price}
              onChange={handleChange}
            />

            <button
              className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg p-3 font-bold mt-2"
              type="submit"
            >
              Enviar Pedido
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}