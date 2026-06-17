function Stats() {
  const stats = [
    {
      value: "500+",
      label: "Mandados realizados",
      description: "Servicios completados entre compras, entregas, pagos y trámites."
    },
    {
      value: "100+",
      label: "Clientes satisfechos",
      description: "Personas que confían en Ruta Express para ahorrar tiempo."
    },
    {
      value: "7+",
      label: "Municipios cubiertos",
      description: "Cobertura principal en Carazo y extensión hacia Managua."
    }
  ];

  return (
    <section className="bg-[#080808] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Confianza en números
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Nuestros <span className="text-red-600">Números</span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Cada servicio cuenta. Estos datos representan el crecimiento y la confianza
            que Ruta Express está construyendo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 shadow-xl shadow-red-950/10 hover:bg-red-600/5 transition"
            >
              <p className="text-5xl font-extrabold text-red-600">
                {stat.value}
              </p>

              <h3 className="text-xl font-bold text-white mt-4">
                {stat.label}
              </h3>

              <p className="text-gray-400 mt-3">
                {stat.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
