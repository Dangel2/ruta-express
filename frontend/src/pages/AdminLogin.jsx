import { useState } from "react";
import { adminLogin } from "../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const result = await adminLogin({
      email,
      password
    });

    if (result.token) {
      localStorage.setItem("adminToken", result.token);

      alert("Admin conectado");
    } else {
      alert(result.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">
        Login Administrador
      </h2>

      <form onSubmit={handleLogin}>
        <input
          className="w-full border p-2 mb-3"
          placeholder="Correo admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          Entrar Admin
        </button>
      </form>
    </div>
  );
}