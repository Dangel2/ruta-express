import { useState } from "react";
import { createOrder } from "../services/api";

export default function CreateOrder() {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    description: "",
    price: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createOrder({
      ...form,
      price: Number(form.price)
    });

    alert(result.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Crear Pedido
      </h2>

      <form onSubmit={handleSubmit}>
        <input className="w-full border p-2 mb-3" name="origin" placeholder="Origen" onChange={handleChange} />
        <input className="w-full border p-2 mb-3" name="destination" placeholder="Destino" onChange={handleChange} />
        <textarea className="w-full border p-2 mb-3" name="description" placeholder="Descripción del mandado" onChange={handleChange} />
        <input className="w-full border p-2 mb-3" name="price" type="number" placeholder="Precio estimado" onChange={handleChange} />

        <button className="bg-red-600 text-white px-4 py-2 rounded w-full" type="submit">
          Enviar Pedido
        </button>
      </form>
    </div>
  );
}