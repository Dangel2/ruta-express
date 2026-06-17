function Services() {
  const services = [
    {
      title: "Compras en supermercados",
      description: "Te ayudamos con compras de alimentos, productos del hogar y artículos básicos."
    },
    {
      title: "Compras en farmacias",
      description: "Retiro de medicinas, productos personales y artículos de farmacia."
    },
    {
      title: "Entrega de paquetes",
      description: "Movemos paquetes, documentos o artículos entre puntos de entrega."
    },
    {
      title: "Pago de servicios",
      description: "Apoyo para pagos, recargas o gestiones sencillas según disponibilidad."
    },
    {
      title: "Trámites sencillos",
      description: "Mandados rápidos donde necesites retirar, entregar o confirmar algo."
    },
    {
      title: "Mandados personales",
      description: "Servicios personalizados para resolver lo que no podés hacer en el momento."
    }
  ];

  return (
    <section id="servicios" className="bg-[#080808] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Todo en un solo lugar
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Nuestros <span className="text-red-600">Servicios</span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Elegí el tipo de mandado, agregá los puntos de ruta y describí lo que necesitás.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 shadow-xl shadow-red-950/10 hover:bg-red-600/5 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 font-bold mb-5">
                {index + 1}
              </div>

              <h3 className="text-xl font-bold text-white">
                {service.title}
              </h3>

              <p className="text-gray-400 mt-3">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
