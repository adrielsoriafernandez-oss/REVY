import { useState, useId } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { products, normalize } from '../lib/products';
import { ProductCard } from '../components/products/ProductCard';
import { Drawer } from '../components/ui/Drawer';
import { usePageTitle } from '../hooks/usePageTitle';
type FilterPanelProps = {
  gender?: 'hombre' | 'mujer';
  selectedGender: string;
  category: string;
  categoryOptions: string[];
  genderProducts: typeof products;
  active: boolean;
  update: (key: string, value: string) => void;
  clear: () => void;
};
function FilterPanel({
  gender,
  selectedGender,
  category,
  categoryOptions,
  genderProducts,
  active,
  update,
  clear,
}: FilterPanelProps) {
  const scope = useId();
  return (
    <div className="filters-content">
      {!gender && (
        <fieldset>
          <legend>Armario</legend>
          {[
            ['', 'Todos'],
            ['hombre', 'Hombre'],
            ['mujer', 'Mujer'],
          ].map(([value, label]) => (
            <label key={value} className="filter-option">
              <input
                type="radio"
                name={`gender-${scope}`}
                value={value}
                checked={selectedGender === value}
                onChange={() => update('genero', value)}
              />
              <span>{label}</span>
              <small>{products.filter((p) => !value || p.gender === value).length}</small>
            </label>
          ))}
        </fieldset>
      )}
      <fieldset>
        <legend>Tipo de prenda</legend>
        <label className="filter-option">
          <input
            type="radio"
            name={`category-${scope}`}
            checked={!category}
            onChange={() => update('categoria', '')}
          />
          <span>Todas las prendas</span>
          <small>{genderProducts.length}</small>
        </label>
        {categoryOptions.map((value) => (
          <label key={value} className="filter-option">
            <input
              type="radio"
              name={`category-${scope}`}
              value={value}
              checked={category === value}
              onChange={() => update('categoria', value)}
            />
            <span>{value}</span>
            <small>{genderProducts.filter((p) => p.category === value).length}</small>
          </label>
        ))}
      </fieldset>
      {active && (
        <button className="clear-filters" onClick={clear}>
          Limpiar filtros <X size={14} />
        </button>
      )}
      <div className="filter-note">
        <span className="eyebrow">PRENDAS CON PASADO.</span>
        <p>Un armario para mirar despacio y encontrar algo muy tuyo.</p>
      </div>
    </div>
  );
}
export function Catalog({ gender }: { gender?: 'hombre' | 'mujer' }) {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedGender = gender || params.get('genero') || '';
  const category = params.get('categoria') || '';
  const query = params.get('q') || '';
  const sort = params.get('orden') || 'seleccion';
  const title = gender ? (gender === 'hombre' ? 'Hombre.' : 'Mujer.') : 'El armario REVY.';
  usePageTitle(gender ? (gender === 'hombre' ? 'Hombre' : 'Mujer') : 'Catálogo');
  const genderProducts = products.filter((p) => !selectedGender || p.gender === selectedGender);
  const categoryOptions = [...new Set(genderProducts.map((p) => p.category))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
  const hasDates = products.some((p) => p.addedAt && !Number.isNaN(Date.parse(p.addedAt)));
  const result = genderProducts
    .filter(
      (p) =>
        (!category || p.category === category) &&
        (!query || normalize(`${p.name} ${p.category}`).includes(normalize(query))),
    )
    .sort((a, b) =>
      sort === 'precio-asc'
        ? (a.price ?? Infinity) - (b.price ?? Infinity)
        : sort === 'precio-desc'
          ? (b.price ?? -Infinity) - (a.price ?? -Infinity)
          : sort === 'nombre'
            ? a.name.localeCompare(b.name, 'es')
            : sort === 'novedades'
              ? (Date.parse(b.addedAt || '') || 0) - (Date.parse(a.addedAt || '') || 0)
              : Number(!!b.featured) - Number(!!a.featured),
    );
  function update(key: string, value: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key === 'genero') next.delete('categoria');
        return next;
      },
      { replace: true },
    );
  }
  const clear = () => setParams({}, { replace: true });
  const active = !!(category || query || (!gender && selectedGender));
  const filterProps = {
    gender,
    selectedGender,
    category,
    categoryOptions,
    genderProducts,
    active,
    update,
    clear,
  };
  return (
    <div className="catalog-page section-wrap">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <span>{gender ? (gender === 'hombre' ? 'Hombre' : 'Mujer') : 'Catálogo'}</span>
      </div>
      <div className="catalog-header">
        <div>
          <span className="eyebrow">SEGUNDA MANO. ESTILO PROPIO.</span>
          <h1>{title}</h1>
          <p>
            {gender === 'hombre'
              ? 'Cuero, denim y prendas con mucho camino por delante.'
              : gender === 'mujer'
                ? 'Texturas, siluetas y prendas para hacer tuyas.'
                : 'No hace falta estrenar para encontrar algo nuevo.'}
          </p>
        </div>
        <span className="catalog-total">
          {genderProducts.length}
          <small>PRENDAS POR EXPLORAR</small>
        </span>
      </div>
      <div className="catalog-layout">
        <aside className="desktop-filters" aria-label="Filtros de productos">
          <h2>Explora el armario</h2>
          <FilterPanel {...filterProps} />
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div className="catalog-search">
              <Search size={18} />
              <input
                aria-label="Buscar en el catálogo"
                value={query}
                onChange={(e) => update('q', e.target.value)}
                placeholder="Busca tu próxima prenda…"
              />
              {query && (
                <button aria-label="Borrar búsqueda" onClick={() => update('q', '')}>
                  <X size={17} />
                </button>
              )}
            </div>
            <button className="mobile-filter-button" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={17} /> Filtros{active && <span />}
            </button>
            <label className="sort-label">
              <span>Ordenar por</span>
              <select
                aria-label="Ordenar productos"
                value={sort}
                onChange={(e) => update('orden', e.target.value)}
              >
                <option value="seleccion">Selección REVY</option>
                <option value="precio-asc">Precio: de menor a mayor</option>
                <option value="precio-desc">Precio: de mayor a menor</option>
                <option value="nombre">Nombre: A–Z</option>
                {hasDates && <option value="novedades">Novedades</option>}
              </select>
            </label>
          </div>
          <div className="results-status" role="status" aria-live="polite">
            <span>
              {result.length} {result.length === 1 ? 'prenda' : 'prendas'}
              {query ? ` para «${query}»` : ''}
            </span>
            <div className="active-filters">
              {category && (
                <button onClick={() => update('categoria', '')}>
                  {category}
                  <X size={13} />
                </button>
              )}
              {!gender && selectedGender && (
                <button onClick={() => update('genero', '')}>
                  {selectedGender}
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
          {result.length ? (
            <div className="product-grid catalog-grid">
              {result.map((p, i) => (
                <ProductCard key={p.id} product={p} eager={i < 3} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={39} strokeWidth={1} />
              <h2>Por aquí no hay nada. Todavía.</h2>
              <p>Prueba con otra palabra o dale un poco de aire a los filtros.</p>
              <button className="button button-red" onClick={clear}>
                Ver todas las prendas <ArrowRight size={17} />
              </button>
            </div>
          )}
          <p className="catalog-disclosure">
            Catálogo de demostración. Los precios son orientativos. Las imágenes ilustrativas no
            corresponden al artículo exacto; los datos no disponibles se indican en cada ficha.
          </p>
        </div>
      </div>
      <Drawer
        title="Filtra tu búsqueda"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        className="filters-drawer"
      >
        <FilterPanel {...filterProps} />
        <button className="button button-red" onClick={() => setFiltersOpen(false)}>
          Ver {result.length} prendas <ArrowRight size={18} />
        </button>
      </Drawer>
    </div>
  );
}
