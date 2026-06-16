import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  getDashboardStats,
  getAllOrders,
  getAllCustomers,
  updateOrderStatus,
  getAdminPromotions,
  createAdminPromotion,
  toggleAdminPromotion,
  getAdminServices,
  createAdminService,
  toggleAdminService,
  deleteAdminService,
  deleteAdminPromotion,
  deleteAdminOrder,
  getUnreadNotificationsCount,
  markNotificationsViewed
} from "../services/api";

const socket = io("http://localhost:5000");

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Hoy");

  const [promoForm, setPromoForm] = useState({
    title: "",
    description: ""
  });

  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: "",
    price_type: "fixed",
    price_per_km: ""
  });

  const [promoMessage, setPromoMessage] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [toastOrder, setToastOrder] = useState(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  function formatDate(date) {
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

  function getDateKey(date) {
    return new Date(date).toLocaleDateString("en-CA", {
      timeZone: "America/Managua"
    });
  }

  function getTodayKey() {
    return new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Managua"
    });
  }

  function getPointAForMap(order) {
    if (order.origin_lat && order.origin_lng) {
      return `${order.origin_lat},${order.origin_lng}`;
    }

    return order.origin_address || order.origin || "";
  }

  function getPointBForMap(order) {
    if (order.destination_lat && order.destination_lng) {
      return `${order.destination_lat},${order.destination_lng}`;
    }

    return order.destination_address || order.destination || "";
  }

  function getGoogleMapsUrl(order) {
    const pointA = getPointAForMap(order);
    const pointB = getPointBForMap(order);

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      pointA
    )}&destination=${encodeURIComponent(pointB)}&travelmode=driving`;
  }

  function getFullDeliveryRouteUrl(order) {
    const pointA = getPointAForMap(order);
    const pointB = getPointBForMap(order);

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      "My Location"
    )}&destination=${encodeURIComponent(
      pointB
    )}&waypoints=${encodeURIComponent(pointA)}&travelmode=driving`;
  }

  async function loadData() {
    const statsData = await getDashboardStats();
    const ordersData = await getAllOrders();
    const customersData = await getAllCustomers();
    const promotionsData = await getAdminPromotions();
    const servicesData = await getAdminServices();
	const notificationsData =
  await getUnreadNotificationsCount();

    setStats(statsData);
    setOrders(ordersData.orders || []);
    setCustomers(customersData.customers || []);
    setPromotions(promotionsData.promotions || []);
    setServices(servicesData.services || []);
	
	setNewOrdersCount(
  notificationsData.count || 0
);
  }

  useEffect(() => {
  loadData();

  socket.on("new-order", async (data) => {
    const order = data.order;

    setNewOrderAlert(`🚚 Nuevo pedido #${order.id} de ${order.customer_name || "Cliente"}`);
    setToastOrder(order);

    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});

    const notificationsData = await getUnreadNotificationsCount();
    setNewOrdersCount(notificationsData.count || 0);

    const ordersData = await getAllOrders();
    setOrders(ordersData.orders || []);

    setTimeout(() => {
      setNewOrderAlert(null);
      setToastOrder(null);
    }, 10000);
  });

  return () => {
    socket.off("new-order");
  };
}, []);

