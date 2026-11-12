import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MoveDown } from 'lucide-react';
import { products, asset } from '../lib/products';
import { ProductCard } from '../components/products/ProductCard';
import { usePageTitle } from '../hooks/usePageTitle';
export function Home() {
  usePageTitle('Ropa con historia');
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newProducts = products
    .filter((p) => p.addedAt && !Number.isNaN(Date.parse(p.addedAt)))
    .sort((a, b) => Date.parse(b.addedAt!) - Date.parse(a.addedAt!))
    .slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span /> VINTAGE POR NATURALEZA
          </div>
          <h1>
            Ropa con
            <br />
            <em>historia.</em>
            <br />
            Estilo propio.
          </h1>
          <p>
            Prendas que ya han vivido.
            <br />Y aún tienen mucho que contar.
          </p>
          <Link className="button button-red" to="/catalogo">
            Encuentra la tuya <ArrowRight size={19} />
          </Link>
          <Link className="hero-scroll" to="/#seleccion">
            <MoveDown size={15} /> DESLIZA. SIGUE LA HISTORIA.
          </Link>
        </div>
        <div className="hero-image">
          <img
            src={asset('images/editorial-hero.webp')}
            alt="Estilo vintage en un bosque: chaqueta marrón entre helechos"
            fetchPriority="high"
          />
          <div className="hero-image-caption">
            <span>PRE-LOVED. RE-LOVED.</span>
            <span>
              El próximo capítulo es tuyo. <ArrowUpRight size={17} />
            </span>
          </div>
          <span className="editorial-credit">EDITORIAL · IMAGEN DE INSPIRACIÓN</span>
        </div>
      </section>
      <div className="brand-strip">
        <span>Menos nuevo. Más tú.</span>
        <span>
          CUERO CON CARÁCTER <i /> DENIM DE SIEMPRE <i /> PUNTO PARA QUEDARSE
        </span>
        <ArrowDownMark />
      </div>
      <section className="selection-section section-wrap" id="seleccion">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EL OJO DE REVY</span>
            <h2>Una buena selección.</h2>
          </div>
          <Link className="text-link" to="/catalogo">
            Ver todas las prendas <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="product-grid home-products">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <p className="catalog-disclosure">
          Un primer vistazo al armario. Precios de demostración; las fotografías de stock se indican
          como ilustrativas.
        </p>
      </section>
      <section className="collections section-wrap">
        <div className="collection-intro">
          <span className="eyebrow">DOS ARMARIOS. EL MISMO ESPÍRITU.</span>
          <h2>A tu manera.</h2>
          <p>
            Sin seguir el ritmo de nadie.
            <br />
            Encuentra lo que va contigo.
          </p>
        </div>
        <Link className="collection-card collection-men" to="/hombre">
          <img
            src={asset('images/editorial-field.webp')}
            alt="Chaqueta de cuero y vaqueros en un paisaje natural"
            loading="lazy"
          />
          <div>
            <span>01 / EL ARMARIO</span>
            <h3>
              Hombre <ArrowUpRight size={32} />
            </h3>
          </div>
        </Link>
        <Link className="collection-card collection-women" to="/mujer">
          <img
            src={asset('images/editorial-mujer.webp')}
            alt="Estilismo de mujer con chaqueta vintage en el bosque"
            loading="lazy"
          />
          <div>
            <span>02 / EL ARMARIO</span>
            <h3>
              Mujer <ArrowUpRight size={32} />
            </h3>
          </div>
        </Link>
      </section>
      {newProducts.length > 0 && (
        <section className="section-wrap selection-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">RECIÉN LLEGADAS</span>
              <h2>Nuevos capítulos.</h2>
            </div>
            <Link className="text-link" to="/catalogo?orden=novedades">
              Ver novedades <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="product-grid">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      <section className="philosophy">
        <div className="philosophy-visual">
          <img
            src={asset('images/landscape-lake.webp')}
            alt="Bosque de pinos y lago entre montañas, inspiración natural de REVY"
            loading="lazy"
          />
          <span className="eyebrow">NO ES SOLO ROPA.</span>
        </div>
        <div className="philosophy-copy">
          <span className="eyebrow">ES OTRA FORMA DE MIRARLA.</span>
          <h2>
            Las buenas prendas
            <br />
            merecen <em>otra vida.</em>
          </h2>
          <p>
            Creemos en la ropa que dura más que una temporada. En el encanto de lo vivido. En elegir
            por ti, sin seguir todos los pasos de la moda.
          </p>
          <p>
            REVY nace de una idea sencilla: dar otra oportunidad a lo que todavía tiene mucho por
            delante.
          </p>
          <Link className="text-link" to="/nosotros">
            Esta es nuestra historia <ArrowUpRight size={19} />
          </Link>
          <div className="values-line">
            <span>REAL</span>
            <i />
            <span>RENOVABLE</span>
            <i />
            <span>FAMILIAR</span>
          </div>
        </div>
      </section>
      <section className="closing-note section-wrap">
        <span className="eyebrow">PRE-LOVED. RE-LOVED.</span>
        <p>
          La próxima historia
          <br />
          <em>la escribes tú.</em>
        </p>
        <Link className="button button-outline" to="/catalogo">
          Volver al armario <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
function ArrowDownMark() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
      <path d="M8 0v16m-6-6 6 6 6-6" stroke="currentColor" />
    </svg>
  );
}
