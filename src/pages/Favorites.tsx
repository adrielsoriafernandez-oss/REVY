import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products } from '../lib/products';
import { ProductCard } from '../components/products/ProductCard';
import { usePageTitle } from '../hooks/usePageTitle';
export function Favorites() {
  usePageTitle('Tus favoritos');
  const { favorites } = useShop();
  const items = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="section-wrap favorites-page">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <span>Favoritos</span>
      </div>
      <div className="page-heading">
        <span className="eyebrow">PARA VOLVER A MIRAR</span>
        <h1>Flechazos con historia.</h1>
        <p>
          {items.length
            ? `${items.length} ${items.length === 1 ? 'prenda que te ha' : 'prendas que te han'} hecho parar un momento.`
            : 'Aquí guardamos las prendas que te hacen volver.'}
        </p>
      </div>
      {items.length ? (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={44} strokeWidth={1} />
          <h2>Tu primer flechazo está por llegar.</h2>
          <p>Pulsa el corazón de una prenda para tenerla siempre a mano.</p>
          <Link className="button button-red" to="/catalogo">
            Explorar el armario <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
