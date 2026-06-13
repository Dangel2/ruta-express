function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
   RUTA EXPRESS
</div>

      <ul className="nav-links">
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#tarifas">Tarifas</a></li>
        <li><a href="#promociones">Promociones</a></li>
        <li><a href="#cobertura">Cobertura</a></li>
      </ul>

      <a
        href="https://wa.me/50586109523"
        className="whatsapp-btn"
        target="_blank"
      >
        WhatsApp
      </a>
    </nav>
  );
}

export default Navbar;
