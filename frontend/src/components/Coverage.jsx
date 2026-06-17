function Coverage() {
  const places = [
    "Diriamba",
    "Jinotepe",
    "Dolores",
    "San Marcos",
    "La Paz de Carazo",
    "El Rosario",
    "Managua"
  ];

  return (
    <section id="cobertura" className="bg-[#080808] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Zonas disponibles
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Nuestra <span className="text-red-600">Cobertura</span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Atendemos principalmente Carazo y también servicios especiales hacia Managua.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {places.map((place, index) => (
            <article
              key={place}
              className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 shadow-xl shadow-red-950/10"
            >
              <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 font-bold mb-4">
                {index + 1}
              </div>

              <h3 className="text-xl font-bold">
                {place}
              </h3>

              <p className="text-gray-400 mt-2">
                Cobertura disponible según distancia, horario y tipo de servicio.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Coverage;
