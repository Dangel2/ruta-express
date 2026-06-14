import { useState } from "react";
import { createOrder } from "../services/api";

const services = [
  {
    name: "Mandado local en Diriamba",
    price: 50
  },
  {
    name: "Diriamba a Jinotepe",
    price: 100
  },
  {
    name: "Diriamba a Dolores",
    price: 80
  },
  {
    name: "Diriamba a San Marcos",
    price: 100
  },
  {
    name: "Viaje a Managua",
    price: 300
  },
  {
    name: "Trámite sencillo",
    price: 150
  },
  {
    name: "Compra en supermercado o farmacia",
    price: 100
  }
];

export default function CreateOrder() {
  const [form, setForm] = useState({
    serviceType: "",
    origin: "",
    destination: "",
    description: "",
    price: ""
  });

  const [message, setMessage] = useState("");

  const handleServiceChange = (e) => {
    const selectedService = services.find(
      (service) => service.name === e.target.value
    );

    setForm({
      ...form,
      serviceType: selectedService?.name || "",
      price: selectedService?.price || ""
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createOrder({
      origin: form.origin,
      destination: form.destination,
      description: `Servicio: ${form.serviceType}. ${form.description}`,
      price: Number(form.price)
    });

    if (result.order) {
      setMessage("Pedido creado correctamente.");

      setForm({
        serviceType: "",
        origin: "",
        destination: "",
        description: "",
        price: ""
      });
    } else {
      setMessage(result.message || "No se pudo crear el pedido.");
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
            Selecciona el tipo de servicio y el precio se calculará automáticamente.
          </p>
        </div>

        <div className="bg-[#151515] border border-red-600/30 rounded-2xl shadow-xl p-8">
          {message && (
            <div
              className={`mb-5 p-3 rounded-lg text-center font-medium border ${
                message.includes("correctamente")
                  ? "bg-green-600/10 border-green-500 text-green-400"
                  : "bg-red-600/10 border-red-500 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <select
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="serviceType"
              value={form.serviceType}
              onChange={handleServiceChange}
              required
            >
              <option value="">
                Selecciona el tipo de servicio
              </option>

              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name} - C${service.price}
                </option>
              ))}
            </select>

            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="origin"
              placeholder="Origen del mandado"
              value={form.origin}
              onChange={handleChange}
              required
            />

            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="destination"
              placeholder="Destino del mandado"
              value={form.destination}
              onChange={handleChange}
              required
            />

            <textarea
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 min-h-[120px]"
              name="description"
              placeholder="Describe qué necesitas: compra, retiro, entrega, pago o trámite"
              value={form.description}
              onChange={handleChange}
            />

            <div className="bg-black border border-green-600/40 rounded-lg p-4">
              <p className="text-gray-400 text-sm">
                Precio del servicio
              </p>

              <p className="text-2xl font-bold text-green-400">
                {form.price ? `C$ ${form.price}` : "Selecciona un servicio"}
              </p>
            </div>

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