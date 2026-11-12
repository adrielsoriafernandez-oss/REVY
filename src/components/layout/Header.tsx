import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, ArrowRight, X } from 'lucide-react';
import { asset, money, products } from '../../lib/products';
import { useShop, cartKey } from '../../context/ShopContext';
import { Drawer } from '../ui/Drawer';
import { ProductImage } from '../products/ProductCard';
export function Header() {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [bag, setBag] = useState(false),
    [query, setQuery] = useState('');
  const { favorites, cart, removeFromCart } = useShop();
  const navigate = useNavigate();
  const quantity = cart.reduce((sum, i) => sum + i.quantity, 0);
  return (
    <>
      <div className="announcement">
        <span>SEGUNDA MANO. PRIMERA ELECCIÓN.</span>
        <Link to="/nosotros">
          Conoce el espíritu REVY <ArrowUpRightSmall />
        </Link>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="icon-button mobile-menu"
            aria-label="Abrir menú"
            onClick={() => setMenu(true)}
          >
            <Menu size={23} />
          </button>
          <nav className="main-nav" aria-label="Navegación principal">
            <NavLink to="/hombre">Hombre</NavLink>
            <NavLink to="/mujer">Mujer</NavLink>
            <NavLink to="/catalogo">Catálogo</NavLink>
          </nav>
          <Link className="brand" to="/" aria-label="REVY — Inicio">
            <img src={asset('brand/logo.png')} alt="revy" width="143" height="80" />
          </Link>
          <div className="header-actions">
            <NavLink to="/nosotros" className="story-link">
              Nuestra historia
            </NavLink>
            <button
              className="icon-button"
              aria-label="Abrir búsqueda"
              onClick={() => setSearch(true)}
            >
              <Search size={21} />
            </button>
            <Link
              className="icon-button favorite-nav"
              to="/favoritos"
              aria-label={`Favoritos (${favorites.length})`}
            >
              <Heart size={21} />
              {favorites.length > 0 && <span className="count">{favorites.length}</span>}
            </Link>
            <button
              className="icon-button bag-button"
              aria-label={`Abrir bolsa (${quantity})`}
              onClick={() => setBag(true)}
            >
              <ShoppingBag size={21} />
              <span className="bag-count">{quantity}</span>
            </button>
          </div>
        </div>
      </header>
      <Drawer
        title="Explora REVY"
        open={menu}
        onClose={() => setMenu(false)}
        className="menu-drawer"
      >
        <nav className="mobile-nav">
          {[
            ['/', 'Inicio'],
            ['/hombre', 'Hombre'],
            ['/mujer', 'Mujer'],
            ['/catalogo', 'Todo el catálogo'],
            ['/nosotros', 'Nuestra historia'],
            ['/favoritos', 'Favoritos'],
            ['/carrito', 'Mi bolsa'],
            ['/contacto', 'Contacto'],
          ].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setMenu(false)}>
              {label}
              <ArrowRight size={22} />
            </Link>
          ))}
        </nav>
        <p className="eyebrow">ROPA CON HISTORIA. ESTILO PROPIO.</p>
      </Drawer>
      <Drawer
        title="¿Qué estás buscando?"
        open={search}
        onClose={() => setSearch(false)}
        className="search-drawer"
      >
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/catalogo${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
            setSearch(false);
          }}
        >
          <label htmlFor="global-search">Busca una prenda o categoría</label>
          <div className="search-input">
            <Search size={20} />
            <input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cuero, denim, punto…"
              autoComplete="off"
            />
            <button aria-label="Buscar productos">
              <ArrowRight size={22} />
            </button>
          </div>
        </form>
        <p className="eyebrow search-suggestions">POR DÓNDE EMPEZAR</p>
        <div className="suggestion-links">
          {['Chaquetas y abrigos', 'Pantalones y denim', 'Jerséis y punto'].map((c) => (
            <Link
              key={c}
              to={`/catalogo?categoria=${encodeURIComponent(c)}`}
              onClick={() => setSearch(false)}
            >
              {c}
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </Drawer>
      <Drawer title={`Tu bolsa (${quantity})`} open={bag} onClose={() => setBag(false)}>
        {!cart.length ? (
          <div className="drawer-empty">
            <ShoppingBag size={42} strokeWidth={1} />
            <h3>Una historia por empezar.</h3>
            <p>Tu próxima prenda favorita puede estar aquí.</p>
            <Link className="button button-red" to="/catalogo" onClick={() => setBag(false)}>
              Explorar prendas <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mini-cart">
              {cart.map((item) => {
                const p = products.find((p) => p.id === item.id)!;
                return (
                  <div className="mini-cart-row" key={cartKey(item)}>
                    <Link to={`/producto/${p.slug}`} onClick={() => setBag(false)}>
                      <ProductImage product={p} />
                    </Link>
                    <div>
                      <Link to={`/producto/${p.slug}`} onClick={() => setBag(false)}>
                        {p.name}
                      </Link>
                      <p>
                        {item.quantity} × {money(p.price)}
                        {item.size ? ` · ${item.size}` : ''}
                      </p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={`Eliminar ${p.name}`}
                      onClick={() => removeFromCart(cartKey(item))}
                    >
                      <X size={17} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="bag-summary">
              <p>
                Subtotal{' '}
                <strong>
                  {money(
                    cart.reduce(
                      (sum, i) =>
                        sum + (products.find((p) => p.id === i.id)?.price || 0) * i.quantity,
                      0,
                    ),
                  )}
                </strong>
              </p>
              <small>Precios de demostración. Compra no disponible.</small>
              <Link className="button button-red" to="/carrito" onClick={() => setBag(false)}>
                Ver mi bolsa <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
function ArrowUpRightSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 10 10 2M2 2h8v8" stroke="currentColor" />
    </svg>
  );
}
