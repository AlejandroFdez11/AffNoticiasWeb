# AffNoticiasWeb

Sitio estático de AFFutbol desplegado en **Netlify**: páginas legales, soporte y descarga del APK de distribución interna.

- URL: https://affnoticiasweb.netlify.app
- Repo: `AlejandroFdez11/AffNoticiasWeb`
- No incluye la app Expo: esa vive en `AlejandroFdez11/AffNoticiasFutbol`.

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/descargar/` | APK de AFFutbol para Android e instrucciones de instalación |
| `/legal/privacidad/` | Política de privacidad |
| `/legal/terminos/` | Condiciones de uso |
| `/legal/fuentes/` | Atribución de fuentes |
| `/soporte/` | Correo de soporte y borrado de cuenta |

## Actualizar los textos legales

La fuente única es `AFFutbol/src/features/legal/documents.ts` del repo de la app. No editar el HTML a mano: desde la raíz de `AffNoticiasFutbol` ejecutar:

```bash
npx --yes tsx scripts/generate-legal-pages.ts
```

El script escribe en este repo (por defecto en `../AffNoticiasWeb`; se puede cambiar con `LEGAL_WEB_DIR`). Después hacer commit aquí.

## Actualizar el APK

Editar el enlace del botón en `descargar/index.html`. El build se genera en el repo de la app con:

```bash
cd AFFutbol
npx eas-cli build --profile internal --platform android --non-interactive
```

El artefacto caduca; cuando eso pase, generar uno nuevo y actualizar la página.

## Desplegar

```bash
npx netlify-cli deploy --prod --dir .
```

Requiere estar autenticado (`npx netlify-cli login`) y tener el sitio creado. `netlify.toml` publica la raíz del repo.
