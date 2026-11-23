# AGENTS.md

Sitio estático de AFFutbol en Netlify (`https://fabulous-lokum-31a2e8.netlify.app`). No hay `package.json`, build, tests, lint ni dev server: `netlify.toml` publica la raíz del repo (`publish = ".", NODE_VERSION = "24"`). No busques scripts npm.

## Fuente de verdad: manual vs generado

- `legal/{privacidad,terminos,fuentes}/index.html` **y** `soporte/index.html` son output del repo hermano `AlejandroFdez11/AffNoticiasFutbol`. El generador reescribe el HTML completo (CSS, nav con URLs absolutas, fecha/revisión y footer), así que no edites esos archivos a mano: cambia la fuente y regenera.
  - Fuente: `AFFutbol/src/features/legal/documents.ts` (textos, `LEGAL_LAST_UPDATED`, `LEGAL_SITE_URL`, emails de contacto/soporte).
  - Desde la raíz de `AffNoticiasFutbol`, con este repo en `../AffNoticiasWeb`: `npx --yes tsx scripts/generate-legal-pages.ts`. Si está en otra ruta, `LEGAL_WEB_DIR=/ruta/AffNoticiasWeb`. Después commitea aquí.
- `descargar/index.html` y `index.html` sí son manuales.
- Los iconos de esta web (`favicon.svg`, `favicon.png`, `apple-touch-icon.png`) derivan de `AFFutbol/assets/brand/icon-master.svg` en el repo de la app; las etiquetas `<link rel="icon">` de las páginas generadas viven en `scripts/generate-legal-pages.ts`. Cambia allí y regenera, no en el HTML.

## Gotchas

- El APK se actualiza a mano en `descargar/index.html`: enlace de expo.dev, enlace a la build de EAS, versión/build en `.meta`, fecha de caducidad y pie de página. Los artefactos caducan (el actual: 07/12/2026); genera uno nuevo en la app con `cd AFFutbol && npx eas-cli build --profile internal --platform android --non-interactive` y actualiza todos esos campos a la vez.
- `/` es solo un meta-refresh a `/descargar` con canonical del host de producción. Si cambia el dominio, actualiza ahí, en `LEGAL_SITE_URL` de la app (y regenera) y en el footer de `descargar`.
- La nav no es uniforme a propósito: `descargar` usa rutas `/...`; las páginas generadas usan URLs absolutas del sitio. No las unifiques sin cambiar también el generador.

## Verificar y desplegar

- Sin tests ni lint: revisa el HTML y, si procede, un deploy de preview.
- Producción: `npx netlify-cli deploy --prod --dir .` (requiere `npx netlify-cli login` y el sitio ya creado). No hay paso de build previo.
