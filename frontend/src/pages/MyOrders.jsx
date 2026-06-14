import { useEffect, useState } from "react";
import { getMyOrders } from "../services/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const result = await getMyOrders();
      setOrders(result.orders || []);
    }

    loadOrders();
  }, []);

  const getStatusClass = (status) => {
    if (status === "Entregado") {
      return "bg-green-600/10 text-green-400 border-green-500";
    }

    if (status === "En camino") {
      return "bg-blue-600/10 text-blue-400 border-blue-500";
    }

    if (status === "Cancelado") {
      return "bg-red-600/10 text-red-400 border-red-500";
    }

    return "bg-yellow-600/10 text-yellow-400 border-yellow-500";
  };

  const getStepState = (orderStatus, step) => {
    const steps = ["Pendiente", "En camino", "Entregado"];

    if (orderStatus === "Cancelado") {
      return "cancelado";
    }

    const currentIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(step);

    if (stepIndex <= currentIndex) {
      return "activo";
    }

    return "pendiente";
  };

  const getCircleClass = (state) => {
    if (state === "cancelado") {
      return "bg-red-600 border-red-500 text-white";
    }

    if (state === "activo") {
      return "bg-green-600 border-green-500 text-white";
    }

    return "bg-black border-gray-600 text-gray-500";
  };

  const getLineClass = (state) => {
    if (state === "cancelado") {
      return "bg-red-600";
    }

    if (state === "activo") {
      return "bg-green-600";
    }

    return "bg-gray-700";
  };

  const getGoogleMapsUrl = (order) => {
    const origin =
      order.origin_address || order.origin || "";

    const destination =
      order.destination_address || order.destination || "";

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}`;
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">
            Mis Pedidos
          </h1>

          <p className="text-gray-400 mt-3">
            Revisa el historial y seguimiento de tus mandados.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#151515] border border-red-600/30 rounded-2xl p-8 text-center">
            <p className="text-gray-400">
              Todavía no tienes pedidos registrados.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const pendienteState = getStepState(
                order.status,
                "Pendiente"
              );

              const caminoState = getStepState(
                order.status,
                "En camino"
              );

              const entregadoState = getStepState(
                order.status,
                "Entregado"
              );

              return (
                <div
                  key={order.id}
                  className="bg-[#151515] border border-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold">
                      Pedido #{order.id}
                    </h2>

                    <span
                      className={`border px-4 py-1 rounded-full text-sm font-bold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Seguimiento */}

                  <div className="mb-6">
                    <div className="grid grid-cols-5 items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getCircleClass(
                            pendienteState
                          )}`}
                        >
                          1
                        </div>

                        <p className="text-xs mt-2 text-gray-400">
                          Pendiente
                        </p>
                      </div>

                      <div
                        className={`h-1 ${getLineClass(
                          caminoState
                        )}`}
                      ></div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getCircleClass(
                            caminoState
                          )}`}
                        >
                          2
                        </div>

                        <p className="text-xs mt-2 text-gray-400">
                          En camino
                        </p>
                      </div>

                      <div
                        className={`h-1 ${getLineClass(
                          entregadoState
                        )}`}
                      ></div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getCircleClass(
                            entregadoState
                          )}`}
                        >
                          3
                        </div>

                        <p className="text-xs mt-2 text-gray-400">
                          Entregado
                        </p>
                      </div>
                    </div>

                    {order.status === "Cancelado" && (
                      <p className="text-red-400 text-center mt-4 font-semibold">
                        Este pedido fue cancelado.
                      </p>
                    )}
                  </div>

                  {/* Datos */}

                  <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Origen
                      </p>

                      <p>
                        {order.origin_address ||
                          order.origin}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">
                        Destino
                      </p>

                      <p>
                        {order.destination_address ||
                          order.destination}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-gray-500 text-sm">
                        Descripción
                      </p>

                      <p>{order.description}</p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">
                        Precio del servicio
                      </p>

                      <p className="font-bold text-green-400">
                        C$ {order.price}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">
                        Fecha
                      </p>

                      <p>
                        {new Date(
                          order.created_at
                        ).toLocaleString("es-NI", {
                          timeZone:
                            "America/Managua",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Botón Ver Ruta */}

                  <div className="mt-6">
                    <a
                      href={getGoogleMapsUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-lg font-bold"
                    >
                      Ver Ruta
                    </a>
                  </div>

                  {/* Mini mapa */}

                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-700">
                    <iframe
                      title={`map-${order.id}`}
                      width="100%"
                      height="250"
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        order.destination_address ||
                          order.destination
                      )}&z=15&output=embed`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}