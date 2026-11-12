import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Check, X, ArrowRight } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useShop } from '../../context/ShopContext';
export function Layout() {
  const { toast, dismissToast, storageError } = useShop();
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);
  return (
    <>
      <Link
        className="skip-link"
        to={{ pathname: location.pathname, search: location.search, hash: '#contenido' }}
        onClick={() => requestAnimationFrame(() => document.getElementById('contenido')?.focus())}
      >
        Saltar al contenido
      </Link>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {storageError && (
        <p className="storage-warning" role="status">
          Tu navegador no permite guardar la bolsa. Se conservará durante esta visita.
        </p>
      )}
      <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <Check size={20} />
            <span>{toast}</span>
            <Link to="/carrito" onClick={dismissToast}>
              Ver bolsa <ArrowRight size={16} />
            </Link>
            <button className="icon-button" aria-label="Cerrar aviso" onClick={dismissToast}>
              <X size={17} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
