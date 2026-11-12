import { Heart, ArrowUpRight, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { asset, money } from '../../lib/products';
import { useShop } from '../../context/ShopContext';
export function ProductImage({
  product,
  className = '',
  eager = false,
  index = 0,
}: {
  product: Product;
  className?: string;
  eager?: boolean;
  index?: number;
}) {
  const image = product.images[index];
  return image ? (
    <img
      className={`${product.imageIsGenerated ? 'generated-product-image' : ''} ${className}`.trim()}
      src={asset(image)}
      alt={`${product.name}${product.imageIsGenerated ? ' — imagen ilustrativa generada con IA' : product.imageIsIllustrative ? ' — imagen ilustrativa' : ''}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  ) : (
    <div className={`image-placeholder ${className}`}>
      <Shirt size={58} strokeWidth={0.7} />
      <span>Fotografía pendiente</span>
    </div>
  );
}
export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { favorites, toggleFavorite } = useShop();
  const saved = favorites.includes(product.id);
  return (
    <article className="product-card">
      <div className="product-photo">
        <Link to={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}>
          <ProductImage product={product} eager={eager} />
          {product.images.length > 1 && (
            <ProductImage product={product} index={1} className="second-photo" />
          )}
        </Link>
        <button
          className={`favorite-button ${saved ? 'is-saved' : ''}`}
          aria-label={`${saved ? 'Quitar de' : 'Añadir a'} favoritos: ${product.name}`}
          aria-pressed={saved}
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart size={19} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
        {product.imageIsIllustrative && (
          <span className="image-label">
            {product.imageIsGenerated ? 'Imagen ilustrativa · IA' : 'Imagen ilustrativa'}
          </span>
        )}
      </div>
      <div className="product-meta">
        <span>
          {product.category} <span className="meta-dot">·</span> {product.gender}
        </span>
      </div>
      <Link className="product-title" to={`/producto/${product.slug}`}>
        {product.name}
        <ArrowUpRight size={16} />
      </Link>
      <p className="product-price">
        {money(product.price)}
        {product.priceIsDemo && <span>Precio demo</span>}
      </p>
    </article>
  );
}
