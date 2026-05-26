const note = document.querySelector(".note");

if (note) {
  note.addEventListener("mousemove", (event) => {
    const bounds = note.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateX = ((y / bounds.height) - 0.5) * -4;
    const rotateY = ((x / bounds.width) - 0.5) * 4;

    note.style.transform = `rotate(1.5deg) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  note.addEventListener("mouseleave", () => {
    note.style.transform = "rotate(1.5deg)";
  });
}
