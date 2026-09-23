/* =====================================================
   Confirmar asistencia — contador en vivo con Firebase
   Guarda cada confirmación en la base de datos y muestra
   el total de invitados en tiempo real.
   ===================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6lLnCWoTa6mx7iVAukQO9TkPFBh2dAog",
  authDomain: "boda-web-1bce1.firebaseapp.com",
  databaseURL: "https://boda-web-1bce1-default-rtdb.firebaseio.com",
  projectId: "boda-web-1bce1",
  storageBucket: "boda-web-1bce1.firebasestorage.app",
  messagingSenderId: "35019135622",
  appId: "1:35019135622:web:73e50f41de968b88c80f07",
  measurementId: "G-QZH6PQ23TF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const confRef = ref(db, "confirmaciones");

const form     = document.getElementById("rsvpForm");
const inNombre = document.getElementById("rsvpNombre");
const inPers   = document.getElementById("rsvpPersonas");
const btn      = document.getElementById("btnRsvp");
const gracias  = document.getElementById("rsvpGracias");
const contador = document.getElementById("rsvpContador");

/* ---- Total en vivo (se actualiza solo para todos) ---- */
onValue(confRef, function (snap) {
  let personas = 0, registros = 0;
  snap.forEach(function (hijo) {
    const v = hijo.val() || {};
    personas += Math.max(1, parseInt(v.personas, 10) || 1);
    registros += 1;
  });
  if (contador) {
    contador.textContent = registros
      ? "Ya confirmaron " + personas + (personas === 1 ? " invitado 🎉" : " invitados 🎉")
      : "Sé el primero en confirmar 💚";
  }
}, function () {
  if (contador) contador.textContent = "";
});

/* ---- Enviar una confirmación ---- */
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = (inNombre.value || "").trim();
    const personas = Math.min(20, Math.max(1, parseInt(inPers.value, 10) || 1));
    if (!nombre) { inNombre.focus(); return; }

    if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }

    push(confRef, { nombre: nombre, personas: personas, ts: Date.now() })
      .then(function () {
        form.hidden = true;
        if (gracias) {
          gracias.textContent = "¡Gracias, " + nombre + "! Tu asistencia quedó confirmada 💚";
          gracias.hidden = false;
        }
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = "Confirmar asistencia"; }
        alert("No se pudo confirmar. Revisa tu conexión e inténtalo de nuevo.");
      });
  });
}
