# REVY — Ropa con historia

Tienda editorial de moda vintage y segunda mano. Frontend estático con React, TypeScript estricto, Vite, Tailwind CSS 4, React Router y Lucide. Interfaz en español de España, importes en euros y fuentes locales.

## Empezar

Requisitos: Node.js 22.16 o posterior (también probado con Node 26) y npm.

```powershell
npm ci
npm run dev
```

Abre la dirección que imprime Vite, normalmente http://127.0.0.1:5173/.

```powershell
npm test
npm run qa
npm run typecheck
npm run build
npm run preview
```

`npm test` verifica el sincronizador, la conservación de imágenes generadas, la prioridad de fotos originales y el rechazo de imágenes ausentes o corruptas. `npm run qa` comprueba que **cada producto tenga al menos una imagen local válida**, su procedencia y la unicidad de IDs/slugs. `npm run build` ejecuta esa validación antes de compilar: no permite entregar productos sin imagen. La revisión visual e interactiva se documenta en `docs/QA.md`.

## Qué incluye

- Home editorial; catálogo completo; Hombre; Mujer; ficha de cada una de las 30 prendas; favoritos; carrito; Nosotros; Contacto; 404.
- Búsqueda por nombre y categoría, insensible a acentos; género y categoría combinables; orden por precio ascendente, descendente y nombre; filtros en URL y limpieza de filtros.
- Novedades y orden por novedades aparecen solo cuando hay fechas `addedAt` válidas. No se usan fechas del sistema de archivos como supuesto de novedad.
- Bolsa con cantidades, eliminación, subtotal y aviso de compra no disponible. Favoritos y bolsa persisten en LocalStorage; si el navegador bloquea el almacenamiento, siguen funcionando durante la sesión y se avisa.
- Menú, búsqueda, filtros móviles y carrito lateral con diálogos nativos, bloqueo de scroll, cierre con Escape y foco contenido en el diálogo.
- CSS para movimiento reducido, foco visible, enlace de salto, texto alternativo y actualizaciones anunciadas.
- Fuentes DM Sans y Lobster Two Italic distribuidas mediante paquetes Fontsource y emitidas como archivos locales durante el build. La web no hace peticiones a Google Fonts ni necesita servicios externos en ejecución.

## Datos reales y datos de demostración

Se detectaron **30 carpetas de producto**, 15 por género, en cinco categorías reales. No había fotografías originales, precios, tallas, estado, color ni stock en metadatos.

Los precios generados son **de demostración**, marcados en tarjetas, fichas y carrito. No hay pagos, backend, autenticación, pedidos, reservas, envíos reales ni formulario de contacto que simule un envío. No se han inventado tallas ni disponibilidad. Las fichas muestran «Pendiente de confirmar» donde faltan datos.

Los **30 productos tienen una imagen acorde al tipo de prenda, color y corte de su nombre**. Se conservan seis asignaciones de fotografía de stock adecuadas y se incorporan 24 ilustraciones fotográficas de producto creadas con ImageGen. Estas últimas muestran la prenda completa, sin modelos, sobre fondo neutro; se identifican con «Imagen ilustrativa · IA» y se explican en cada ficha. No hay productos con imagen pendiente.

Las 21 fotografías descargadas de Unsplash siguen documentadas en `public/images/ASSETS-SOURCES.json` y se usan como referencias editoriales o de catálogo donde corresponden. Las 24 imágenes generadas y sus prompts exactos están registrados en `public/images/GENERATED-SOURCES.json`. **Ninguna imagen ilustrativa se presenta como una fotografía del artículo real de segunda mano**. No se mezclan prendas diferentes fingiendo que son varias vistas del mismo artículo.

## Sincronizar productos

Los originales permanecen fuera del código. En el ordenador de origen:

```text
revy/
├── Hombre/      # originales, solo lectura para los scripts
├── Mujer/       # originales, solo lectura para los scripts
└── website/     # este proyecto
```

```powershell
npm run sync:products
```

En otro equipo, el catálogo y sus recursos incluidos ya funcionan sin esas carpetas. Si no se encuentran Hombre/Mujer, el script conserva el catálogo. Para conectar otro origen, copia `.env.example` a `.env` y configura `REVY_PRODUCTS_ROOT`, o define esa variable de entorno. Nunca subas `.env`.

Estructuras compatibles:

```text
Hombre/Chaquetas y abrigos/Nombre de la prenda/foto.jpg
Hombre/Chaquetas y abrigos/Nombre de la prenda/metadata.json
Mujer/Pantalones y denim/Nombre de la prenda-front.jpg
Mujer/Pantalones y denim/Nombre de la prenda-back.jpg
Mujer/Pantalones y denim/Nombre de la prenda.json
```

Las imágenes directas con sufijos `front`, `back`, `side`, `detail`, `frente`, `espalda`, `detalle` o números se agrupan. Una imagen directa sin sufijo crea un producto. Las carpetas vacías también crean productos; si se añade una prenda sin foto ni correspondencia ilustrativa, aparecerá en desarrollo, pero el build pedirá asignarle una imagen antes de entregarla. El script recorre subcarpetas y copia las imágenes al proyecto sin modificar los originales. Los IDs dependen de la ruta relativa del producto; añadir imágenes o editar metadatos no cambia el ID. Renombrar o mover la carpeta sí crea una identidad nueva.

