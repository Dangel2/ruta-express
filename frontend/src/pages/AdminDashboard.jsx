import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getAllOrders,
  getAllCustomers,
  updateOrderStatus,
  getAdminPromotions,
  createAdminPromotion,
  toggleAdminPromotion
} from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [promoForm, setPromoForm] = useState({
    title: "",
    description: ""
  });

  const [promoMessage, setPromoMessage] = useState("");

  async function loadData() {
    const statsData = await getDashboardStats();
    const ordersData = await getAllOrders();
    const customersData = await getAllCustomers();
    const promotionsData = await getAdminPromotions();

    setStats(statsData);
    setOrders(ordersData.orders || []);
    setCustomers(customersData.customers || []);
    setPromotions(promotionsData.promotions || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function changeStatus(id, status) {
    await updateOrderStatus(id, status);
    loadData();
  }

  function handlePromoChange(e) {
    setPromoForm({
      ...promoForm,
      [e.target.name]: e.target.value
    });
  }

  async function handleCreatePromotion(e) {
    e.preventDefault();

    const result = await createAdminPromotion(promoForm);

    if (result.promotion) {
      setPromoMessage("Promoción creada correctamente.");
      setPromoForm({
        title: "",
        description: ""
      });
      loadData();
    } else {
      setPromoMessage(result.message || "No se pudo crear la promoción.");
    }
  }

  async function handleTogglePromotion(id) {
    await toggleAdminPromotion(id);
    loadData();
  }

  if (!stats) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white p-8">
        Cargando dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-10">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-red-600 mb-8">
          Dashboard Administrador
        </h1>

        <div className="grid md:grid-cols-5 gap-4 mb-10">
          <div className="bg-[#151515] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400">Pedidos</p>
            <h2 className="text-3xl font-bold">{stats.totalOrders}</h2>
          </div>

          <div className="bg-[#151515] border border-yellow-500 rounded-xl p-4">
            <p className="text-gray-400">Pendientes</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              {stats.pendingOrders}
            </h2>
          </div>

          <div className="bg-[#151515] border border-blue-500 rounded-xl p-4">
            <p className="text-gray-400">En camino</p>
            <h2 className="text-3xl font-bold text-blue-400">
              {stats.onWayOrders}
            </h2>
          </div>

          <div className="bg-[#151515] border border-green-500 rounded-xl p-4">
            <p className="text-gray-400">Entregados</p>
            <h2 className="text-3xl font-bold text-green-400">
              {stats.deliveredOrders}
            </h2>
          </div>

          <div className="bg-[#151515] border border-red-600 rounded-xl p-4">
            <p className="text-gray-400">Clientes</p>
            <h2 className="text-3xl font-bold text-red-500">
              {stats.totalCustomers}
            </h2>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Gestión de Promociones
        </h2>

        <div className="bg-[#151515] border border-gray-800 rounded-xl p-5 mb-8">
          {promoMessage && (
            <div className="mb-4 border border-red-600/40 bg-red-600/10 text-red-400 p-3 rounded-lg">
              {promoMessage}
            </div>
          )}

          <form onSubmit={handleCreatePromotion} className="grid gap-4">
            <input
              className="bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="title"
              placeholder="Título de la promoción"
              value={promoForm.title}
              onChange={handlePromoChange}
            />

            <textarea
              className="bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              name="description"
              placeholder="Descripción de la promoción"
              value={promoForm.description}
              onChange={handlePromoChange}
            />

            <button
              className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-bold"
              type="submit"
            >
              Crear Promoción
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#151515] border border-gray-800 rounded-xl p-4"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-bold text-red-500">
                    {promo.title}
                  </h3>
                  <p className="text-gray-300">
                    {promo.description}
                  </p>
                </div>

                <span
                  className={`h-fit px-3 py-1 rounded-full text-sm border ${
                    promo.active
                      ? "text-green-400 border-green-500 bg-green-600/10"
                      : "text-red-400 border-red-500 bg-red-600/10"
                  }`}
                >
                  {promo.active ? "Activa" : "Inactiva"}
                </span>
              </div>

              <button
                onClick={() => handleTogglePromotion(promo.id)}
                className="mt-4 bg-black border border-gray-700 hover:border-red-600 px-4 py-2 rounded-lg"
              >
                {promo.active ? "Desactivar" : "Activar"}
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Clientes Registrados
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-[#151515] border border-gray-800 rounded-xl p-4"
            >
              <p className="font-bold text-red-500">
                {customer.name}
              </p>
              <p className="text-gray-300">{customer.email}</p>
              <p className="text-gray-400">{customer.phone}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Pedidos
        </h2>

        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#151515] border border-gray-800 rounded-xl p-5"
            >
              <p className="font-bold text-xl">
                Pedido #{order.id}
              </p>

              <p className="text-gray-300">
                Cliente: {order.customer_name}
              </p>

              <p className="text-gray-300">
                Teléfono: {order.customer_phone}
              </p>

              <p className="text-gray-300">
                Origen: {order.origin}
              </p>

              <p className="text-gray-300">
                Destino: {order.destination}
              </p>

              <p className="text-gray-300">
                Estado actual:{" "}
                <span className="font-bold text-red-500">
                  {order.status}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => changeStatus(order.id, "Pendiente")}
                  className="bg-yellow-600 px-3 py-2 rounded"
                >
                  Pendiente
                </button>

                <button
                  onClick={() => changeStatus(order.id, "En camino")}
                  className="bg-blue-600 px-3 py-2 rounded"
                >
                  En camino
                </button>

                <button
                  onClick={() => changeStatus(order.id, "Entregado")}
                  className="bg-green-600 px-3 py-2 rounded"
                >
                  Entregado
                </button>

                <button
                  onClick={() => changeStatus(order.id, "Cancelado")}
                  className="bg-red-600 px-3 py-2 rounded"
                >
                  Cancelado
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}