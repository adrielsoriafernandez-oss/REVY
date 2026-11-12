import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Minus, Plus, Trash2, Info } from 'lucide-react';
import { useShop, cartKey } from '../context/ShopContext';
import { products, money } from '../lib/products';
import { ProductImage } from '../components/products/ProductCard';
import { usePageTitle } from '../hooks/usePageTitle';
export function Cart() {
  usePageTitle('Tu bolsa');
  const { cart, updateQuantity, removeFromCart } = useShop();
  const total = cart.reduce(
    (sum, item) => sum + (products.find((p) => p.id === item.id)?.price || 0) * item.quantity,
    0,
  );
  return (
    <div className="cart-page section-wrap">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <span>Tu bolsa</span>
      </div>
      <div className="page-heading">
        <span className="eyebrow">EL SIGUIENTE CAPÍTULO</span>
        <h1>Una bolsa de historias.</h1>
        <p>
          {cart.length
            ? 'Prendas que van contigo. Y con lo que está por venir.'
            : 'Todavía queda sitio para algo muy tuyo.'}
        </p>
      </div>
      {!cart.length ? (
        <div className="empty-state">
          <ShoppingBag size={44} strokeWidth={1} />
          <h2>Tu bolsa está esperando una buena historia.</h2>
          <p>Date una vuelta por el armario.</p>
          <Link className="button button-red" to="/catalogo">
            Encontrar mi prenda <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            <div className="cart-table-head">
              <span>PRENDA</span>
              <span>CANTIDAD / TOTAL</span>
            </div>
            {cart.map((item) => {
              const p = products.find((p) => p.id === item.id)!;
              const key = cartKey(item);
              return (
                <article className="cart-row" key={key}>
                  <Link to={`/producto/${p.slug}`} className="cart-image">
                    <ProductImage product={p} />
                  </Link>
                  <div className="cart-product">
                    <span className="eyebrow">
                      {p.gender} · {p.category}
                    </span>
                    <Link to={`/producto/${p.slug}`}>{p.name}</Link>
                    <p>
                      {money(p.price)} <small>{p.priceIsDemo ? 'Precio demo' : ''}</small>
                    </p>
                    {item.size && <p>Talla: {item.size}</p>}
                    <button className="remove-link" onClick={() => removeFromCart(key)}>
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </div>
                  <div className="cart-quantity">
                    <div className="quantity-control">
                      <button
                        aria-label={`Reducir cantidad de ${p.name}`}
                        onClick={() => updateQuantity(key, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-label={`Cantidad de ${p.name}`}>{item.quantity}</span>
                      <button
                        aria-label={`Aumentar cantidad de ${p.name}`}
                        disabled={item.quantity >= 99}
                        onClick={() => updateQuantity(key, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <strong>{money((p.price || 0) * item.quantity)}</strong>
                  </div>
                </article>
              );
            })}
            <Link className="text-link continue-shopping" to="/catalogo">
              Seguir explorando <ArrowRight size={17} />
            </Link>
          </div>
          <aside className="cart-summary">
            <h2>Tu selección</h2>
            <div>
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <div>
              <span>Envío</span>
              <span>No disponible</span>
            </div>
            <div className="cart-total">
              <span>Total orientativo</span>
              <strong>{money(total)}</strong>
            </div>
            <button className="button checkout-button" disabled>
              Compra no disponible en la demo
            </button>
            <p>
              <Info size={16} />
              <span>
                Este carrito permite probar la experiencia. No procesa pagos, pedidos ni reservas.
              </span>
            </p>
            <span className="summary-signoff">Buenas prendas. Nuevos capítulos.</span>
          </aside>
        </div>
      )}
    </div>
  );
}
