// Behaviour for the pages that build.js writes: the phone menu and the home slideshow.
(function () {
  // Menu
  const menuBtn = document.querySelector(".js-menu");
  menuBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", open);
  });

  // Home slideshow: each photo zooms out to full size, advancing every 6 seconds
  const slides = [...document.querySelectorAll(".slide")];
  if (slides.length) {
    const dots = [...document.querySelectorAll(".dots button")];
    let current = 0;
    let timer;
    // Photos after the first are fetched just before they are needed
    const load = (i) => {
      const el = slides[(i + slides.length) % slides.length].querySelector(".slide-img");
      if (el.dataset.src) {
        el.srcset = el.dataset.srcset;
        el.src = el.dataset.src;
        delete el.dataset.src;
        delete el.dataset.srcset;
      }
    };
    const go = (i) => {
      current = (i + slides.length) % slides.length;
      load(current);
      load(current + 1);
      slides.forEach((s, n) => s.classList.toggle("is-active", n === current));
      dots.forEach((d, n) => d.classList.toggle("on", n === current));
      clearTimeout(timer);
      timer = setTimeout(() => go(current + 1), 6000);
    };
    dots.forEach((d, n) => d.addEventListener("click", () => go(n)));
    addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
    });
    go(0);
  }
})();
