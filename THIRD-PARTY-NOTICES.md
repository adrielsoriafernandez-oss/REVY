# Recursos y licencias

## Identidad REVY

El logotipo y el favicon originales fueron proporcionados por el usuario. Se conservan en `public/brand/logo-original.png` y `public/brand/favicon-original.png`. Las versiones transparentes/negativas y los tamaños PNG/ICO son derivados técnicos: recorte de márgenes, eliminación del fondo blanco y cambio a negativo sin redibujar la marca. Los derechos sobre estos recursos corresponden a sus titulares; esta entrega no concede derechos adicionales sobre la marca.

## Fotografías

Las fotografías locales proceden de Unsplash y se usan dentro de este proyecto de web, como inspiración editorial y referencias ilustrativas. No se ofrecen como colección independiente. No se afirma que las personas fotografiadas sean clientes ni que respalden a REVY.

Registro individual de cada fotografía, autor, URL original, página fuente, licencia, dimensiones y descripción: `public/images/ASSETS-SOURCES.json`.

Licencia: https://unsplash.com/license

Las imágenes ilustrativas no representan las prendas exactas del catálogo. No reutilices estos recursos como una biblioteca de stock competidora ni los vendas sin modificaciones como imágenes independientes. Comprueba los derechos adicionales pertinentes antes de usarlos en otros contextos.

## Ilustraciones de producto generadas

24 imágenes fotográficas de producto se crearon para REVY con la herramienta integrada OpenAI ImageGen, a partir del nombre y la tipología de cada prenda. Se indican como «Imagen ilustrativa · IA» en tarjetas y fichas. No son fotografías documentales de las prendas reales ni se atribuyen a Unsplash.

El registro de producto, archivo local, herramienta, fecha, descripción y prompt exacto está en `public/images/GENERATED-SOURCES.json`. Los resultados se incorporan al proyecto como WebP locales; la web no llama a servicios de generación en ejecución. Los originales generados permanecen conservados en el equipo de autoría.

## Tipografías

- **DM Sans**: Colophon Foundry y colaboradores, SIL Open Font License 1.1.
- **Lobster Two**: Pablo Impallari y colaboradores, SIL Open Font License 1.1.

Se distribuyen a través de `@fontsource/dm-sans` y `@fontsource/lobster-two`. Los textos de licencia de los paquetes utilizados están incluidos en `docs/licenses/`. Las fuentes se sirven localmente desde el build.

## Bibliotecas

Las dependencias y sus versiones exactas están registradas en `package-lock.json`. React, React DOM, React Router, Vite, TypeScript y Tailwind conservan sus propias licencias. Lucide se distribuye bajo ISC. Las instalaciones contienen los avisos de licencia de cada dependencia.
