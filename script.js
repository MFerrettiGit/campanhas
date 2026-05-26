const heroImage = document.querySelector(".hero-media");

if (heroImage) {
  window.addEventListener("scroll", () => {
    const offset = Math.min(window.scrollY * 0.018, 10);
    heroImage.style.transform = `translateY(${offset}px)`;
  });
}
