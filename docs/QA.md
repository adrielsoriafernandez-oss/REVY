# Verificación de REVY

Fecha: 12 de noviembre de 2026.

## Catálogo y recursos

- 30 productos: 15 de Hombre y 15 de Mujer.
- Cinco categorías reales: Accesorios; Camisas y camisetas; Chaquetas y abrigos; Jerséis y punto; Pantalones y denim.
- Fotografías originales encontradas: 0.
- Fotografías descargadas: 21, todas documentadas bajo licencia Unsplash en `public/images/ASSETS-SOURCES.json`.
- Productos con imagen: 30 de 30. Productos con imagen pendiente: 0.
- Seis asignaciones de stock adecuadas y 24 ilustraciones fotográficas de producto generadas con ImageGen, tras revisar color, corte y tipología. Las imágenes generadas se identifican como «Imagen ilustrativa · IA» y sus prompts están en `public/images/GENERATED-SOURCES.json`.
- Imágenes locales; logotipo original conservado; variante negativa derivada de la misma geometría; favicon oficial en PNG, ICO y Apple Touch Icon.
- Fuentes incluidas localmente en el build. Sin peticiones de fuentes ni fotografías a servicios externos en ejecución.

## Comprobaciones ejecutadas

| Comprobación                                                                                                                     | Resultado                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Instalación de dependencias con lockfile                                                                                         | Correcta                                                                        |
| TypeScript estricto + build de producción                                                                                        | Correctos                                                                       |
| `npm test`: sincronización, prioridad de originales, conservación de imágenes generadas y rechazo de imágenes ausentes/corruptas | 3 pruebas integradas aprobadas                                                  |
| `npm run qa`: todos los productos con imagen decodificable, procedencia, IDs y slugs únicos                                      | Correcto; también se ejecuta antes de cada build                                |
| Comandos `sync:products` e `images:fetch` sin clave                                                                              | Correctos; catálogo conservado y aviso explícito al faltar la clave             |
| Las 30 rutas de producto en navegador                                                                                            | Cada ficha tiene su título y botón de bolsa                                     |
| Home, Catálogo, Hombre, Mujer, Producto y Carrito a 375, 768, 1024 y 1440 px                                                     | 24 comprobaciones; sin desbordamiento horizontal ni imágenes cargadas con error |
| Nosotros, Contacto y 404                                                                                                         | Rutas y encabezados correctos; sin desbordamiento                               |
| Género + categoría + búsqueda + ordenación, aplicados rápidamente                                                                | Resultado y URL coherentes                                                      |
| Recarga con parámetros de filtros                                                                                                | Se conservan los filtros y resultados                                           |
| Búsqueda `cardigan` sin tilde                                                                                                    | Encuentra ambos cárdigan                                                        |
| Búsqueda sin coincidencias y limpieza                                                                                            | Estado vacío y recuperación del catálogo correctos                              |
| Precio ascendente                                                                                                                | 30 importes en orden ascendente                                                 |
| Favoritos: añadir, recargar, consultar y quitar                                                                                  | Persistencia y estado vacío correctos                                           |
| Bolsa: añadir, aumentar, recargar, reducir, eliminar                                                                             | Cantidades y subtotal correctos; vacío correcto                                 |
| Ejemplo de subtotal                                                                                                              | Chaqueta a 68 €: cantidad 2 → 136 €; cantidad 1 → 68 €                          |
| Menú y panel de filtros móviles                                                                                                  | Abren, combinan filtros y aplican resultados                                    |
| Diálogo: Shift+Tab desde el primer control                                                                                       | Foco vuelve al último control dentro del diálogo                                |
| Escape en filtros                                                                                                                | Cierra y devuelve el foco al botón Filtros                                      |
| Build con `VITE_BASE_PATH=/revy-test/`, servido en esa subruta                                                                   | CSS, fuentes, imágenes, anclas y rutas HashRouter correctos                     |
| Filtros en build de subruta y recarga                                                                                            | Mujer + Chaquetas y abrigos → 4 prendas, parámetros conservados                 |
| Errores de consola de la versión compilada                                                                                       | Ninguno en la revisión final                                                    |

La inspección visual incluyó escritorio y móvil, tipografía, logotipo, jerarquía, proporciones, tarjetas, fotografía, menú, filtros y ficha. Se ajustó la composición del titular móvil y se evitaron desplazamientos suaves durante los cambios de ruta. Las transiciones son CSS, breves y sin movimiento permanente. Se revisó la regla `prefers-reduced-motion`; no se cambió la preferencia del sistema ni se realizó una auditoría con lector de pantalla.

## Revisión de imágenes del catálogo

Se comprobó en el navegador el catálogo completo: **30 tarjetas, 30 imágenes cargadas y cero imágenes rotas o placeholders**. Se revisaron las ilustraciones por tipo de prenda, color y corte; se sustituyeron referencias que no mostraban la silueta completa o no coincidían con el producto. La ficha de producto conserva la vista completa mediante `object-fit: contain` y explica el carácter ilustrativo de las imágenes generadas. También se comprobó el catálogo a 375 px sin desbordamiento horizontal.

La nueva validación del build abre y decodifica cada imagen, exige un archivo por producto y comprueba la procedencia de las ilustraciones. Las pruebas automatizadas cubren archivos ausentes, archivos corruptos, registro de imágenes generadas, conservación de ilustraciones al sincronizar y prioridad de fotos originales. Una segunda sincronización del catálogo real dejó intactas las 30 imágenes y sus etiquetas.

## Entrega portable

ZIP comprobado con `zipfile.testzip()`, sin entradas duplicadas, rutas inseguras, secretos ni `node_modules`. Se extrajo una copia independiente, se instaló mediante `npm ci --offline --no-audit --no-fund` y se ejecutaron correctamente `npm run build` y `npm run qa` desde ella. Los archivos de código compilados se compararon con los del ZIP definitivo.

El archivo contiene una única raíz `revy/`, con fuentes, recursos, scripts, documentación y workflow de Pages, y excluye dependencias instaladas, secretos, cachés y archivos temporales. La entrega de Windows está en `Desktop/revy-github.zip`; el proyecto editable se conserva en `Desktop/revy/website/`. Las carpetas originales de producto permanecen sin archivos modificados ni reorganizados.

## Límites conocidos

Los precios son demo. No hay tallas, color, estado, stock o contacto comercial confirmados en los metadatos originales. Las imágenes de stock y las generadas con IA son ilustrativas; no documentan el artículo real ni acreditan su estado. Pexels requiere una clave propia y sus descargas públicas estuvieron restringidas; no se evadió esa limitación. El despliegue remoto de GitHub Actions está preparado, pero no se ha ejecutado contra una cuenta o repositorio del usuario. La tienda es exclusivamente frontend y no procesa compras.
