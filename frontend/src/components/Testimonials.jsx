function Testimonials() {
  const reviews = [
    {
      name: "Cliente Ruta Express",
      rating: "★★★★★",
      text: "Excelente servicio, rápido y con buena comunicación durante todo el pedido."
    },
    {
      name: "Usuario frecuente",
      rating: "★★★★★",
      text: "Me ayudaron con un trámite urgente y pude ver el estado del servicio en la página."
    },
    {
      name: "Cliente satisfecho",
      rating: "★★★★★",
      text: "Muy responsable, confiable y claro con los puntos de entrega."
    }
  ];

  return (
    <section id="resenas" className="bg-[#080808] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Reseñas
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Lo que dicen <span className="text-red-600">nuestros clientes</span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Esta sección está preparada para mostrar opiniones de clientes que usen Ruta Express.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <article
              key={review.text}
              className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 shadow-xl shadow-red-950/10"
            >
              <p className="text-yellow-400 text-lg">
                {review.rating}
              </p>

              <p className="text-gray-300 mt-4">
                “{review.text}”
              </p>

              <p className="text-red-500 font-bold mt-5">
                {review.name}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 bg-[#151515] border border-gray-800 rounded-2xl p-4 text-gray-400 text-sm">
          Próximamente se puede conectar esta sección a un formulario de reseñas
          para que los clientes dejen su opinión y aparezca automáticamente aquí.
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
