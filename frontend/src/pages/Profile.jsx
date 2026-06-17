import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword
} from "../services/api";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    created_at: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const result = await getMyProfile();

      if (result.customer) {
        setForm({
          name: result.customer.name || "",
          phone: result.customer.phone || "",
          email: result.customer.email || "",
          created_at: result.customer.created_at || ""
        });
      }
    }

    loadProfile();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handlePasswordChange(e) {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  }

  function formatDate(date) {
    if (!date) return "No disponible";

    return new Date(date).toLocaleString("es-NI", {
      timeZone: "America/Managua",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }

  function getInitial() {
    return (form.name || form.email || "C").charAt(0).toUpperCase();
  }

  function getMessageClass(text) {
    if (text.toLowerCase().includes("correctamente")) {
      return "bg-green-600/10 border-green-500 text-green-400";
    }

    return "bg-red-600/10 border-red-500 text-red-400";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setMessage("Nombre y teléfono son obligatorios.");
      return;
    }

    try {
      setLoadingProfile(true);
      setMessage("");

      const result = await updateMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim()
      });

      if (result.customer) {
        setMessage("Perfil actualizado correctamente.");
        localStorage.setItem("customer", JSON.stringify(result.customer));

        setForm({
          name: result.customer.name || "",
          phone: result.customer.phone || "",
          email: result.customer.email || "",
          created_at: result.customer.created_at || form.created_at
        });
      } else {
        setMessage(result.message || "No se pudo actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setMessage("Ocurrió un error al actualizar el perfil.");
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordMessage("Completa todos los campos de contraseña.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    try {
      setLoadingPassword(true);
      setPasswordMessage("");

      const result = await changeMyPassword(passwordForm);

      if (result.message?.toLowerCase().includes("correctamente")) {
        setPasswordMessage("Contraseña actualizada correctamente.");

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setPasswordMessage(result.message || "No se pudo cambiar la contraseña.");
      }
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      setPasswordMessage("Ocurrió un error al cambiar la contraseña.");
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-red-600/10 border border-red-600/40 text-red-500 px-4 py-2 rounded-full text-sm font-bold mb-4">
            Cuenta Ruta Express
          </span>

          <h1 className="text-4xl md:text-5xl font-bold">
            Mi <span className="text-red-600">Perfil</span>
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Administra tus datos personales, protege tu cuenta y mantén tu progreso seguro.
          </p>
        </div>

        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          <aside className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 shadow-2xl shadow-red-950/20 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 text-5xl font-extrabold shadow-lg shadow-red-950/20">
                {getInitial()}
              </div>

              <h2 className="text-2xl font-bold mt-5">
                {form.name || "Cliente Ruta Express"}
              </h2>

              <p className="text-gray-400 mt-1">
                {form.email || "Correo no disponible"}
              </p>

              <span className="mt-4 inline-flex bg-green-600/10 border border-green-500/40 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                Cuenta activa
              </span>
            </div>

            <div className="mt-8 grid gap-3">
              <div className="bg-black/40 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Teléfono</p>
                <p className="font-bold text-white mt-1">
                  {form.phone || "No registrado"}
                </p>
              </div>

              <div className="bg-black/40 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Registrado desde</p>
                <p className="font-bold text-white mt-1">
                  {formatDate(form.created_at)}
                </p>
              </div>

              <div className="bg-black/40 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Progreso futuro</p>
                <p className="font-bold text-yellow-400 mt-1">
                  Monedas Ruta Express
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Esta cuenta quedará lista para conservar monedas, promociones e historial.
                </p>
              </div>
            </div>
          </aside>

          <div className="grid gap-6">
            <section className="bg-gradient-to-b from-[#181818] to-[#101010] border border-red-600/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-red-950/20">
              <h2 className="text-2xl font-bold text-white">
                Datos personales
              </h2>

              <p className="text-gray-400 mt-2 mb-6">
                Actualiza tu nombre y teléfono. El correo queda protegido como identificador de la cuenta.
              </p>

              {message && (
                <div className={`mb-5 p-3 rounded-lg text-center font-medium border ${getMessageClass(message)}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Nombre</label>
                  <input
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 mt-1"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">Teléfono</label>
                  <input
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none focus:border-red-600 mt-1"
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400">Correo</label>
                  <input
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 outline-none mt-1 opacity-60 cursor-not-allowed"
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                  />
                </div>

                <button
                  className="md:col-span-2 w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition rounded-lg p-3 font-bold"
                  type="submit"
                  disabled={loadingProfile}
                >
                  {loadingProfile ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </section>

            <section className="bg-gradient-to-b from-[#181818] to-[#101010] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-red-950/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Seguridad de la cuenta
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Cambia tu contraseña para proteger tu historial, pedidos y futuras monedas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswordSection((value) => !value)}
                  className="bg-[#151515] hover:bg-[#202020] border border-red-600/30 text-red-400 px-4 py-3 rounded-xl font-bold transition"
                >
                  {showPasswordSection ? "Ocultar" : "Cambiar contraseña"}
                </button>
              </div>

              {showPasswordSection && (
                <div className="mt-6">
                  {passwordMessage && (
                    <div className={`mb-5 p-3 rounded-lg text-center font-medium border ${getMessageClass(passwordMessage)}`}>
                      {passwordMessage}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="grid gap-4">
                    <div>
                      <label className="text-sm text-gray-400">
  Contraseña actual
</label>

<div className="relative">
  <input
    className="w-full bg-black border border-gray-700 rounded-lg p-3 pr-12 outline-none focus:border-red-600 mt-1"
    type={showCurrentPassword ? "text" : "password"}
    name="currentPassword"
    value={passwordForm.currentPassword}
    onChange={handlePasswordChange}
    required
  />

  <button
    type="button"
    onClick={() =>
      setShowCurrentPassword(!showCurrentPassword)
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    {showCurrentPassword ? "🙈" : "👁️"}
  </button>
</div>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm text-gray-400">
  Nueva contraseña
</label>

<div className="relative">
  <input
    className="w-full bg-black border border-gray-700 rounded-lg p-3 pr-12 outline-none focus:border-red-600 mt-1"
    type={showNewPassword ? "text" : "password"}
    name="newPassword"
    value={passwordForm.newPassword}
    onChange={handlePasswordChange}
    required
    minLength={6}
  />

  <button
    type="button"
    onClick={() =>
      setShowNewPassword(!showNewPassword)
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    {showNewPassword ? "🙈" : "👁️"}
  </button>
</div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">
  Confirmar nueva contraseña
</label>

<div className="relative">
  <input
    className="w-full bg-black border border-gray-700 rounded-lg p-3 pr-12 outline-none focus:border-red-600 mt-1"
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    value={passwordForm.confirmPassword}
    onChange={handlePasswordChange}
    required
    minLength={6}
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </button>
</div>
                      </div>
                    </div>

                    <button
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition rounded-lg p-3 font-bold"
                      type="submit"
                      disabled={loadingPassword}
                    >
                      {loadingPassword ? "Actualizando..." : "Actualizar contraseña"}
                    </button>
                  </form>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