Metadatos admitidos en `metadata.json` o `product.json` dentro de una carpeta; para imágenes directas usa `Nombre de la prenda.json`:

```json
{
  "name": "Nombre verificado",
  "price": 42,
  "description": "Descripción verificada del artículo.",
  "sizes": ["M"],
  "color": "Marrón",
  "condition": "Estado revisado por la marca",
  "featured": true,
  "addedAt": "2026-11-12"
}
```

El ejemplo es un formato, no datos asignados a ninguna prenda. Introduce solo especificaciones confirmadas. Los precios reales reemplazan los demo y eliminan su aviso. Las imágenes originales siempre tienen prioridad frente a las ilustrativas.

## Buscar nuevas fotografías

```powershell
npm run images:fetch
npm run sync:products
```

Requiere una clave propia `PEXELS_API_KEY` en `.env` o en el entorno. Es un script local: nunca expone la clave al navegador. Busca en inglés según tipología y género, limita solicitudes, no vuelve a descargar archivos existentes y evita resultados cuya descripción no identifica el tipo de prenda. La revisión humana de la correspondencia sigue siendo necesaria. Registra fuentes/autor/licencia en `public/images/PEXELS-SOURCES.json`, y conserva los resultados como ilustrativos. Las restricciones HTTP detienen o descartan la solicitud; no se evaden.

Sin clave, informa y conserva todos los archivos existentes. En esta entrega Pexels no tenía credenciales y sus descargas públicas devolvían 403, por lo que se usaron fuentes permitidas de Unsplash y se completaron los productos mediante ImageGen. Las asignaciones revisadas están en `src/data/image-overrides.json`; `scripts/link-stock-images.mjs` puede reconstruir las seis asignaciones de stock y las 24 generadas a partir de los manifiestos incluidos. Las imágenes generadas permanecen al sincronizar, y una fotografía original nueva tiene prioridad y elimina la etiqueta de IA para ese producto.

Para incorporar nuevos resultados de ImageGen, `scripts/import-generated-images.mjs` acepta un manifiesto local de autoría con `id`, `name`, `file`, `prompt` y `sourcePath`. Optimiza las imágenes como WebP y guarda la procedencia portable sin incluir rutas personales. No necesita ejecutarse para usar la web ni contiene llamadas de generación de pago. Los prompts de esta entrega se conservan en el manifiesto de procedencia.

## GitHub Pages

1. Extrae el ZIP. Sube **el contenido** de su carpeta `revy` a la raíz del repositorio.
2. Usa la rama `main` o adapta una sola vez el disparador del workflow.
3. En GitHub → Settings → Pages selecciona **GitHub Actions** como origen.
4. Haz push. `.github/workflows/deploy.yml` instala con lockfile, ejecuta tests, compila y publica `dist`.

El workflow calcula `VITE_BASE_PATH` a partir del nombre real del repositorio. Cambiar el nombre del repositorio no exige editar rutas ni recursos. Para repositorios de proyecto (por ejemplo `/mi-revy/`) se usa HashRouter: `https://usuario.github.io/mi-revy/#/catalogo`. Las recargas de fichas y filtros funcionan sin reescrituras del servidor. En una web situada en la raíz se usan rutas limpias; el workflow incluye una copia `404.html` para el fallback de Pages. Un hosting genérico con BrowserRouter debe reescribir rutas hacia `index.html`.

Para ensayar una subruta en PowerShell:

```powershell
$env:VITE_BASE_PATH='/mi-revy/'
npm run build
npm run preview
Remove-Item Env:VITE_BASE_PATH
```

También se puede fijar `VITE_BASE_PATH=/mi-revy/` en `.env`. No abras `dist/index.html` mediante `file://`: sirve `dist` por HTTP.

El workflow está preparado; el repositorio y el despliegue remoto no se crean automáticamente como parte de esta entrega local.

## Estructura

```text
src/components/  # layout, productos y diálogos reutilizables
src/pages/       # páginas y composición editorial
src/context/     # carrito y favoritos
src/data/        # catálogo portable y asignaciones ilustrativas
src/hooks/       # metadatos de página
src/lib/         # moneda, rutas de recursos y normalización
src/styles/      # tokens oficiales, Tailwind y estilos responsive
src/types/       # contratos TypeScript
scripts/         # sincronización, imágenes, marca, QA y exportación
public/brand/    # originales y derivados técnicos sin rediseñar
public/images/   # WebP locales y registro de licencias
docs/            # verificación y licencias de fuentes
```

Tailwind 4 se configura mediante `@theme` en `src/styles/global.css` y `@tailwindcss/vite` en `vite.config.ts`; no necesita `tailwind.config.js`. La paleta completa está declarada como tokens. La animación es CSS, sin dependencia de Motion.

## Exportar

```powershell
npm run export
npm run export -- 'C:\ruta\revy-github.zip'
python scripts/verify-zip.py 'C:\ruta\revy-github.zip' 'C:\ruta\copia-nueva'
```

El exportador usa una lista explícita de fuentes y recursos del proyecto. Omite `node_modules`, `.env`, Git, compilaciones, cachés y capturas temporales. Incluye una única carpeta raíz `revy/`. La carpeta de extracción de la verificación debe ser nueva.
