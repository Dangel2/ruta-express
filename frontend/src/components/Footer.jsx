
function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-red-600/20 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Marca */}
          <div>
            <h3 className="text-3xl font-extrabold text-red-600">
              Ruta Express
            </h3>

            <p className="text-gray-400 mt-4 leading-relaxed">
              Servicio de mandados, compras, entregas y trámites
              diseñado para ayudarte a ahorrar tiempo.
              Tú lo pides, nosotros hacemos el viaje por ti.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">
              Servicios
            </h4>

            <ul className="space-y-3 text-gray-400">
              <li>Compras en supermercados</li>
              <li>Compras en farmacias</li>
              <li>Entrega de paquetes</li>
              <li>Pago de servicios</li>
              <li>Mandados personales</li>
            </ul>
          </div>

          {/* Cobertura */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">
              Cobertura
            </h4>

            <ul className="space-y-3 text-gray-400">
              <li>Diriamba</li>
              <li>Jinotepe</li>
              <li>Dolores</li>
              <li>San Marcos</li>
              <li>La Paz de Carazo</li>
              <li>El Rosario</li>
              <li>Managua</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">
              Contacto
            </h4>

            <div className="space-y-3 text-gray-400">
              <p> WhatsApp</p>
              <p>+505 8610 9523</p>

              <p> Correo</p>
              <p>engelcexs@gmail.com</p>

              <p> Atención</p>
              <p>Todos los días</p>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 Ruta Express. Todos los derechos reservados.
          </p>

          <p className="text-gray-500 text-sm">
            Rápido • Seguro • Confiable
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;