async function handleMarkNotificationsRead() {
  await markNotificationsViewed();
  setNewOrdersCount(0);
}

  async function changeStatus(id, status) {
    await updateOrderStatus(id, status);
    loadData();
  }

  async function handleDeleteOrder(id) {
    const confirmDelete = window.confirm(
      "¿Deseas eliminar este pedido?\n\nEsta acción no se puede deshacer."
    );

    if (!confirmDelete) return;

    const result = await deleteAdminOrder(id);

    if (result.order) {
      loadData();
    } else {
      alert(result.message || "No se pudo eliminar el pedido.");
    }
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
      setPromoForm({ title: "", description: "" });
      loadData();
    } else {
      setPromoMessage(result.message || "No se pudo crear la promoción.");
    }
  }

  async function handleTogglePromotion(id) {
    await toggleAdminPromotion(id);
    loadData();
  }

  async function handleDeletePromotion(id) {
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta promoción?");
    if (!confirmDelete) return;

    await deleteAdminPromotion(id);
    loadData();
  }

  function handleServiceChange(e) {
    const { name, value } = e.target;

    if (name === "price_type") {
      setServiceForm((previousForm) => ({
        ...previousForm,
        price_type: value,
        price_per_km:
          value === "fixed" ? "" : previousForm.price_per_km
      }));

      return;
    }

    setServiceForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  }

  async function handleCreateService(e) {
    e.preventDefault();

    if (!serviceForm.name.trim()) {
      setServiceMessage("El nombre del servicio es obligatorio.");
      return;
    }

    if (
      serviceForm.price === "" ||
      Number(serviceForm.price) < 0
    ) {
      setServiceMessage("Ingresa un precio válido.");
      return;
    }

    if (
      serviceForm.price_type === "distance" &&
      (serviceForm.price_per_km === "" ||
        Number(serviceForm.price_per_km) <= 0)
    ) {
      setServiceMessage(
        "Ingresa un precio por kilómetro mayor que cero."
      );
      return;
    }

    const result = await createAdminService({
      name: serviceForm.name.trim(),
      price: Number(serviceForm.price),
      price_type: serviceForm.price_type,
      price_per_km:
        serviceForm.price_type === "distance"
          ? Number(serviceForm.price_per_km)
          : 0
    });

    if (result.service) {
      setServiceMessage("Servicio creado correctamente.");

      setServiceForm({
        name: "",
        price: "",
        price_type: "fixed",
        price_per_km: ""
      });

      loadData();
    } else {
      setServiceMessage(
        result.message || "No se pudo crear el servicio."
      );
    }
  }

  async function handleToggleService(id) {
    await toggleAdminService(id);
    loadData();
  }

  async function handleDeleteService(id) {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este servicio?");
    if (!confirmDelete) return;

    await deleteAdminService(id);
    loadData();
  }

  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();
    const todayKey = getTodayKey();
    const orderDateKey = getDateKey(order.created_at);

    const matchesDate =
      dateFilter === "Todos" || orderDateKey === todayKey;

    const matchesSearch =
      order.customer_name?.toLowerCase().includes(text) ||
      order.customer_phone?.toLowerCase().includes(text) ||
      order.origin?.toLowerCase().includes(text) ||
      order.destination?.toLowerCase().includes(text) ||
      order.origin_address?.toLowerCase().includes(text) ||
      order.destination_address?.toLowerCase().includes(text) ||
      String(order.id).includes(text);

    const matchesStatus =
      statusFilter === "Todos" || order.status === statusFilter;

    return matchesDate && matchesSearch && matchesStatus;
  });

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
    setDateFilter("Hoy");
  }

  function exportCustomersExcel() {
    const data = customers.map((customer) => ({
      ID: customer.id,
      Nombre: customer.name,
      Telefono: customer.phone,
      Correo: customer.email,
      Registro: formatDate(customer.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(file, "clientes_ruta_express.xlsx");
  }

  function exportOrdersExcel() {
    const data = orders.map((order) => ({
      Pedido: order.id,
      Cliente: order.customer_name,
      Telefono: order.customer_phone,
      "Punto A": order.origin_address || order.origin,
      "Punto B": order.destination_address || order.destination,
      "Tipo de tarifa":
        order.price_type === "distance"
          ? "Por distancia"
          : order.price_type === "manual"
            ? "Manual"
            : "Fija",
      "Distancia km":
        order.price_type === "distance"
          ? Number(order.distance_km || 0)
          : 0,
      Precio: order.price,
      Estado: order.status,
      Fecha: formatDate(order.created_at),
      "Ruta Punto A a Punto B": getGoogleMapsUrl(order),
      "Ruta completa repartidor": getFullDeliveryRouteUrl(order)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(file, "pedidos_ruta_express.xlsx");
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
      {toastOrder && (
        <div className="fixed top-5 right-5 z-50 w-[340px] max-w-[90vw] bg-[#151515] border border-green-500 shadow-2xl rounded-2xl p-4 animate-pulse">
          <p className="text-green-400 font-bold text-lg">
            🔔 Nuevo pedido recibido
          </p>

          <p className="text-white font-bold mt-1">
            Pedido #{toastOrder.id}
          </p>

          <p className="text-gray-300 text-sm mt-1">
            Cliente: {toastOrder.customer_name || "No disponible"}
          </p>

          <p className="text-gray-300 text-sm">
            Punto A: {toastOrder.origin_address || toastOrder.origin || "No disponible"}
          </p>

          <p className="text-gray-300 text-sm">
            Punto B: {toastOrder.destination_address || toastOrder.destination || "No disponible"}
          </p>

          <p className="text-green-400 font-bold mt-2">
            C$ {Number(toastOrder.price || 0).toFixed(2)}
          </p>
        </div>
      )}

      <section className="max-w-6xl mx-auto">
	  
	  {newOrderAlert && (
  <div className="mb-6 bg-green-600 text-white p-4 rounded-xl text-center font-bold text-lg animate-pulse">
    {newOrderAlert}
  </div>
)}
	  
        <h1 className="text-4xl font-bold text-red-600 mb-8">
          Dashboard Administrador
        </h1>

        <div className="mb-6 bg-[#151515] border border-red-600 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-gray-400 text-sm">Alertas del dashboard</p>
            <h2 className="text-2xl font-bold text-red-500">
              🔔 Pedidos nuevos: {newOrdersCount}
            </h2>
          </div>

          <button
            onClick={handleMarkNotificationsRead}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
          >
            Marcar como vistos
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={exportCustomersExcel}
            className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-bold"
          >
            Exportar Clientes Excel
          </button>

          <button
            onClick={exportOrdersExcel}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-bold"
          >
            Exportar Pedidos Excel
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Dashboard Diario</h2>

        <div className="grid md:grid-cols-5 gap-4 mb-10">
          <div className="bg-[#151515] border border-red-600 rounded-xl p-4">
            <p className="text-gray-400">Pedidos de Hoy</p>
            <h2 className="text-3xl font-bold text-red-500">
              {stats.todayOrders ?? 0}
            </h2>
          </div>

          <div className="bg-[#151515] border border-yellow-500 rounded-xl p-4">
            <p className="text-gray-400">Pendientes de Hoy</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              {stats.todayPendingOrders ?? stats.pendingOrders ?? 0}
            </h2>
          </div>

          <div className="bg-[#151515] border border-blue-500 rounded-xl p-4">
            <p className="text-gray-400">En Camino Hoy</p>
            <h2 className="text-3xl font-bold text-blue-400">
              {stats.todayOnWayOrders ?? stats.onWayOrders ?? 0}
            </h2>
          </div>

          <div className="bg-[#151515] border border-green-500 rounded-xl p-4">
            <p className="text-gray-400">Entregados Hoy</p>
            <h2 className="text-3xl font-bold text-green-400">
              {stats.todayDeliveredOrders ?? stats.deliveredOrders ?? 0}
            </h2>
          </div>
		  
		  <div className="bg-[#151515] border border-emerald-500 rounded-xl p-4">
  <p className="text-gray-400">Ingresos de Hoy</p>
  <h2 className="text-3xl font-bold text-emerald-400">
    C$ {stats.todayIncome ?? 0}
  </h2>
</div>
		  
        </div>

        <h2 className="text-2xl font-bold mb-4">Dashboard Mensual</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="bg-[#151515] border border-purple-500 rounded-xl p-4">
            <p className="text-gray-400">Pedidos del Mes</p>
            <h2 className="text-3xl font-bold text-purple-400">
              {stats.monthOrders}
            </h2>
          </div>

          <div className="bg-[#151515] border border-emerald-500 rounded-xl p-4">
            <p className="text-gray-400">Ingresos del Mes</p>
            <h2 className="text-3xl font-bold text-emerald-400">
              C$ {stats.monthIncome}
            </h2>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Dashboard Histórico</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="bg-[#151515] border border-cyan-500 rounded-xl p-4">
            <p className="text-gray-400">Total Clientes</p>
            <h2 className="text-3xl font-bold text-cyan-400">
              {stats.totalCustomers}
            </h2>
          </div>

          <div className="bg-[#151515] border border-green-600 rounded-xl p-4">
            <p className="text-gray-400">Ingresos Totales</p>
            <h2 className="text-3xl font-bold text-green-400">
              C$ {stats.totalIncome}
            </h2>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Gestión de Promociones</h2>

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
                  <h3 className="font-bold text-red-500">{promo.title}</h3>
                  <p className="text-gray-300">{promo.description}</p>
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

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleTogglePromotion(promo.id)}
                  className="bg-black border border-gray-700 hover:border-red-600 px-4 py-2 rounded-lg"
                >
                  {promo.active ? "Desactivar" : "Activar"}
                </button>

                <button
                  onClick={() => handleDeletePromotion(promo.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Gestión de Servicios y Precios
        </h2>

        <div className="bg-[#151515] border border-gray-800 rounded-xl p-5 mb-8">
          {serviceMessage && (
            <div className="mb-4 border border-red-600/40 bg-red-600/10 text-red-400 p-3 rounded-lg">
              {serviceMessage}
            </div>
          )}

          <form
            onSubmit={handleCreateService}
            className="grid md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Nombre del servicio
              </label>

              <input
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
                name="name"
                placeholder="Ejemplo: Viaje fuera de cobertura"
                value={serviceForm.name}
                onChange={handleServiceChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Tipo de tarifa
              </label>

              <select
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
                name="price_type"
                value={serviceForm.price_type}
                onChange={handleServiceChange}
              >
                <option value="fixed">Tarifa fija</option>
                <option value="distance">Tarifa por distancia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {serviceForm.price_type === "distance"
                  ? "Tarifa mínima C$"
                  : "Precio fijo C$"}
              </label>

              <input
                className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder={
                  serviceForm.price_type === "distance"
                    ? "Ejemplo: 80"
                    : "Ejemplo: 300"
                }
                value={serviceForm.price}
                onChange={handleServiceChange}
                required
              />
            </div>

            {serviceForm.price_type === "distance" && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Precio por kilómetro C$
                </label>

                <input
                  className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-blue-600"
                  name="price_per_km"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Ejemplo: 10"
                  value={serviceForm.price_per_km}
                  onChange={handleServiceChange}
                  required
                />
              </div>
            )}

            <div className="md:col-span-2 bg-black border border-gray-800 rounded-lg p-4">
              {serviceForm.price_type === "distance" ? (
                <div className="text-sm text-gray-300">
                  <p className="font-bold text-blue-400">
                    Servicio con tarifa por distancia
                  </p>

                  <p className="mt-1">
                    Se cobrará el precio por kilómetro y nunca menos
                    que la tarifa mínima.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-300">
                  <p className="font-bold text-green-400">
                    Servicio con tarifa fija
                  </p>

                  <p className="mt-1">
                    El cliente verá únicamente el precio fijo que
                    configures.
                  </p>
                </div>
              )}
            </div>

            <button
              className="md:col-span-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-bold"
              type="submit"
            >
              Crear Servicio
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[#151515] border border-gray-800 rounded-xl p-4"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-bold text-red-500">
                    {service.name}
                  </h3>

                  {service.price_type === "distance" ? (
                    <div className="mt-2">
                      <span className="inline-block border border-blue-500 bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                        Tarifa por distancia
                      </span>

                      <p className="text-green-400 font-bold mt-2">
                        Tarifa mínima: C${" "}
                        {Number(service.price || 0).toFixed(2)}
                      </p>

                      <p className="text-blue-400 font-bold">
                        C${" "}
                        {Number(service.price_per_km || 0).toFixed(2)}{" "}
                        por km
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className="inline-block border border-green-500 bg-green-600/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                        Tarifa fija
                      </span>

                      <p className="text-green-400 font-bold mt-2">
                        C$ {Number(service.price || 0).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                <span
                  className={`h-fit px-3 py-1 rounded-full text-sm border ${
                    service.active
                      ? "text-green-400 border-green-500 bg-green-600/10"
                      : "text-red-400 border-red-500 bg-red-600/10"
                  }`}
                >
                  {service.active ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleToggleService(service.id)}
                  className="bg-black border border-gray-700 hover:border-red-600 px-4 py-2 rounded-lg"
                >
                  {service.active ? "Desactivar" : "Activar"}
                </button>

                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Clientes Registrados</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-[#151515] border border-gray-800 rounded-xl p-4"
            >
              <p className="font-bold text-red-500">{customer.name}</p>
              <p className="text-gray-300">{customer.email}</p>
              <p className="text-gray-400">{customer.phone}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Pedidos de Hoy</h2>

        <div className="bg-[#151515] border border-gray-800 rounded-xl p-5 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              className="bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              placeholder="Buscar por cliente, teléfono, punto A, punto B o #pedido"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Todos</option>
              <option>Pendiente</option>
              <option>En camino</option>
              <option>Entregado</option>
              <option>Cancelado</option>
            </select>

            <select
              className="bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option>Hoy</option>
              <option>Todos</option>
            </select>

            <button
              onClick={clearFilters}
              className="bg-red-600 hover:bg-red-700 rounded-lg font-bold"
            >
              Limpiar filtros
            </button>
          </div>

          <p className="text-gray-400 mt-4">
            Mostrando {filteredOrders.length} de {orders.length} pedidos.
          </p>
        </div>

        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-[#151515] border border-gray-800 rounded-xl p-5 text-gray-400">
              No hay pedidos que coincidan con la búsqueda.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#151515] border border-gray-800 rounded-xl p-5"
              >
                <p className="font-bold text-xl">Pedido #{order.id}</p>

                <p className="text-gray-300">
                  Cliente: {order.customer_name}
                </p>

                <p className="text-gray-300">
                  Teléfono: {order.customer_phone}
                </p>

                <p className="text-gray-300">
                  Punto A: {order.origin_address || order.origin}
                </p>

                <p className="text-gray-300">
                  Punto B: {order.destination_address || order.destination}
                </p>

                <p className="text-gray-300">
                  Fecha: {formatDate(order.created_at)}
                </p>

                <p className="text-gray-300">
                  Tipo de tarifa:{" "}
                  <span
                    className={`font-bold ${
                      order.price_type === "distance"
                        ? "text-blue-400"
                        : order.price_type === "manual"
                          ? "text-purple-400"
                          : "text-green-400"
                    }`}
                  >
                    {order.price_type === "distance"
                      ? "Por distancia"
                      : order.price_type === "manual"
                        ? "Manual"
                        : "Fija"}
                  </span>
                </p>

                {order.price_type === "distance" && (
                  <p className="text-gray-300">
                    Distancia estimada:{" "}
                    <span className="font-bold text-blue-400">
                      {Number(order.distance_km || 0).toFixed(2)} km
                    </span>
                  </p>
                )}

                <p className="text-gray-300">
                  Precio del servicio:{" "}
                  <span className="font-bold text-green-400">
                    C$ {Number(order.price || 0).toFixed(2)}
                  </span>
                </p>

                <p className="text-gray-300">
                  Estado actual:{" "}
                  <span className="font-bold text-red-500">
                    {order.status}
                  </span>
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <a
                    href={getGoogleMapsUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
                  >
                    Ver Ruta Punto A ?Punto B
                  </a>

                  <a
                    href={getFullDeliveryRouteUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold"
                  >
                    Ruta completa: Mi ubicación ?Punto A ?Punto B
                  </a>

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

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="bg-red-900 hover:bg-red-800 px-3 py-2 rounded font-bold"
                  >
                    Eliminar Pedido
                  </button>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-700">
                  <iframe
                    title={`admin-map-${order.id}`}
                    width="100%"
                    height="250"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      order.destination_address || order.destination
                    )}&z=15&output=embed`}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}