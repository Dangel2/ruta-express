export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mt-10 text-center">
      <h1 className="text-5xl font-bold text-red-600">
        Ruta Express
      </h1>

      <p className="mt-4 text-xl">
        Si no tienes tiempo,
        nosotros hacemos el viaje por ti.
      </p>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Servicios
        </h2>

        <ul className="mt-4">
          <li>Mandados</li>
          <li>Compras</li>
          <li>Envíos</li>
          <li>Trámites</li>
        </ul>
      </div>
    </div>
  );
}