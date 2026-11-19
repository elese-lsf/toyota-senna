# Sitio de seguimiento · Senna Automotores

Sitio estático para `toyotasenna.theelabs.io`. No hay nada que compilar a mano: se sube un archivo y GitHub publica.

## Estructura

```
index.html              estructura del sitio (no se toca)
site.json               navegación (solapas) y etapa del proyecto
entregables.json        lista de entregables y link a la carpeta
paginas/                una página por solapa de tipo "pagina" (hoy: propuesta.html)
minutas/                una minuta por archivo .md (y opcionalmente su .pdf)
  _plantilla.md         copiar para cada minuta nueva
assets/                 estilos y código del sitio (no se toca)
scripts/build-minutas.mjs   genera el índice de minutas al publicar
.github/workflows/      publicación automática
CNAME                   dominio
```

## Tareas de siempre

**Subir una minuta nueva**
1. Copiá `minutas/_plantilla.md` con el nombre `AAAA-MM-DD-tema.md` (por ejemplo `2026-11-23-mapa-proceso.md`).
2. Completá los datos del encabezado y las tablas. El estado es `Pendiente` o `Hecho`.
3. Si querés, subí el PDF con el mismo nombre (`2026-11-23-mapa-proceso.pdf`): aparece un botón "Ver PDF".
4. Commit a `main`. En un minuto está publicado.

La minuta más reciente alimenta la solapa Inicio: próxima reunión y compromisos abiertos. Para cerrar un compromiso, cambiá `Pendiente` por `Hecho` y subí el cambio.

**Cambiar la navegación**
Editá `site.json`. Cada solapa es una entrada con `id`, `label` y `tipo`:
- `inicio`, `avances`, `entregables`: solapas armadas por el sitio.
- `pagina`: abre un HTML tuyo; agregá `"src": "paginas/mi-pagina.html"`.

Para sumar una solapa nueva, creás el HTML en `paginas/` y agregás una entrada. Para sacarla, borrás la entrada. Para reordenar, cambiás el orden de la lista.

**Actualizar entregables**
Editá `entregables.json`. Cuando Senna tenga acceso a la carpeta, poné el link en `url` y `acceso_cliente` en `true`: aparece el botón de acceso.

**Cambiar la etapa**
Editá `etapa` en `site.json`.

## Primera vez

1. Reemplazá `index.html` y `CNAME` del repo por los de esta carpeta y subí el resto.
2. En GitHub: Settings > Pages > Source: **GitHub Actions**. Verificá que el dominio personalizado siga siendo `toyotasenna.theelabs.io`.
3. Hacé un commit y mirá la pestaña Actions: "Publicar sitio" debe quedar en verde.

## Probar en la computadora

```
node scripts/build-minutas.mjs
python3 -m http.server 8000
```
Abrí `http://localhost:8000`.

## Qué es público

El sitio es público. Cualquier minuta que subas se puede leer. No pongas claves, datos de cartera ni temas comerciales.
