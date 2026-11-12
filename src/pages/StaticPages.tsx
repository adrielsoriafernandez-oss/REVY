import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { asset } from '../lib/products';
import { usePageTitle } from '../hooks/usePageTitle';
export function About() {
  usePageTitle('Nuestra historia');
  return (
    <>
      <div className="about-intro section-wrap">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <span>Nuestra historia</span>
        </div>
        <span className="eyebrow">EL ESPÍRITU REVY</span>
        <h1>
          La ropa no es
          <br />
          <em>de un solo uso.</em>
        </h1>
        <div className="about-lead">
          <p>
            Y nosotros tampoco creemos
            <br />
            en las historias de una temporada.
          </p>
          <span>REAL. NATURAL. A NUESTRA MANERA.</span>
        </div>
      </div>
      <div className="about-landscape">
        <img
          src={asset('images/landscape-lake.webp')}
          alt="Lago rodeado de bosques y montañas: la inspiración natural de REVY"
        />
        <span>EL RITMO DE LA NATURALEZA. EL CARÁCTER DE LO VIVIDO.</span>
      </div>
      <section className="about-story section-wrap">
        <span className="eyebrow">VOLVER A ELEGIR.</span>
        <div>
          <h2>Hay mucho por delante.</h2>
          <p>
            REVY parte de una idea sencilla: una prenda merece más de una oportunidad. La ropa no
            tiene por qué terminar su recorrido cuando alguien deja de usarla.
          </p>
          <p>
            Nos atraen las texturas naturales, el denim de siempre, las chaquetas que ganan carácter
            y las prendas que cuentan algo. Queremos compartir una forma de vestir cercana y
            auténtica, sin seguir obligatoriamente cada estándar de la moda.
          </p>
          <p>
            El bosque, los caminos y la calma de los paisajes del norte inspiran nuestra mirada.
            Pero el centro siempre es la ropa y la persona que elige llevarla.
          </p>
        </div>
      </section>
      <section id="valores" className="values-section section-wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LO QUE NOS MUEVE</span>
            <h2>Con los pies en la tierra.</h2>
          </div>
        </div>
        <div className="values-grid">
          {[
            ['01', 'Real', 'Estilo auténtico, sin hacer de cada tendencia una norma.'],
            ['02', 'Renovable', 'Otra oportunidad para las prendas que todavía tienen recorrido.'],
            [
              '03',
              'Ecofriendly',
              'Reutilizar ropa y alargar su vida útil es nuestra forma de empezar.',
            ],
            ['04', 'Qualitat', 'Mirar con atención las prendas y el valor de conservarlas.'],
            [
              '05',
              'Budget-friendly',
              'Una mirada a la moda que también tiene en cuenta el bolsillo.',
            ],
            ['06', 'Familiar', 'Cercanía, sencillez y ganas de compartir lo que nos gusta.'],
          ].map(([n, title, text]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="closing-note section-wrap">
        <span className="eyebrow">UNA SEGUNDA VIDA. TU ESTILO.</span>
        <p>
          Ahora te toca
          <br />
          <em>hacerla tuya.</em>
        </p>
        <Link className="button button-red" to="/catalogo">
          Explora el armario <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
export function Contact() {
  usePageTitle('Contacto');
  return (
    <div className="contact-page section-wrap">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <span>Contacto</span>
      </div>
      <div className="contact-layout">
        <div>
          <span className="eyebrow">DE CERCA, COMO NOS GUSTA.</span>
          <h1>
            Hablemos
            <br />
            <em>de REVY.</em>
          </h1>
          <p>Una marca cercana empieza por decir las cosas claras.</p>
        </div>
        <div className="contact-information">
          <h2>Este armario está en construcción.</h2>
          <p>
            Esta web es una versión de demostración de la tienda REVY. Todavía no hay un canal de
            atención al cliente publicado.
          </p>
          <p>
            Por ahora no se reciben mensajes, se tramitan pedidos ni se realizan compras desde esta
            página. Cuando se confirmen los datos de contacto, aparecerán aquí.
          </p>
          <div>
            <span className="eyebrow">MIENTRAS TANTO</span>
            <Link className="text-link" to="/nosotros">
              Conoce nuestra historia <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" to="/catalogo">
              Echa un vistazo al armario <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export function NotFound() {
  usePageTitle('Página no encontrada');
  return (
    <section className="not-found section-wrap">
      <span className="eyebrow">404 / NOS HEMOS SALIDO DEL CAMINO</span>
      <h1>
        Esta historia
        <br />
        <em>no está por aquí.</em>
      </h1>
      <p>La página que buscas no existe. Volvamos a un lugar conocido.</p>
      <Link className="button button-red" to="/">
        Volver al inicio <ArrowRight size={18} />
      </Link>
    </section>
  );
}
