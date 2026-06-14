/* A&H Wealth Group — JS vanilla mínimo
   - Menú móvil (toggle .open en .site-header)
   - Animaciones de entrada con IntersectionObserver (200–300ms)
   El acordeón FAQ usa <details> nativo (sin JS).
*/
(function () {
  "use strict";

  // ---- Menú móvil ----
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // cerrar al navegar
    header.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Reveal al hacer scroll ----
  var reveals = document.querySelectorAll(".reveal");
  function revealAll() {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (el) { io.observe(el); });

      // Revela de inmediato lo que ya está en pantalla (por si el observer tarda)
      requestAnimationFrame(function () {
        reveals.forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      });

      // Failsafe: nunca dejar contenido oculto
      setTimeout(revealAll, 2500);
    } else {
      revealAll();
    }
  }
})();
