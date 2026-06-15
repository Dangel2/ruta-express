import { useEffect, useState } from "react";
import { createOrder, getPublicServices } from "../services/api";

const initialForm = {
  serviceId: "",
  serviceType: "",

  origin: "",
  destination: "",
  description: "",

  basePrice: "",
  price: "",

  price_type: "fixed",
  price_per_km: "",
  distance_km: "",

  origin_lat: "",
  origin_lng: "",
  destination_lat: "",
  destination_lng: ""
};

export default function CreateOrder() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [originLocationSelected, setOriginLocationSelected] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        setServicesLoading(true);

        const result = await getPublicServices();

        if (result.services) {
          setServices(result.services);
          setMessage("");
        } else {
          setServices([]);
          setMessage(
            result.message || "No se pudieron cargar los servicios."
          );
        }
      } catch (error) {
        console.error("Error cargando servicios:", error);
        setMessage("No se pudieron cargar los servicios.");
      } finally {
        setServicesLoading(false);
      }
    }

    loadServices();
  }, []);

  function normalizePriceType(priceType) {
    return priceType === "distance" ? "distance" : "fixed";
  }

  function calculateDistanceSubtotal(distance, pricePerKm) {
    const kilometers = Number(distance) || 0;
    const ratePerKm = Number(pricePerKm) || 0;

    return kilometers * ratePerKm;
  }

  function calculateFinalDistancePrice(distance, basePrice, pricePerKm) {
    const minimumPrice = Number(basePrice) || 0;

    const distanceSubtotal = calculateDistanceSubtotal(
      distance,
      pricePerKm
    );

    return Math.max(distanceSubtotal, minimumPrice);
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
        price: "",
        price_type: "fixed",
        price_per_km: "",
        distance_km: ""
      }));

      return;
    }

    const servicePriceType = normalizePriceType(selectedService.price_type);
    const serviceBasePrice = Number(selectedService.price) || 0;
    const servicePricePerKm = Number(selectedService.price_per_km) || 0;

    setForm((previousForm) => ({
      ...previousForm,

      serviceId: selectedService.id,
      serviceType: selectedService.name,

      basePrice: serviceBasePrice,
      price: serviceBasePrice,

      price_type: servicePriceType,
      price_per_km: servicePricePerKm,
      distance_km: ""
    }));

    if (servicePriceType === "fixed") {
      setMessage(
        `Este servicio utiliza una tarifa fija de C$ ${serviceBasePrice.toFixed(
          2
        )}.`
      );
    } else {
      setMessage(
        `Este servicio utiliza tarifa por distancia: C$ ${servicePricePerKm.toFixed(
          2
        )} por kilómetro.`
      );
    }
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

    if (name === "destination") {
      setForm((previousForm) => ({
        ...previousForm,
        destination: value,
        destination_lat: "",
        destination_lng: ""
      }));

      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  }

  function handleDistanceChange(e) {
    const distance = e.target.value;

    if (distance !== "" && Number(distance) < 0) {
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      distance_km: distance,
      price: calculateFinalDistancePrice(
        distance,
        previousForm.basePrice,
        previousForm.price_per_km
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
          setMessage("La ubicación tardó demasiado. Intenta nuevamente.");
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

  const originForMap = getOriginForMap();
  const destinationForMap = getDestinationForMap();

  const previewMapUrl =
    originForMap && destinationForMap
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
          originForMap
        )}&destination=${encodeURIComponent(destinationForMap)}`
      : "";

  const hasSelectedService = Boolean(form.serviceId);
  const isDistanceService = form.price_type === "distance";

  const distanceSubtotal = calculateDistanceSubtotal(
    form.distance_km,
    form.price_per_km
  );

  const minimumPrice = Number(form.basePrice) || 0;

  const finalPrice = isDistanceService
    ? calculateFinalDistancePrice(
        form.distance_km,
        form.basePrice,
        form.price_per_km
      )
    : minimumPrice;

  const isMinimumPriceApplied =
    isDistanceService &&
    Number(form.distance_km) > 0 &&
    distanceSubtotal < minimumPrice;

  function validateOrderBeforeConfirm() {
    if (!form.serviceId) {
      setMessage("Selecciona un tipo de servicio.");
      return false;
    }

    if (!form.origin || !form.destination) {
      setMessage("El Punto A y el Punto B son obligatorios.");
      return false;
    }

    if (isDistanceService && Number(form.price_per_km) <= 0) {
      setMessage(
        "Este servicio no tiene configurado correctamente el precio por kilómetro."
      );
      return false;
    }

    if (
      isDistanceService &&
      (!form.distance_km || Number(form.distance_km) <= 0)
    ) {
      setMessage("Ingresa la distancia estimada en kilómetros.");
      return false;
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateOrderBeforeConfirm()) {
      return;
    }

    setMessage("");
    setShowConfirmModal(true);
  }

  async function confirmCreateOrder() {
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

        distance_km: isDistanceService ? Number(form.distance_km) : 0
      });

      if (result.order) {
        setMessage("Pedido creado correctamente.");
        setForm(initialForm);
        setOriginLocationSelected(false);
        setShowConfirmModal(false);
      } else {
        setMessage(result.message || "No se pudo crear el pedido.");
      }
    } catch (error) {
      console.error("Error creando pedido:", error);
      setMessage("Ocurrió un error al crear el pedido.");
    } finally {
      setLoading(false);
    }
  }

  function closeConfirmModal() {
    if (loading) return;
    setShowConfirmModal(false);
  }

  function getMessageClass() {
    if (message.includes("correctamente")) {
      return "bg-green-600/10 border-green-500 text-green-400";
    }

    if (message.includes("Obteniendo") || message.includes("utiliza")) {
      return "bg-blue-600/10 border-blue-500 text-blue-400";
    }

    return "bg-red-600/10 border-red-500 text-red-400";
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">
            Solicitar Mandado
          </h1>

          <p className="text-gray-400 mt-3">
            Selecciona un servicio y el tipo de tarifa se aplicará
            automáticamente.
          </p>
        </div>

        <div className="bg-[#151515] border border-red-600/30 rounded-2xl shadow-xl p-6 md:p-8">
          {message && (
            <div
              className={`mb-5 p-3 rounded-lg text-center font-medium border ${getMessageClass()}`}
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
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 disabled:opacity-60"
                name="serviceId"
                value={form.serviceId}
                onChange={handleServiceChange}
                disabled={servicesLoading}
                required
              >
                <option value="">
                  {servicesLoading
                    ? "Cargando servicios..."
                    : "Selecciona el tipo de servicio"}
                </option>

                {services.map((service) => {
                  const servicePriceType = normalizePriceType(service.price_type);
                  const servicePrice = Number(service.price) || 0;
                  const servicePricePerKm = Number(service.price_per_km) || 0;

                  return (
                    <option key={service.id} value={service.id}>
                      {servicePriceType === "distance"
                        ? `${service.name} - Desde C$ ${servicePrice.toFixed(
                            2
                          )} / C$ ${servicePricePerKm.toFixed(2)} por km`
                        : `${service.name} - C$ ${servicePrice.toFixed(2)}`}
                    </option>
                  );
                })}
              </select>
            </div>

            {hasSelectedService && (
              <div
                className={`border rounded-xl p-4 ${
                  isDistanceService
                    ? "bg-blue-600/10 border-blue-500"
                    : "bg-green-600/10 border-green-500"
                }`}
              >
                <p className="text-gray-400 text-sm">
                  Tipo de tarifa asignada
                </p>

                <p
                  className={`font-bold text-lg ${
                    isDistanceService ? "text-blue-400" : "text-green-400"
                  }`}
                >
                  {isDistanceService
                    ? "Tarifa automática por distancia"
                    : "Tarifa fija del servicio"}
                </p>

                {isDistanceService ? (
                  <div className="mt-2 text-sm text-gray-300">
                    <p>
                      Tarifa mínima:{" "}
                      <span className="font-bold text-green-400">
                        C$ {minimumPrice.toFixed(2)}
                      </span>
                    </p>

                    <p>
                      Precio por kilómetro:{" "}
                      <span className="font-bold text-blue-400">
                        C$ {Number(form.price_per_km || 0).toFixed(2)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-300 mt-2">
                    Precio fijo:{" "}
                    <span className="font-bold text-green-400">
                      C$ {minimumPrice.toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {isDistanceService && (
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
                  placeholder="Ejemplo: 20"
                  value={form.distance_km}
                  onChange={handleDistanceChange}
                  required
                />

                {Number(form.distance_km) > 0 && (
                  <div className="mt-4 border border-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">
                      Cálculo de la tarifa
                    </p>

                    <p className="text-xl font-bold text-white">
                      {Number(form.distance_km).toFixed(2)} km × C${" "}
                      {Number(form.price_per_km).toFixed(2)} ={" "}
                      <span className="text-blue-400">
                        C$ {distanceSubtotal.toFixed(2)}
                      </span>
                    </p>

                    {isMinimumPriceApplied && (
                      <p className="mt-3 text-yellow-400 text-sm">
                        El cálculo por distancia es menor que la tarifa mínima.
                        Se aplicará la tarifa mínima de C${" "}
                        {minimumPrice.toFixed(2)}.
                      </p>
                    )}

                    <p className="mt-3 text-green-400 font-bold text-lg">
                      Precio final: C$ {finalPrice.toFixed(2)}
                    </p>
                  </div>
                )}
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
                Lugar donde se realizará la compra, retiro, pago o mandado.
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
                  La ubicación fue guardada sin mostrar las coordenadas.
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
                Lugar donde se entregará el pedido o terminará el servicio.
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
              <p className="text-gray-400 text-sm">Tipo de tarifa</p>

              <p className="font-bold text-white mb-3">
                {!hasSelectedService
                  ? "Selecciona un servicio"
                  : isDistanceService
                    ? "Tarifa calculada por distancia"
                    : "Tarifa fija del servicio"}
              </p>

              <p className="text-gray-400 text-sm">Precio final estimado</p>

              <p className="text-3xl font-bold text-green-400">
                {hasSelectedService
                  ? `C$ ${finalPrice.toFixed(2)}`
                  : "Selecciona un servicio"}
              </p>

              {isDistanceService && Number(form.distance_km) > 0 && (
                <div className="mt-3 text-sm text-gray-400">
                  <p>
                    Cálculo: {Number(form.distance_km).toFixed(2)} km × C${" "}
                    {Number(form.price_per_km).toFixed(2)} = C${" "}
                    {distanceSubtotal.toFixed(2)}
                  </p>

                  {isMinimumPriceApplied && (
                    <p className="text-yellow-400 mt-1">
                      Se aplicó la tarifa mínima del servicio.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition rounded-lg p-3 font-bold mt-2"
              type="submit"
              disabled={loading || servicesLoading}
            >
              Revisar y confirmar pedido
            </button>
          </form>
        </div>
      </section>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl bg-[#151515] border border-red-600/40 rounded-2xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-red-600">
                Confirmar Pedido
              </h2>

              <p className="text-gray-400 mt-2">
                Revisa los datos antes de enviar tu solicitud.
              </p>
            </div>

            <div className="grid gap-4 text-gray-300">
              <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-sm">Servicio</p>
                <p className="font-bold text-white">{form.serviceType}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                  <p className="text-red-400 text-sm font-bold">Punto A</p>
                  <p>{form.origin}</p>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                  <p className="text-red-400 text-sm font-bold">Punto B</p>
                  <p>{form.destination}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Tipo de tarifa</p>
                  <p className="font-bold text-white">
                    {isDistanceService
                      ? "Tarifa por distancia"
                      : "Tarifa fija"}
                  </p>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Precio final</p>
                  <p className="text-2xl font-bold text-green-400">
                    C$ {finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {isDistanceService && (
                <div className="bg-black/40 border border-blue-600/40 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Cálculo</p>
                  <p className="font-bold text-blue-400">
                    {Number(form.distance_km).toFixed(2)} km × C${" "}
                    {Number(form.price_per_km).toFixed(2)} = C${" "}
                    {distanceSubtotal.toFixed(2)}
                  </p>

                  {isMinimumPriceApplied && (
                    <p className="text-yellow-400 text-sm mt-2">
                      Se aplicará la tarifa mínima de C${" "}
                      {minimumPrice.toFixed(2)}.
                    </p>
                  )}
                </div>
              )}

              <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-sm">Descripción</p>
                <p>
                  {form.description || "Sin descripción adicional."}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={closeConfirmModal}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-60 rounded-lg p-3 font-bold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmCreateOrder}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed rounded-lg p-3 font-bold"
              >
                {loading ? "Enviando pedido..." : "Confirmar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
