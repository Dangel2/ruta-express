import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await loginUser({
      email,
      password
    });

    if (result.token) {
      localStorage.setItem("token", result.token);

      alert("Inicio de sesión correcto");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Iniciar Sesión
      </h2>

      <form onSubmit={handleLogin}>
        <input
          className="w-full border p-2 mb-3"
          type="email"
          placeholder="Correo"
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
          Entrar
        </button>
      </form>
    </div>
  );
}