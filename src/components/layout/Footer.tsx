import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { asset } from '../../lib/products';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" aria-label="REVY — Inicio">
            <img
              src={asset('brand/logo-negative.png')}
              alt="revy"
              width="166"
              height="94"
              loading="lazy"
            />
          </Link>
          <p>
            Buenas prendas.
            <br />
            Nuevos capítulos.
          </p>
        </div>
        <div>
          <h2>El armario</h2>
          <Link to="/hombre">Hombre</Link>
          <Link to="/mujer">Mujer</Link>
          <Link to="/catalogo">Todo el catálogo</Link>
          <Link to="/favoritos">Tus favoritos</Link>
        </div>
        <div>
          <h2>El espíritu</h2>
          <Link to="/nosotros">
            Nuestra historia <ArrowUpRight size={13} />
          </Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/nosotros#valores">Lo que nos mueve</Link>
        </div>
        <div className="footer-note">
          <span className="eyebrow">UNA SEGUNDA VIDA. TU ESTILO.</span>
          <p>
            La ropa no es de un solo uso.
            <br />
            Las buenas historias, tampoco.
          </p>
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'instant'
                  : 'smooth',
              })
            }
          >
            Volver arriba <ArrowUp size={16} />
          </button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} REVY</span>
        <span>Tienda de demostración · Sin compras reales</span>
        <span>Real. Renovable. Familiar.</span>
      </div>
    </footer>
  );
}
