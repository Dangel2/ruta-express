import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await registerUser(form);

    alert(result.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Registro Ruta Express
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 mb-3"
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 mb-3"
          type="text"
          name="phone"
          placeholder="Teléfono"
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 mb-3"
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />

        <button
          className="bg-red-600 text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}