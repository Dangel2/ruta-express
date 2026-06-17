import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#080808] text-white px-4 py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.12),transparent_35%)]" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-5">
            Ruta Express • Mandados rápidos y seguros
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Delivery, mandados y envíos en{" "}
            <span className="text-red-600">Carazo</span> y toda Nicaragua
          </h1>

          <p className="text-gray-300 text-lg mt-5 max-w-xl">
            Pedí compras, retiros, pagos, entregas, trámites sencillos y servicios
            personalizados desde una sola plataforma.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              to="/create-order"
              className="inline-flex justify-center bg-red-600 hover:bg-red-700 transition px-6 py-4 rounded-xl font-bold shadow-lg shadow-red-950/30"
            >
              Solicitar servicio
            </Link>

            <a
              href="#tarifas"
              className="inline-flex justify-center bg-[#151515] hover:bg-[#202020] border border-red-600/40 transition px-6 py-4 rounded-xl font-bold">
               Ver Tarifas
               </a>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl">
            <div className="bg-[#151515] border border-red-600/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-red-500">24/7</p>
              <p className="text-gray-400 text-sm">Solicitud online</p>
            </div>

            <div className="bg-[#151515] border border-red-600/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-red-500">GPS</p>
              <p className="text-gray-400 text-sm">Rutas con mapa</p>
            </div>

            <div className="bg-[#151515] border border-red-600/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-red-500">Live</p>
              <p className="text-gray-400 text-sm">Estados en tiempo real</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#181818] to-[#0f0f0f] border border-red-600/30 rounded-3xl p-6 shadow-2xl shadow-red-950/20">
          <div className="bg-black/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Ejemplo de solicitud</p>

            <div className="mt-4 space-y-3">
              <div className="bg-[#151515] border border-gray-800 rounded-xl p-4">
                <p className="text-red-400 text-sm font-bold">Punto A</p>
                <p className="text-white">Supermercado / farmacia / tienda</p>
              </div>

              <div className="bg-[#151515] border border-gray-800 rounded-xl p-4">
                <p className="text-red-400 text-sm font-bold">Punto B</p>
                <p className="text-white">Tu casa, negocio o ubicación actual</p>
              </div>

              <div className="bg-green-600/10 border border-green-500/40 rounded-xl p-4">
                <p className="text-green-400 font-bold">Estado: En camino</p>
                <p className="text-gray-300 text-sm mt-1">
                  Tu pedido se actualiza automáticamente sin recargar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
