import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { cancelOrder, getMyOrders } from "../services/api";

const socket = io("http://localhost:5000", {
  autoConnect: false
});

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cancelingId, setCancelingId] = useState(null);
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);
  const [statusAlert, setStatusAlert] = useState(null);

  const previousOrdersRef = useRef([]);
  const firstLoadRef = useRef(true);

  async function loadOrders(showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const result = await getMyOrders();

      if (result.orders) {
        const newOrders = result.orders;
        const previousOrders = previousOrdersRef.current;

        if (!firstLoadRef.current) {
          const changedOrder = newOrders.find((newOrder) => {
            const previousOrder = previousOrders.find(
              (order) => order.id === newOrder.id
            );

            return previousOrder && previousOrder.status !== newOrder.status;
          });

          if (changedOrder) {
            setStatusAlert({
              id: changedOrder.id,
              status: changedOrder.status,
              ...getStatusNotification(changedOrder.status)
            });

            setTimeout(() => {
              setStatusAlert(null);
            }, 7000);
          }
        }

        previousOrdersRef.current = newOrders;
        firstLoadRef.current = false;

        setOrders(newOrders);
        setMessage("");
      } else {
        setOrders([]);
        setMessage(result.message || "No se pudieron cargar los pedidos.");
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setMessage("Ocurrió un error al cargar los pedidos.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadOrders(true);

    socket.auth = {
      token: localStorage.getItem("token")
    };

    socket.connect();

    socket.on("order-status-updated", (data) => {
  const updatedOrder = data.order;

  setOrders((previousOrders) => {
    const updatedOrders = previousOrders.map((order) =>
      order.id === updatedOrder.id
        ? { ...order, ...updatedOrder }
        : order
    );

    previousOrdersRef.current = updatedOrders;

    return updatedOrders;
  });

  const notification = getStatusNotification(updatedOrder.status);

  setStatusAlert({
    id: updatedOrder.id,
    status: updatedOrder.status,
    title: notification.title,
    message: notification.message
  });

  setTimeout(() => {
    setStatusAlert(null);
  }, 7000);

  const audio = new Audio("/notification.mp3");
  audio.play().catch(() => {
    console.log("El navegador bloqueó el sonido del cliente.");
  });
});

    return () => {
      socket.off("order-status-updated");
      socket.disconnect();
    };
  }, []);

  function getStatusClass(status) {
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
  }

  function getStatusNotification(status) {
    switch (status) {
      case "Pendiente":
        return {
          title: "📦 Pedido pendiente",
          message:
            "Tu pedido fue recibido correctamente y está esperando ser atendido."
        };

      case "En camino":
        return {
          title: "🚚 Pedido en camino",
          message: "El repartidor ya se encuentra realizando tu servicio."
        };

      case "Entregado":
        return {
          title: "✅ Pedido entregado",
          message:
            "Tu pedido fue completado correctamente. Gracias por usar Ruta Express."
        };

      case "Cancelado":
        return {
          title: "❌ Pedido cancelado",
          message: "Este pedido fue cancelado y ya no se encuentra activo."
        };

      default:
        return {
          title: "📦 Estado del pedido",
          message:
            "Tu pedido se está actualizando. Revisa el seguimiento para más detalles."
        };
    }
  }

  function getStepState(orderStatus, step) {
    const steps = ["Pendiente", "En camino", "Entregado"];

    if (orderStatus === "Cancelado") {
      return "cancelado";
    }

    const currentIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(step);

    if (currentIndex === -1) {
      return "pendiente";
    }

    if (stepIndex <= currentIndex) {
      return "activo";
    }

    return "pendiente";
  }

  function getCircleClass(state) {
    if (state === "cancelado") {
      return "bg-red-600 border-red-500 text-white";
    }

    if (state === "activo") {
      return "bg-green-600 border-green-500 text-white";
    }

    return "bg-black border-gray-600 text-gray-500";
  }

  function getLineClass(state) {
    if (state === "cancelado") {
      return "bg-red-600";
    }

    if (state === "activo") {
      return "bg-green-600";
    }

    return "bg-gray-700";
  }

  function getPriceTypeLabel(priceType) {
    if (priceType === "distance") {
      return "Tarifa por distancia";
    }

    if (priceType === "manual") {
      return "Tarifa ajustada manualmente";
    }

    return "Tarifa fija";
  }

  function getPriceTypeClass(priceType) {
    if (priceType === "distance") {
      return "text-blue-400 border-blue-500 bg-blue-600/10";
    }

    if (priceType === "manual") {
      return "text-purple-400 border-purple-500 bg-purple-600/10";
    }

    return "text-green-400 border-green-500 bg-green-600/10";
  }

  function getOriginText(order) {
    return order.origin_address || order.origin || "Punto A no registrado";
  }

  function getDestinationText(order) {
    return (
      order.destination_address || order.destination || "Punto B no registrado"
    );
  }

  function getOriginForMap(order) {
    if (order.origin_lat && order.origin_lng) {
      return `${order.origin_lat},${order.origin_lng}`;
    }

    return getOriginText(order);
  }

  function getDestinationForMap(order) {
    if (order.destination_lat && order.destination_lng) {
      return `${order.destination_lat},${order.destination_lng}`;
    }

    return getDestinationText(order);
  }

  function getGoogleMapsUrl(order) {
    const origin = getOriginForMap(order);
    const destination = getDestinationForMap(order);

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}`;
  }

  function getMapEmbedUrl(order) {
    const destination = getDestinationForMap(order);

    return `https://maps.google.com/maps?q=${encodeURIComponent(
      destination
    )}&z=15&output=embed`;
  }

  function formatDate(date) {
    if (!date) {
      return "Fecha no disponible";
    }

    return new Date(date).toLocaleString("es-NI", {
      timeZone: "America/Managua",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }

  function formatPrice(price) {
    return Number(price || 0).toFixed(2);
  }

  function formatDistance(distance) {
    const value = Number(distance || 0);

    if (value <= 0) {
      return "No registrada";
    }

    return `${value.toFixed(2)} km`;
  }

  function openCancelConfirmation(order) {
    setConfirmCancelOrder(order);
  }

  function closeCancelConfirmation() {
    if (cancelingId) return;
    setConfirmCancelOrder(null);
  }

  async function handleConfirmCancelOrder() {
    if (!confirmCancelOrder) return;

    try {
      setCancelingId(confirmCancelOrder.id);
      setMessage("");

      const result = await cancelOrder(confirmCancelOrder.id);

      if (result.order) {
        setOrders((previousOrders) =>
          previousOrders.filter((order) => order.id !== result.order.id)
        );

        previousOrdersRef.current = previousOrdersRef.current.filter(
          (order) => order.id !== result.order.id
        );

        setMessage("Pedido cancelado correctamente.");
        setConfirmCancelOrder(null);
      } else {
        setMessage(result.message || "No se pudo cancelar el pedido.");
      }
    } catch (error) {
      console.error("Error cancelando pedido:", error);
      setMessage("Ocurrió un error al cancelar el pedido.");
    } finally {
      setCancelingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
        <section className="max-w-5xl mx-auto">
          <div className="bg-[#151515] border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-400">Cargando tus pedidos...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      {statusAlert && (
        <div className="fixed top-5 right-5 z-50 w-[92%] max-w-sm">
          <div
            className={`border rounded-2xl p-4 shadow-2xl backdrop-blur bg-[#151515]/95 ${getStatusClass(
              statusAlert.status
            )}`}
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-bold text-lg">{statusAlert.title}</p>
                <p className="text-sm mt-1">
                  Pedido #{statusAlert.id}: {statusAlert.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStatusAlert(null)}
                className="text-white/70 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">Mis Pedidos</h1>

          <p className="text-gray-400 mt-3">
            Revisa el historial, la tarifa y el seguimiento de tus mandados.
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Esta página se actualiza en tiempo real.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-xl p-4 text-center border ${
              message.includes("correctamente")
                ? "bg-green-600/10 border-green-500 text-green-400"
                : "bg-red-600/10 border-red-500 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-[#151515] border border-red-600/30 rounded-2xl p-8 text-center">
            <p className="text-gray-400">
              Todavía no tienes pedidos registrados.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => {
              const pendienteState = getStepState(order.status, "Pendiente");
              const caminoState = getStepState(order.status, "En camino");
              const entregadoState = getStepState(order.status, "Entregado");

              const priceType = order.price_type || "fixed";
              const isDistancePrice = priceType === "distance";

              return (
                <article
                  key={order.id}
                  className="bg-[#151515] border border-gray-800 rounded-2xl p-5 md:p-6 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold">Pedido #{order.id}</h2>

                    <span
                      className={`border px-4 py-1 rounded-full text-sm font-bold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div
                    className={`mb-6 border rounded-xl p-4 ${getStatusClass(
                      order.status
                    )}`}
                  >
                    <h3 className="font-bold text-lg">
                      {getStatusNotification(order.status).title}
                    </h3>

                    <p className="mt-1 text-sm md:text-base">
                      {getStatusNotification(order.status).message}
                    </p>
                  </div>

                  <div className="mb-7">
                    <div className="grid grid-cols-5 items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getCircleClass(
                            pendienteState
                          )}`}
                        >
                          1
                        </div>

                        <p className="text-xs mt-2 text-gray-400 text-center">
                          Pendiente
                        </p>
                      </div>

                      <div className={`h-1 ${getLineClass(caminoState)}`} />

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getCircleClass(
                            caminoState
                          )}`}
                        >
                          2
                        </div>

                        <p className="text-xs mt-2 text-gray-400 text-center">
                          En camino
                        </p>
                      </div>

                      <div className={`h-1 ${getLineClass(entregadoState)}`} />

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getCircleClass(
                            entregadoState
                          )}`}
                        >
                          3
                        </div>

                        <p className="text-xs mt-2 text-gray-400 text-center">
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

                  <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                    <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                      <p className="text-red-400 text-sm font-bold mb-1">
                        Punto A
                      </p>

                      <p className="text-sm text-gray-500 mb-2">
                        Lugar donde se realiza el mandado
                      </p>

                      <p>{getOriginText(order)}</p>
                    </div>

                    <div className="bg-black/40 border border-gray-800 rounded-xl p-4">
                      <p className="text-red-400 text-sm font-bold mb-1">
                        Punto B
                      </p>

                      <p className="text-sm text-gray-500 mb-2">
                        Lugar donde se entrega el pedido
                      </p>

                      <p>{getDestinationText(order)}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-gray-500 text-sm">Descripción</p>

                      <p>
                        {order.description || "Sin descripción adicional"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-2">
                        Tipo de tarifa
                      </p>

                      <span
                        className={`inline-block border px-3 py-1 rounded-full text-sm font-bold ${getPriceTypeClass(
                          priceType
                        )}`}
                      >
                        {getPriceTypeLabel(priceType)}
                      </span>
                    </div>

                    {isDistancePrice && (
                      <div>
                        <p className="text-gray-500 text-sm">
                          Distancia estimada
                        </p>

                        <p className="font-bold text-blue-400">
                          {formatDistance(order.distance_km)}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-gray-500 text-sm">
                        Precio del servicio
                      </p>

                      <p className="text-2xl font-bold text-green-400">
                        C$ {formatPrice(order.price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Fecha</p>

                      <p>{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row gap-3">
                    <a
                      href={getGoogleMapsUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-lg font-bold"
                    >
                      Ver Ruta Punto A → Punto B
                    </a>

                    {order.status === "Pendiente" && (
                      <button
                        type="button"
                        onClick={() => openCancelConfirmation(order)}
                        className="inline-flex items-center justify-center w-full md:w-auto gap-2 bg-yellow-600 hover:bg-yellow-700 transition px-5 py-3 rounded-lg font-bold"
                      >
                        Cancelar Pedido
                      </button>
                    )}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-700">
                    <iframe
                      title={`Mapa del pedido ${order.id}`}
                      width="100%"
                      height="250"
                      loading="lazy"
                      src={getMapEmbedUrl(order)}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {confirmCancelOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="w-full max-w-md bg-[#151515] border border-red-600/40 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-red-500 mb-3">
                Cancelar pedido
              </h2>

              <p className="text-gray-300 mb-2">
                ¿Deseas cancelar este pedido?
              </p>

              <p className="text-gray-500 text-sm mb-6">
                Pedido #{confirmCancelOrder.id}. Solo se pueden cancelar pedidos
                que todavía están en estado Pendiente.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={closeCancelConfirmation}
                  disabled={Boolean(cancelingId)}
                  className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-60 transition px-4 py-3 rounded-lg font-bold"
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCancelOrder}
                  disabled={Boolean(cancelingId)}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition px-4 py-3 rounded-lg font-bold"
                >
                  {cancelingId ? "Cancelando..." : "Sí, cancelar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}