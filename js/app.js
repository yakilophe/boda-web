/* =====================================================
   Invitación de boda — lógica
   No hace falta tocar este archivo: los datos están en datos.js
   ===================================================== */
(function () {
  "use strict";

  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const set = (id, valor) => { const el = document.getElementById(id); if (el) el.textContent = valor; };

  /* ---------------------------------------------------
     1. Volcar los datos en la página
     --------------------------------------------------- */
  const D = window.DATOS || DATOS;

  set("pNovia", D.nombre1); set("hNovia", D.nombre1); set("fNovia", D.nombre1);
  set("pNovio", D.nombre2); set("hNovio", D.nombre2); set("fNovio", D.nombre2);
  set("pFrase", D.frase);   set("hFrase", D.frase);
  document.title = D.nombre1 + " & " + D.nombre2 + " · Nuestra Boda";

  set("rDia", D.fechaTexto.dia);
  set("rMes", D.fechaTexto.mes);
  set("rAnio", D.fechaTexto.anio);

  ["ce", "re"].forEach(function (p) {
    const info = (p === "ce") ? D.ceremonia : D.recepcion;
    set(p + "Mes",  D.fechaTexto.mes);
    set(p + "Dia",  D.fechaTexto.diaSemana);
    set(p + "Num",  D.fechaTexto.dia);
    set(p + "Anio", D.fechaTexto.anio);
    set(p + "Hora", info.hora);
    set(p + "Lugar", info.lugar);
    set(p + "Dir",   info.direccion);
    const mapa = document.getElementById(p + "Mapa");
    if (mapa) mapa.href = info.mapa;
  });

  pintarLista("sugerenciasDetalle", D.sugerencias);
  set("rsvpLimite", D.fechaLimiteRSVP);

  function pintarLista(id, lineas) {
    const caja = document.getElementById(id);
    if (!caja || !Array.isArray(lineas)) return;
    caja.innerHTML = "";
    lineas.forEach(function (linea) {
      const p = document.createElement("p");
      p.innerHTML = linea;          // permite <strong> dentro del texto
      caja.appendChild(p);
    });
  }

  /* ---------- Padrinos y padres ---------- */
  function pintarNombres(id, nombres) {
    const caja = document.getElementById(id);
    if (!caja || !Array.isArray(nombres)) return;
    caja.innerHTML = "";
    nombres.forEach(function (nombre) {
      const p = document.createElement("p");
      p.className = "familia__nombre";
      p.textContent = nombre;
      caja.appendChild(p);
    });
  }
  if (D.familia) {
    pintarNombres("famPadresNovia", D.familia.padresNovia);
    pintarNombres("famPadresNovio", D.familia.padresNovio);
    pintarNombres("famPadrinos",    D.familia.padrinos);
  }

  /* ---------------------------------------------------
     2. Confirmar asistencia (contador)
     Cada toque cuenta como una confirmación. Se guarda
     en el propio dispositivo del invitado.
     --------------------------------------------------- */
  const btnRsvp    = $("#btnRsvp");
  const rsvpGracias = $("#rsvpGracias");
  const rsvpConta  = $("#rsvpContador");
  const CLAVE_RSVP = "boda_confirmaciones";

  function leerConfirmaciones() {
    try { return parseInt(localStorage.getItem(CLAVE_RSVP), 10) || 0; }
    catch (e) { return 0; }
  }
  function mostrarConfirmaciones(n) {
    if (!rsvpConta) return;
    rsvpConta.textContent = n > 0
      ? (n === 1 ? "1 confirmación registrada 🎉" : n + " confirmaciones registradas 🎉")
      : "";
  }

  mostrarConfirmaciones(leerConfirmaciones());

  if (btnRsvp) {
    btnRsvp.addEventListener("click", function () {
      let n = leerConfirmaciones() + 1;
      try { localStorage.setItem(CLAVE_RSVP, String(n)); } catch (e) {}
      if (rsvpGracias) rsvpGracias.hidden = false;
      mostrarConfirmaciones(n);
      btnRsvp.classList.add("btn--ok");
    });
  }

  /* ---------------------------------------------------
     3. Galería
     --------------------------------------------------- */
  const pista  = $("#galeriaTrack");
  const puntos = $("#galeriaPuntos");

  if (pista && Array.isArray(D.galeria)) {
    D.galeria.forEach(function (foto, i) {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.src = foto.src;
      img.alt = "Foto " + (i + 1) + " de " + D.nombre1 + " y " + D.nombre2;
      img.loading = (i < 2) ? "eager" : "lazy";
      img.decoding = "async";
      // Si la foto aún no existe, se muestra un marco discreto en lugar del icono roto
      img.addEventListener("error", function () {
        img.src = "data:image/svg+xml;utf8," + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">' +
          '<rect width="300" height="400" fill="#EDE7DA"/>' +
          '<text x="150" y="200" font-family="Georgia,serif" font-size="16" fill="#8A8F76" ' +
          'text-anchor="middle">Foto ' + (i + 1) + '</text></svg>'
        );
      });
      fig.appendChild(img);
      if (foto.texto) {
        const cap = document.createElement("figcaption");
        cap.textContent = foto.texto;
        fig.appendChild(cap);
      }
      pista.appendChild(fig);

      if (puntos) {
        const punto = document.createElement("i");
        if (i === 0) punto.className = "on";
        puntos.appendChild(punto);
      }
    });

    let tic = null;
    pista.addEventListener("scroll", function () {
      if (tic) return;
      tic = setTimeout(function () {
        tic = null;
        const hijos = Array.from(pista.children);
        if (!hijos.length) return;
        const centro = pista.scrollLeft + pista.clientWidth / 2;
        let activo = 0, mejor = Infinity;
        hijos.forEach(function (fig, i) {
          const c = fig.offsetLeft + fig.offsetWidth / 2;
          const d = Math.abs(c - centro);
          if (d < mejor) { mejor = d; activo = i; }
        });
        Array.from(puntos ? puntos.children : []).forEach(function (p, i) {
          p.className = (i === activo) ? "on" : "";
        });
      }, 90);
    }, { passive: true });
  }

  /* ---------------------------------------------------
     4. Cuenta regresiva
     --------------------------------------------------- */
  const destino = new Date(D.fechaISO).getTime();

  function tick() {
    let falta = destino - Date.now();
    if (falta < 0) falta = 0;
    const seg  = Math.floor(falta / 1000);
    const dias = Math.floor(seg / 86400);
    const hrs  = Math.floor((seg % 86400) / 3600);
    const min  = Math.floor((seg % 3600) / 60);
    const sg   = seg % 60;
    set("cDias", dias);
    set("cHoras", hrs);
    set("cMin", min);
    set("cSeg", sg);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------------------------------------------------
     5. Agendar en el calendario (.ics)
     --------------------------------------------------- */
  const btnAgenda = $("#btnAgenda");
  if (btnAgenda && !isNaN(destino)) {
    const utc = (ms) => new Date(ms).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Boda//ES",
      "BEGIN:VEVENT",
      "UID:boda-" + destino + "@invitacion",
      "DTSTAMP:" + utc(Date.now()),
      "DTSTART:" + utc(destino),
      "DTEND:" + utc(destino + 6 * 60 * 60 * 1000),
      "SUMMARY:Boda de " + D.nombre1 + " y " + D.nombre2,
      "LOCATION:" + D.ceremonia.lugar + ", " + D.ceremonia.direccion,
      "DESCRIPTION:¡Te esperamos!",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    btnAgenda.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  }

  /* ---------------------------------------------------
     6. Raspaditos (canvas)
     --------------------------------------------------- */
  function prepararRaspa(caja) {
    const canvas = caja.querySelector("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let ancho = 0, alto = 0, pintando = false, terminado = false, ultimo = null, trazos = 0;

    function dibujarCapa() {
      const r = caja.getBoundingClientRect();
      ancho = Math.max(1, Math.round(r.width));
      alto  = Math.max(1, Math.round(r.height));
      canvas.width  = ancho * dpr;
      canvas.height = alto  * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const g = ctx.createLinearGradient(0, 0, ancho, alto);
      g.addColorStop(0, "#EFE9DC");
      g.addColorStop(1, "#E3DACA");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, ancho, alto);

      ctx.fillStyle = "#6F7757";
      ctx.font = "600 14px 'Cormorant Garamond', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const txt = canvas.getAttribute("data-texto") || "RASPE";
      ctx.save();
      ctx.translate(ancho / 2, alto / 2);
      ctx.letterSpacing = "3px";   // ignorado donde no exista: no rompe nada
      ctx.fillText(txt, 0, 0);
      ctx.restore();
    }

    function puntoLocal(ev) {
      const r = canvas.getBoundingClientRect();
      return { x: ev.clientX - r.left, y: ev.clientY - r.top };
    }

    function borrar(p) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 40;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      if (ultimo) { ctx.moveTo(ultimo.x, ultimo.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
      ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ultimo = p;
      if (++trazos % 10 === 0) revisar();   // se revela sin tener que soltar el dedo
    }

    function porcentaje() {
      try {
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let vacios = 0;
        for (let i = 3; i < d.length; i += 4 * 24) { if (d[i] < 40) vacios++; }
        return vacios / (d.length / (4 * 24));
      } catch (e) { return 0; }
    }

    function revisar() {
      if (terminado) return;
      // 0.34 del cuadro ≈ 45 % del círculo visible: suficiente para que se lea
      if (porcentaje() > 0.34) revelar();
    }

    function revelar() {
      if (terminado) return;
      terminado = true;
      caja.classList.add("listo");
    }
    caja._revelar = revelar;

    canvas.addEventListener("pointerdown", function (ev) {
      if (terminado) return;
      pintando = true; ultimo = null;
      if (canvas.setPointerCapture) { try { canvas.setPointerCapture(ev.pointerId); } catch (e) {} }
      borrar(puntoLocal(ev));
      ev.preventDefault();
    });
    canvas.addEventListener("pointermove", function (ev) {
      if (!pintando || terminado) return;
      borrar(puntoLocal(ev));
      ev.preventDefault();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (tipo) {
      canvas.addEventListener(tipo, function () {
        if (!pintando) return;
        pintando = false; ultimo = null;
        revisar();
      });
    });

    dibujarCapa();
    let redibujo = null;
    window.addEventListener("resize", function () {
      if (terminado) return;
      clearTimeout(redibujo);
      redibujo = setTimeout(dibujarCapa, 250);
    });
  }

  $$("[data-raspa]").forEach(prepararRaspa);

  const btnRevelar = $("#btnRevelar");
  if (btnRevelar) {
    btnRevelar.addEventListener("click", function () {
      $$("[data-raspa]").forEach(function (c) { if (c._revelar) c._revelar(); });
    });
  }

  /* ---------------------------------------------------
     7. Video de fondo + música + puerta de entrada
     --------------------------------------------------- */
  const video   = $("#videoFondo");
  const audio   = $("#audio");
  const puerta  = $("#puerta");
  const btnAbrir  = $("#btnAbrir");
  const btnMusica = $("#btnMusica");

  // iOS solo autorreproduce si está en silencio y con playsinline
  if (video) {
    video.muted = true;
    video.setAttribute("muted", "");
    const intento = video.play();
    if (intento && intento.catch) intento.catch(function () { /* arrancará al tocar */ });
  }

  function entrar() {
    if (puerta) puerta.classList.add("fuera");
    document.body.classList.remove("bloqueado");
    if (video) { const p = video.play(); if (p && p.catch) p.catch(function () {}); }
    if (audio) {
      audio.volume = 0;
      const p = audio.play();
      if (p && p.then) {
        p.then(function () {
          subirVolumen();
          if (btnMusica) btnMusica.classList.add("visible", "sonando");
        }).catch(function () {
          if (btnMusica) btnMusica.classList.add("visible");   // el invitado la enciende a mano
        });
      } else {
        if (btnMusica) btnMusica.classList.add("visible", "sonando");
      }
    }
    setTimeout(function () {
      const inicio = document.getElementById("inicio");
      if (inicio) inicio.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  }

  function subirVolumen() {
    if (!audio) return;
    let v = 0;
    const sube = setInterval(function () {
      v += 0.05;
      if (v >= 0.65) { v = 0.65; clearInterval(sube); }
      audio.volume = v;
    }, 120);
  }

  document.body.classList.add("bloqueado");
  if (btnAbrir) btnAbrir.addEventListener("click", entrar);

  if (btnMusica && audio) {
    btnMusica.addEventListener("click", function () {
      if (audio.paused) {
        const p = audio.play();
        if (p && p.catch) p.catch(function () {});
        btnMusica.classList.add("sonando");
        btnMusica.setAttribute("aria-pressed", "true");
      } else {
        audio.pause();
        btnMusica.classList.remove("sonando");
        btnMusica.setAttribute("aria-pressed", "false");
      }
    });
  }

  // Si el navegador pausa el video al volver de segundo plano, lo retomamos
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && video && video.paused) {
      const p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
  });

  /* ---------------------------------------------------
     8. Aparición al hacer scroll
     --------------------------------------------------- */
  const aparecen = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    aparecen.forEach(function (el) { obs.observe(el); });
  } else {
    aparecen.forEach(function (el) { el.classList.add("visible"); });
  }

})();
