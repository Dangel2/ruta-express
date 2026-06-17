import { useEffect, useState } from "react";
import { getPublicPromotions } from "../services/api";

function Promotions() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    async function loadPromotions() {
      const result = await getPublicPromotions();
      setPromotions(result.promotions || []);
    }

    loadPromotions();
  }, []);

  return (
    <section id="promociones" className="bg-[#080808] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Promociones activas
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Promociones <span className="text-red-600">Ruta Express</span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Las promociones se cargan automáticamente desde el Dashboard administrador.
          </p>
        </div>

        {promotions.length === 0 ? (
          <div className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-8 text-center shadow-xl shadow-red-950/10">
            <p className="text-gray-400">
              No hay promociones activas por el momento.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotions.map((promo) => (
              <article
                key={promo.id}
                className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 shadow-xl shadow-red-950/10 hover:bg-red-600/5 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 font-bold mb-5">
                  %
                </div>

                <h3 className="text-xl font-bold text-white">
                  {promo.title}
                </h3>

                <p className="text-gray-400 mt-3">
                  {promo.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Promotions;
