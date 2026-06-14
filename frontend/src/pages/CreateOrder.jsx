import { useEffect, useState } from "react";
import { createOrder, getPublicServices } from "../services/api";

/*
  Puedes modificar este valor más adelante.
  Actualmente la tarifa por distancia es de C$10 por kilómetro.
*/
const PRICE_PER_KM = 10;

export default function CreateOrder() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [originLocationSelected, setOriginLocationSelected] = useState(false);

  const initialForm = {
    serviceId: "",
    serviceType: "",
    origin: "",
    destination: "",
    description: "",

    basePrice: "",
    price: "",

    price_type: "fixed",
    distance_km: "",

    origin_lat: "",
    origin_lng: "",
    destination_lat: "",
    destination_lng: ""
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    async function loadServices() {
      try {
        const result = await getPublicServices();
        setServices(result.services || []);
      } catch (error) {
        console.error("Error cargando servicios:", error);
        setMessage("No se pudieron cargar los servicios.");
      }
    }

    loadServices();
  }, []);

  function calculateDistancePrice(distance, basePrice) {
    const kilometers = Number(distance) || 0;
    const minimumPrice = Number(basePrice) || 0;
    const calculatedPrice = kilometers * PRICE_PER_KM;

    /*
      El precio por distancia nunca será menor
      que el precio fijo del servicio seleccionado.
    */
    return Math.max(calculatedPrice, minimumPrice);
  }

  function handleServiceChange(e) {
    const selectedService = services.find(
      (service) => String(service.id) === e.target.value
    );

    if (!selectedService) {
      setForm((previousForm) => ({
        ...previousForm,
        serviceId: "",
        serviceType: "",
        basePrice: "",
        price: ""
      }));

      return;
    }

    const servicePrice = Number(selectedService.price) || 0;

    setForm((previousForm) => ({
      ...previousForm,
      serviceId: selectedService.id,
      serviceType: selectedService.name,
      basePrice: servicePrice,

      price:
        previousForm.price_type === "distance"
          ? calculateDistancePrice(
              previousForm.distance_km,
              servicePrice
            )
          : servicePrice
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "origin") {
      setOriginLocationSelected(false);

      setForm((previousForm) => ({
        ...previousForm,
        origin: value,
        origin_lat: "",
        origin_lng: ""
      }));

      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  }

  function handlePriceTypeChange(e) {
    const selectedPriceType = e.target.value;

    setForm((previousForm) => {
      const updatedPrice =
        selectedPriceType === "distance"
          ? calculateDistancePrice(
              previousForm.distance_km,
              previousForm.basePrice
            )
          : Number(previousForm.basePrice) || 0;

      return {
        ...previousForm,
        price_type: selectedPriceType,
        price: updatedPrice
      };
    });

    setMessage("");
  }

  function handleDistanceChange(e) {
    const distance = e.target.value;

    if (distance !== "" && Number(distance) < 0) {
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      distance_km: distance,
      price: calculateDistancePrice(
        distance,
        previousForm.basePrice
      )
    }));
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Tu navegador no permite obtener la ubicación.");
      return;
    }

    setMessage("Obteniendo tu ubicación actual...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setForm((previousForm) => ({
          ...previousForm,
          origin: "Ubicación actual seleccionada",
          origin_lat: latitude,
          origin_lng: longitude
        }));

        setOriginLocationSelected(true);
        setMessage("Ubicación actual seleccionada correctamente.");
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);

        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            "Debes permitir el acceso a la ubicación desde el navegador."
          );
          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          setMessage("Tu ubicación no está disponible actualmente.");
          return;
        }

        if (error.code === error.TIMEOUT) {
          setMessage(
            "La ubicación tardó demasiado. Intenta nuevamente."
          );
          return;
        }

        setMessage("No se pudo obtener tu ubicación actual.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  function getOriginForMap() {
    if (form.origin_lat && form.origin_lng) {
      return `${form.origin_lat},${form.origin_lng}`;
    }

    return form.origin;
  }

  function getDestinationForMap() {
    if (form.destination_lat && form.destination_lng) {
      return `${form.destination_lat},${form.destination_lng}`;
    }

    return form.destination;
  }

  const previewMapUrl =
    getOriginForMap() && getDestinationForMap()
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
          getOriginForMap()
        )}&destination=${encodeURIComponent(getDestinationForMap())}`
      : "";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.serviceId) {
      setMessage("Selecciona un tipo de servicio.");
      return;
    }

    if (!form.origin || !form.destination) {
      setMessage("El Punto A y el Punto B son obligatorios.");
      return;
    }

    if (
      form.price_type === "distance" &&
      (!form.distance_km || Number(form.distance_km) <= 0)
    ) {
      setMessage(
        "Ingresa la distancia estimada en kilómetros."
      );
      return;
    }

    const finalPrice =
      form.price_type === "distance"
        ? calculateDistancePrice(
            form.distance_km,
            form.basePrice
          )
        : Number(form.basePrice) || 0;

    try {
      setLoading(true);
      setMessage("");

      const result = await createOrder({
        origin: form.origin,
        destination: form.destination,

        description: `Servicio: ${form.serviceType}. ${
          form.description || "Sin descripción adicional."
        }`,

        price: finalPrice,

        origin_address: form.origin,
        destination_address: form.destination,

        origin_lat: form.origin_lat || null,
        origin_lng: form.origin_lng || null,

        destination_lat: form.destination_lat || null,
        destination_lng: form.destination_lng || null,

        price_type: form.price_type,
        distance_km:
          form.price_type === "distance"
            ? Number(form.distance_km)
            : 0
      });

      if (result.order) {
        setMessage("Pedido creado correctamente.");
        setForm(initialForm);
        setOriginLocationSelected(false);
      } else {
        setMessage(
          result.message || "No se pudo crear el pedido."
        );
      }
    } catch (error) {
      console.error("Error creando pedido:", error);
      setMessage("Ocurrió un error al crear el pedido.");
    } finally {
      setLoading(false);
    }
  }

  const hasSelectedService = Boolean(form.serviceId);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">
            Solicitar Mandado
          </h1>

          <p className="text-gray-400 mt-3">
            Selecciona el servicio, los puntos de la ruta y el
            tipo de tarifa.
          </p>
        </div>

        <div className="bg-[#151515] border border-red-600/30 rounded-2xl shadow-xl p-6 md:p-8">
          {message && (
            <div
              className={`mb-5 p-3 rounded-lg text-center font-medium border ${
                message.includes("correctamente")
                  ? "bg-green-600/10 border-green-500 text-green-400"
                  : message.includes("Obteniendo")
                    ? "bg-blue-600/10 border-blue-500 text-blue-400"
                    : "bg-red-600/10 border-red-500 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label
                htmlFor="serviceId"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Tipo de servicio
              </label>

              <select
                id="serviceId"
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
            </div>

            <div>
              <label
                htmlFor="price_type"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Tipo de tarifa
              </label>

              <select
                id="price_type"
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
                name="price_type"
                value={form.price_type}
                onChange={handlePriceTypeChange}
                disabled={!hasSelectedService}
              >
                <option value="fixed">
                  Tarifa fija del servicio
                </option>

                <option value="distance">
                  Calcular tarifa por distancia
                </option>
              </select>

              {!hasSelectedService && (
                <p className="text-gray-500 text-sm mt-2">
                  Primero selecciona un servicio.
                </p>
              )}
            </div>

            {form.price_type === "distance" && (
              <div className="bg-black border border-blue-600/40 rounded-xl p-4">
                <label
                  htmlFor="distance_km"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Distancia estimada en kilómetros
                </label>

                <input
                  id="distance_km"
                  className="w-full bg-[#101010] border border-gray-700 rounded-lg p-3 outline-none focus:border-blue-600"
                  name="distance_km"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="Ejemplo: 12.5"
                  value={form.distance_km}
                  onChange={handleDistanceChange}
                  required
                />

                <div className="mt-3 text-sm text-gray-400">
                  <p>
                    Tarifa por kilómetro:{" "}
                    <span className="font-bold text-blue-400">
                      C$ {PRICE_PER_KM}
                    </span>
                  </p>

                  <p>
                    Tarifa mínima del servicio:{" "}
                    <span className="font-bold text-green-400">
                      C$ {Number(form.basePrice) || 0}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="origin"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Punto A
              </label>

              <p className="text-gray-500 text-sm mb-2">
                Lugar donde se realizará la compra, retiro, pago o
                mandado.
              </p>

              <input
                id="origin"
                className={`w-full bg-black border rounded-lg p-3 outline-none focus:border-red-600 ${
                  originLocationSelected
                    ? "border-green-500 text-green-400"
                    : "border-gray-700"
                }`}
                name="origin"
                placeholder="Ejemplo: Mercado Municipal de Diriamba"
                value={form.origin}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg p-3 font-bold"
              >
                Usar mi ubicación actual como Punto A
              </button>

              {originLocationSelected && (
                <p className="text-green-400 text-sm mt-2">
                  La ubicación fue guardada sin mostrar las
                  coordenadas.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Punto B
              </label>

              <p className="text-gray-500 text-sm mb-2">
                Lugar donde se entregará el pedido o terminará el
                servicio.
              </p>

              <input
                id="destination"
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
                name="destination"
                placeholder="Ejemplo: Barrio Santa Ana, casa del cliente"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </div>

            {previewMapUrl && (
              <a
                href={previewMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-[#222] hover:bg-[#2d2d2d] border border-red-600/30 rounded-lg p-3 font-bold text-red-400"
              >
                Ver ruta Punto A → Punto B
              </a>
            )}

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Descripción del mandado
              </label>

              <textarea
                id="description"
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 min-h-[120px]"
                name="description"
                placeholder="Describe qué necesitas: compra, retiro, entrega, pago o trámite"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="bg-black border border-green-600/40 rounded-lg p-4">
              <p className="text-gray-400 text-sm">
                Tipo de tarifa
              </p>

              <p className="font-bold text-white mb-3">
                {form.price_type === "distance"
                  ? "Tarifa calculada por distancia"
                  : "Tarifa fija del servicio"}
              </p>

              <p className="text-gray-400 text-sm">
                Precio estimado
              </p>

              <p className="text-3xl font-bold text-green-400">
                {hasSelectedService
                  ? `C$ ${Number(form.price || 0).toFixed(2)}`
                  : "Selecciona un servicio"}
              </p>

              {form.price_type === "distance" &&
                Number(form.distance_km) > 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    {form.distance_km} km × C$ {PRICE_PER_KM} por
                    kilómetro
                  </p>
                )}
            </div>

            <button
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition rounded-lg p-3 font-bold mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Enviando pedido..." : "Enviar Pedido"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}