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
    <section id="promociones">
      <h2>Promociones</h2>

      {promotions.length === 0 ? (
        <div className="promo-card">
          No hay promociones activas por el momento.
        </div>
      ) : (
        promotions.map((promo) => (
          <div className="promo-card" key={promo.id}>
            <strong>{promo.title}</strong>
            <p>{promo.description}</p>
          </div>
        ))
      )}
    </section>
  );
}

export default Promotions;