function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Creá tu cuenta o iniciá sesión",
      description:
        "Entrá a la plataforma de Ruta Express para poder solicitar mandados, revisar tu historial y recibir cambios de estado en tiempo real."
    },
    {
      number: "02",
      title: "Seleccioná el tipo de servicio",
      description:
        "Elegí si necesitás una compra, entrega de paquete, farmacia, trámite, pago o mandado personal. El sistema mostrará la tarifa configurada."
    },
    {
      number: "03",
      title: "Indicá Punto A y Punto B",
      description:
        "El Punto A es donde se realiza el mandado o retiro. El Punto B es donde se entrega o finaliza el servicio. También podés usar tu ubicación actual."
    },
    {
      number: "04",
      title: "Describí exactamente tu mandado",
      description:
        "Agregá detalles claros: qué comprar, qué retirar, referencias del lugar, cantidades, nombre del producto o cualquier instrucción importante."
    },
    {
      number: "05",
      title: "Revisá y confirmá",
      description:
        "Antes de enviar, verás un resumen con servicio, ruta, descripción, tarifa y precio final para confirmar que todo está correcto."
    },
    {
      number: "06",
      title: "Seguimiento en tiempo real",
      description:
        "Cuando el administrador cambie el estado a Recibido, En camino o Entregado, tu pantalla se actualizará automáticamente sin recargar."
    }
  ];

  return (
    <section id="como-funciona" className="bg-[#080808] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Paso a paso
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Cómo <span className="text-red-600">Funciona?</span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
            La página está diseñada para que el cliente pueda solicitar un servicio
            rápido, claro y con seguimiento automático desde el inicio hasta la entrega.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => (
            <article
              key={step.number}
              className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 shadow-xl shadow-red-950/10"
            >
              <p className="text-red-600 font-extrabold text-3xl">
                {step.number}
              </p>

              <h3 className="text-xl font-bold mt-4">
                {step.title}
              </h3>

              <p className="text-gray-400 mt-3">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
