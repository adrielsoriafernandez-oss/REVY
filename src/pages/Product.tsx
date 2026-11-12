import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
import { products, money } from '../lib/products';
import { useShop } from '../context/ShopContext';
import { ProductCard, ProductImage } from '../components/products/ProductCard';
import { usePageTitle } from '../hooks/usePageTitle';
import { NotFound } from './StaticPages';
export function Product() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  return product ? <ProductDetail key={product.id} product={product} /> : <NotFound />;
}
function ProductDetail({ product }: { product: (typeof products)[number] }) {
  const [image, setImage] = useState(0),
    [size, setSize] = useState(''),
    [sizeError, setSizeError] = useState(false),
    [openDetail, setOpenDetail] = useState('details');
  const { favorites, toggleFavorite, addToCart } = useShop();
  usePageTitle(product.name);
  const related = products
    .filter((p) => p.id !== product.id && p.gender === product.gender)
    .sort(
      (a, b) => Number(b.category === product.category) - Number(a.category === product.category),
    )
    .slice(0, 4);
  const saved = favorites.includes(product.id);
  return (
    <>
      <div className="product-page section-wrap">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to={`/${product.gender}`}>{product.gender === 'hombre' ? 'Hombre' : 'Mujer'}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <div className="product-detail">
          <div className="product-gallery">
            <div className="gallery-main">
              <ProductImage product={product} index={image} eager />
              {product.imageIsIllustrative && (
                <span className="image-label">
                  {product.imageIsGenerated ? 'Imagen ilustrativa · IA' : 'Imagen ilustrativa'}
                </span>
              )}
              {product.images.length > 1 && (
                <div className="gallery-controls">
                  <button
                    className="icon-button"
                    aria-label="Fotografía anterior"
                    onClick={() =>
                      setImage((i) => (i - 1 + product.images.length) % product.images.length)
                    }
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span>
                    {image + 1} / {product.images.length}
                  </span>
                  <button
                    className="icon-button"
                    aria-label="Siguiente fotografía"
                    onClick={() => setImage((i) => (i + 1) % product.images.length)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    className={i === image ? 'active' : ''}
                    aria-label={`Ver fotografía ${i + 1}`}
                    aria-pressed={i === image}
                    onClick={() => setImage(i)}
                  >
                    <ProductImage product={product} index={i} />
                  </button>
                ))}
              </div>
            )}
            <p className="gallery-caption">
              {product.imageIsGenerated
                ? 'Imagen ilustrativa generada con IA a partir del nombre de la prenda. No representa el artículo real de REVY.'
                : product.imageIsIllustrative
                  ? 'Fotografía de inspiración. La prenda mostrada no es el artículo exacto de REVY.'
                  : 'Cada prenda tiene su propia historia.'}
            </p>
          </div>
          <div className="product-info">
            <span className="eyebrow">
              {product.category} · {product.gender}
            </span>
            <h1>{product.name}</h1>
            <p className="detail-price">
              {money(product.price)}
              {product.priceIsDemo && <span>Precio de demostración</span>}
            </p>
            <p className="product-description">
              {product.description ||
                'Una prenda seleccionada para seguir sumando historias. Forma parte del armario REVY: ropa con pasado y espacio para un nuevo capítulo.'}
            </p>
            <div className="size-area">
              <span>Talla</span>
              {product.sizes?.length ? (
                <div className="size-options" role="group" aria-label="Elige una talla">
                  {product.sizes.map((s) => (
                    <button
                      className={size === s ? 'selected' : ''}
                      aria-pressed={size === s}
                      key={s}
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <p>Pendiente de confirmar</p>
              )}
              {sizeError && (
                <p role="alert" className="field-error">
                  Selecciona una talla para añadir la prenda.
                </p>
              )}
            </div>
            <div className="product-purchase">
              <button
                className="button button-red"
                onClick={() => {
                  if (product.sizes?.length && !size) {
                    setSizeError(true);
                    return;
                  }
                  addToCart(product, size || undefined);
                }}
              >
                <ShoppingBag size={18} /> Añadir a la bolsa <ArrowUpRight size={19} />
              </button>
              <button
                className={`favorite-detail ${saved ? 'is-saved' : ''}`}
                aria-label={saved ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                aria-pressed={saved}
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart size={22} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="demo-note">
              <Info size={16} />
              <span>
                Esta es una tienda de demostración. No se realizan compras ni se confirma
                disponibilidad.
              </span>
            </div>
            <div className="product-accordions">
              {[
                ['details', 'Lo que sabemos de esta prenda'],
                ['secondlife', 'Una segunda vida'],
              ].map(([key, title]) => (
                <div className="accordion" key={key}>
                  <button
                    aria-expanded={openDetail === key}
                    aria-controls={`panel-${key}`}
                    onClick={() => setOpenDetail(openDetail === key ? '' : key)}
                  >
                    {title}
                    {openDetail === key ? <Minus size={17} /> : <Plus size={17} />}
                  </button>
                  <div id={`panel-${key}`} hidden={openDetail !== key}>
                    {key === 'details' ? (
                      <dl>
                        <div>
                          <dt>Armario</dt>
                          <dd>{product.gender === 'hombre' ? 'Hombre' : 'Mujer'}</dd>
                        </div>
                        <div>
                          <dt>Categoría</dt>
                          <dd>{product.category}</dd>
                        </div>
                        <div>
                          <dt>Color</dt>
                          <dd>{product.color || 'Pendiente de confirmar'}</dd>
                        </div>
                        <div>
                          <dt>Estado</dt>
                          <dd>{product.condition || 'Pendiente de confirmar'}</dd>
                        </div>
                        <div>
                          <dt>Disponibilidad</dt>
                          <dd>Pendiente de confirmar</dd>
                        </div>
                      </dl>
                    ) : (
                      <p>
                        Elegir segunda mano es alargar el recorrido de una prenda. En REVY nos gusta
                        lo auténtico, lo que tiene carácter y lo que todavía puede acompañarte mucho
                        tiempo.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="section-wrap related-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SIGUE EXPLORANDO</span>
            <h2>Van con tu historia.</h2>
          </div>
          <Link className="text-link" to={`/${product.gender}`}>
            Ver el armario <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
