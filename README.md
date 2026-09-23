# Invitación de boda — web para celular

Sitio de una sola página, pensado para teléfono (iOS y Android), con video de fondo,
música, fecha que se "raspa", cuenta regresiva y confirmación por WhatsApp.

---

## 1. Qué hay dentro

```
boda-web/
├─ index.html              ← la página
├─ css/estilos.css         ← el diseño
├─ js/datos.js             ← ⭐ AQUÍ EDITAS TUS DATOS
├─ js/app.js               ← la lógica (no hace falta tocarlo)
└─ assets/
   ├─ video/fondo.mp4      ← tu video de fondo
   ├─ audio/cancion.mp3    ← tu canción
   └─ img/                 ← tus fotos: 1.jpg, 2.jpg, 3.jpg… y portada.jpg
```

**Solo necesitas editar `js/datos.js`**: nombres, fecha, horas, lugares, enlaces de
Google Maps, tu número de WhatsApp, dress code, tips y la lista de fotos.

---

## 2. El video de fondo ⚠️ IMPORTANTE

Tu `REEL SAVE THE DATE.mp4` pesa **171 MB**. Eso no sirve:

- GitHub rechaza archivos de más de **100 MB**.
- Con datos móviles, un invitado tardaría minutos en ver algo.

**Objetivo: dejarlo en 8–20 MB.** El video va en silencio y de fondo, así que puede
comprimirse mucho sin que se note.

### Opción A — sin instalar nada
Sube el MP4 a un compresor en línea (busca "compress mp4 online"), elige
resolución **720×1280** y calidad media, y descarga el resultado.

### Opción B — con ffmpeg (mejor calidad/peso)
```bash
ffmpeg -i "REEL SAVE THE DATE.mp4" -an \
  -vf "scale=720:-2" -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 30 -preset slow -movflags +faststart assets/video/fondo.mp4
```
- `-an` quita el audio (no se usa, la música va aparte).
- `-movflags +faststart` hace que empiece a verse antes de descargarse completo.
- Si aún pesa mucho, sube el `-crf` a 32 o 34. Si quieres más calidad, bájalo a 28.

Sácale también una imagen de portada (se muestra mientras carga el video):
```bash
ffmpeg -i assets/video/fondo.mp4 -ss 00:00:01 -vframes 1 assets/img/portada.jpg
```

El archivo final debe llamarse **`assets/video/fondo.mp4`**.

> El video arranca en silencio y con `playsinline`: es la única forma de que iOS lo
> reproduzca solo. Por eso la música va en un `<audio>` aparte.

---

## 3. La música 🎵

iOS y Android **no dejan** que una página reproduzca sonido sola: hace falta que la
persona toque algo primero. Por eso la invitación abre con la pantalla
**"Abrir invitación"**: ese toque es el que enciende la música. Después queda un
botón redondo abajo a la derecha para pausarla o encenderla.

### Cómo poner tu canción
1. Consigue el archivo en **MP3** (el formato que entienden todos los teléfonos).
2. Recórtalo a 1–2 minutos y bájale el peso; ideal **menos de 3 MB**:
   ```bash
   ffmpeg -i cancion-original.mp3 -ss 00:00:20 -t 00:01:40 -b:a 96k assets/audio/cancion.mp3
   ```
3. Guárdalo como **`assets/audio/cancion.mp3`**.

### Sobre Spotify / YouTube
No se puede "pegar un link de Spotify" para que suene de fondo: sus reproductores
solo funcionan dentro de su propio widget y no se pueden ocultar. Las opciones reales son:

- **Recomendada:** usar tu archivo MP3 (lo que ya está armado).
- Alternativa: insertar el reproductor visible de Spotify, pero el invitado tendría
  que darle play y se ve el bloque verde de Spotify. Si lo quieres, te lo agrego.

**Nota legal:** una canción comercial está protegida por derechos de autor. Para una
invitación privada entre invitados no suele haber problema, pero si el repositorio es
público, ten en cuenta que estás publicando ese archivo. Si quieres evitarlo por
completo, usa música libre de regalías (Pixabay Music, Free Music Archive).

---

## 4. Las fotos

Tus JPG pesan entre 10 y 19 MB cada uno. Para la web hay que reducirlos o la página
tardará muchísimo. Deja cada foto en **menos de 300 KB**, con el lado largo en 1200 px:

```bash
# una por una
ffmpeg -i 1.jpg -vf "scale='min(1200,iw)':-2" -q:v 6 assets/img/1.jpg
```
O usa cualquier compresor en línea (TinyJPG, Squoosh) y guárdalas en `assets/img/`
con los nombres que aparecen en `js/datos.js`.

---

## 5. Subirlo a GitHub Pages

1. Crea un repositorio nuevo (por ejemplo `nuestra-boda`). Puede ser público.
2. Sube **el contenido** de esta carpeta a la raíz del repositorio: `index.html` debe
   quedar arriba del todo, no dentro de otra carpeta.
   - Desde la web: botón **Add file → Upload files**, arrastra todo y haz commit.
   - Desde la terminal:
     ```bash
     git init
     git add .
     git commit -m "Invitación de boda"
     git branch -M main
     git remote add origin https://github.com/TU-USUARIO/nuestra-boda.git
     git push -u origin main
     ```
3. En el repositorio: **Settings → Pages → Source: Deploy from a branch →
   Branch: `main` / carpeta `/ (root)` → Save**.
4. En 1–2 minutos tu invitación estará en:
   `https://TU-USUARIO.github.io/nuestra-boda/`

> GitHub Pages sirve el sitio por HTTPS, que es justo lo que piden iOS y Android
> para reproducir audio y video. Abrir el `index.html` con doble clic desde la
> computadora también funciona, pero algunas cosas se comportan distinto.

### Probarlo en tu celular antes de subirlo
En la carpeta del proyecto:
```bash
python3 -m http.server 8080
```
y desde el teléfono (en la misma wifi) entra a `http://IP-DE-TU-COMPU:8080`.

---

## 6. Detalles ya resueltos

- **iOS:** `playsinline` + `muted` en el video, `100svh` para que la barra de Safari
  no corte la portada, `viewport-fit=cover` y `env(safe-area-inset-bottom)` para el
  notch y la barra de gestos.
- **Android:** mismo comportamiento; el botón de música vuelve a arrancar si el
  sistema pausa el audio.
- **Raspaditos:** funcionan con dedo y con mouse; la página no hace scroll mientras
  raspas. Hay un enlace "Mostrar la fecha" por si alguien no logra raspar.
- **Accesibilidad:** botones y enlaces reales de 44 px o más, y si el teléfono tiene
  activado "reducir movimiento", se apagan las animaciones.

---

## 7. Lo que falta que me pases

En `js/datos.js` están puestos como ejemplo los datos que se alcanzan a leer en tu
foto (**Giovanni & María, 19 de diciembre de 2026**). Cámbialos por los reales, o
mándamelos y los dejo listos:

- Nombres como quieres que aparezcan (`nombre1` va arriba, `nombre2` abajo)
- Fecha y hora exactas de ceremonia y recepción
- Nombre y dirección de los dos lugares (+ enlace de Google Maps)
- Número de WhatsApp para confirmar y fecha límite
- Dress code y notas (niños, regalos, estacionamiento)
- La frase de la portada
