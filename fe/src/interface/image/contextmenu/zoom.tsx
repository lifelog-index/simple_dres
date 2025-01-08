export function zoomEffect(HDimage: string) {
  console.log("zoom image");

  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  });

  document.body.style.overflow = "hidden";
  overlay.onclick = () => (
    (overlay.style.display = "none"), (document.body.style.overflow = "auto")
  );
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // overlay.appendChild(close);

  const img = document.createElement("div");
  img.innerHTML = `<img src=${HDimage} alt="zoomImage" />`;
  Object.assign(img.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
  });
  overlay.appendChild(img);

  document.body.appendChild(overlay);
}
