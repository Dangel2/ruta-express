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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Mis Pedidos
      </h2>

      {orders.length === 0 ? (
        <p>No tienes pedidos todavía.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 mb-3 rounded">
            <p><strong>Pedido #{order.id}</strong></p>
            <p>Origen: {order.origin}</p>
            <p>Destino: {order.destination}</p>
            <p>Descripción: {order.description}</p>
            <p>Precio: C${order.price}</p>
            <p>Estado: <strong>{order.status}</strong></p>
          </div>
        ))
      )}
    </div>
  );
}