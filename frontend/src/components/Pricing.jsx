import { useCallback, useEffect, useState } from "react";
import { getPublicServices } from "../services/api";

export default function Pricing() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getPublicServices();

      if (result.services) {
        setServices(result.services);
        setErrorMessage("");
      } else {
        setServices([]);
        setErrorMessage(
          result.message || "No se pudieron cargar las tarifas."
        );
      }
    } catch (error) {
      console.error("Error cargando tarifas:", error);

      setServices([]);
      setErrorMessage(
        "No se pudieron cargar las tarifas en este momento."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();

    function refreshWhenWindowIsActive() {
      loadServices();
    }

    window.addEventListener("focus", refreshWhenWindowIsActive);

    return () => {
      window.removeEventListener(
        "focus",
        refreshWhenWindowIsActive
      );
    };
  }, [loadServices]);

  function formatPrice(price) {
    return Number(price || 0).toFixed(2);
  }

  function isDistanceService(service) {
    return service.price_type === "distance";
  }

  return (
    <section
      id="tarifas"
      className="bg-[#080808] text-white px-4 py-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Precios actualizados
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Nuestras{" "}
            <span className="text-red-600">Tarifas</span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Consulta los servicios disponibles, las rutas y sus
            precios. Las tarifas se actualizan automáticamente
            desde nuestro sistema.
          </p>
        </div>

        <div className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-950/20">
          <div className="hidden md:grid md:grid-cols-[1fr_220px_220px] bg-red-600 px-6 py-5">
            <p className="font-bold text-white uppercase tracking-wide">
              Ruta o servicio
            </p>

            <p className="font-bold text-white uppercase tracking-wide text-center">
              Tipo de tarifa
            </p>

            <p className="font-bold text-white uppercase tracking-wide text-right">
              Precio
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-gray-400 mt-4">
                Cargando tarifas disponibles...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-600/40 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">!</span>
              </div>

              <p className="text-red-400 font-semibold">
                {errorMessage}
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-400">
                Actualmente no hay servicios disponibles.
              </p>
            </div>
          ) : (
            <div>
              {services.map((service, index) => {
                const distanceService =
                  isDistanceService(service);

                return (
                  <article
                    key={service.id}
                    className={`grid md:grid-cols-[1fr_220px_220px] gap-4 md:gap-6 items-center px-5 md:px-6 py-6 transition hover:bg-red-600/5 ${
                      index !== services.length - 1
                        ? "border-b border-gray-800"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 font-bold">
                        {index + 1}
                      </div>

                      <div>
                        <p className="md:hidden text-xs text-gray-500 uppercase font-bold mb-1">
                          Ruta o servicio
                        </p>

                        <h3 className="text-lg md:text-xl font-bold text-white">
                          {service.name}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          Servicio disponible en Ruta Express
                        </p>
                      </div>
                    </div>

                    <div className="md:text-center">
                      <p className="md:hidden text-xs text-gray-500 uppercase font-bold mb-2">
                        Tipo de tarifa
                      </p>

                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full border text-sm font-bold ${
                          distanceService
                            ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                            : "bg-green-600/10 border-green-500/50 text-green-400"
                        }`}
                      >
                        {distanceService
                          ? "Por distancia"
                          : "Tarifa fija"}
                      </span>
                    </div>

                    <div className="md:text-right">
                      <p className="md:hidden text-xs text-gray-500 uppercase font-bold mb-2">
                        Precio
                      </p>

                      {distanceService ? (
                        <div>
                          <p className="text-gray-400 text-sm">
                            Desde
                          </p>

                          <p className="text-2xl font-bold text-green-400">
                            C$ {formatPrice(service.price)}
                          </p>

                          <p className="text-blue-400 text-sm font-semibold mt-1">
                            C${" "}
                            {formatPrice(
                              service.price_per_km
                            )}{" "}
                            por km
                          </p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-green-400">
                          C$ {formatPrice(service.price)}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 bg-[#151515] border border-gray-800 rounded-2xl p-4">
          <div className="w-9 h-9 shrink-0 rounded-full bg-red-600/10 flex items-center justify-center text-red-500 font-bold">
            i
          </div>

          <p className="text-gray-400 text-sm">
            Los precios mostrados corresponden a los servicios
            activos. Los servicios por distancia muestran una
            tarifa mínima y un precio adicional por kilómetro.
          </p>
        </div>
      </div>
    </section>
  );
}