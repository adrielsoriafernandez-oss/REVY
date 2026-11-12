import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Product } from './pages/Product';
import { Favorites } from './pages/Favorites';
import { Cart } from './pages/Cart';
import { About, Contact, NotFound } from './pages/StaticPages';
// GitHub Pages has no SPA rewrite support. Hash routes work on every refresh and under any repository base.
export default function App() {
  const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter;
  return (
    <Router useTransitions={false}>
      <ShopProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="hombre" element={<Catalog gender="hombre" />} />
            <Route path="mujer" element={<Catalog gender="mujer" />} />
            <Route path="producto/:slug" element={<Product />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="nosotros" element={<About />} />
            <Route path="contacto" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ShopProvider>
    </Router>
  );
}
