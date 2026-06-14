import { useEffect, useState } from "react";
import { createOrder, getPublicServices } from "../services/api";

export default function CreateOrder() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    serviceId: "",
    serviceType: "",
    origin: "",
    destination: "",
    description: "",
    price: "",
    origin_lat: "",
    origin_lng: "",
    destination_lat: "",
    destination_lng: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadServices() {
      const result = await getPublicServices();
      setServices(result.services || []);
    }

    loadServices();
  }, []);

  const handleServiceChange = (e) => {
    const selectedService = services.find(
      (service) => String(service.id) === e.target.value
    );

    setForm({
      ...form,
      serviceId: selectedService?.id || "",
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Tu navegador no soporta geolocalización.");
      return;
    }

    setMessage("Obteniendo ubicación...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setForm((prev) => ({
          ...prev,
          origin: `${lat}, ${lng}`,
          origin_lat: lat,
          origin_lng: lng
        }));

        setMessage("Ubicación obtenida correctamente.");
      },
      () => {
        setMessage("No se pudo obtener la ubicación. Revisa los permisos del navegador.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createOrder({
      origin: form.origin,
      destination: form.destination,
      description: `Servicio: ${form.serviceType}. ${form.description}`,
      price: Number(form.price),

      origin_address: form.origin,
      destination_address: form.destination,

      origin_lat: form.origin_lat || null,
      origin_lng: form.origin_lng || null,
      destination_lat: form.destination_lat || null,
      destination_lng: form.destination_lng || null
    });

    if (result.order) {
      setMessage("Pedido creado correctamente.");

      setForm({
        serviceId: "",
        serviceType: "",
        origin: "",
        destination: "",
        description: "",
        price: "",
        origin_lat: "",
        origin_lng: "",
        destination_lat: "",
        destination_lng: ""
      });
    } else {
      setMessage(result.message || "No se pudo crear el pedido.");
    }
  };

  const previewMapUrl =
    form.origin && form.destination
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
          form.origin
        )}&destination=${encodeURIComponent(form.destination)}`
      : "";

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">
            Solicitar Mandado
          </h1>

          <p className="text-gray-400 mt-3">
            Selecciona el tipo de servicio y el precio se cargará automáticamente.
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
              name="serviceId"
              value={form.serviceId}
              onChange={handleServiceChange}
              required
            >
              <option value="">
                Selecciona el tipo de servicio
              </option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - C$ {service.price}
                </option>
              ))}
            </select>

            <div className="grid gap-2">
              <input
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
                name="origin"
                placeholder="Origen del mandado"
                value={form.origin}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg p-3 font-bold"
              >
                Usar mi ubicación actual
              </button>
            </div>

            <input
              className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="destination"
              placeholder="Destino del mandado"
              value={form.destination}
              onChange={handleChange}
              required
            />

            {previewMapUrl && (
              <a
                href={previewMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-[#222] hover:bg-[#2d2d2d] border border-red-600/30 rounded-lg p-3 font-bold text-red-400"
              >
                Ver ruta antes de enviar
              </a>
            )}

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