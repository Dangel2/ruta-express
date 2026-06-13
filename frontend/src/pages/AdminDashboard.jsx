import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus
} from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  async function loadData() {
    const statsData = await getDashboardStats();
    const ordersData = await getAllOrders();

    setStats(statsData);
    setOrders(ordersData.orders || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function changeStatus(id, status) {
    await updateOrderStatus(id, status);

    loadData();
  }

  if (!stats) {
    return <p>Cargando dashboard...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border p-4">
          Pedidos Totales: {stats.totalOrders}
        </div>

        <div className="border p-4">
          Pendientes: {stats.pendingOrders}
        </div>

        <div className="border p-4">
          En Camino: {stats.onWayOrders}
        </div>

        <div className="border p-4">
          Entregados: {stats.deliveredOrders}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Pedidos
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded p-4 mb-4"
        >
          <p><strong>Pedido #{order.id}</strong></p>
          <p>Cliente: {order.customer_name}</p>
          <p>Origen: {order.origin}</p>
          <p>Destino: {order.destination}</p>
          <p>Estado actual: {order.status}</p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() =>
                changeStatus(order.id, "Pendiente")
              }
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Pendiente
            </button>

            <button
              onClick={() =>
                changeStatus(order.id, "En camino")
              }
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              En Camino
            </button>

            <button
              onClick={() =>
                changeStatus(order.id, "Entregado")
              }
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Entregado
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}