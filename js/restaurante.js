async function cargarRestaurante() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    alert("No se especificó restaurante");
    return;
  }

  const resp = await fetch("data/restaurantes.json");
  const data = await resp.json();
  const rest = data.find(r => r.id === id);

  if (!rest) {
    alert("Restaurante no encontrado");
    return;
  }

  document.getElementById("rest-nombre").innerText = rest.nombre;
  document.getElementById("rest-descripcion").innerText = rest.descripcion || "";
  document.getElementById("rest-precio").innerText = rest.precio_rango || rest.precio || "";
  document.getElementById("rest-ideal").innerText = rest.ideal_para || "";

  const bc = document.getElementById("rest-breadcrumb");
  if (bc) {
    const crumbs = [
      { label: "Inicio", href: "index.html" },
      { label: "Mapa", href: "mapa.html" },
      { label: "Restaurante", href: null },
      { label: rest.nombre, href: null }
    ];
    bc.innerHTML = crumbs
      .map(c => c.href ? `<a href="${c.href}">${c.label}</a>` : `<span>${c.label}</span>`)
      .join(" > ");
  }

  const galeria = document.getElementById("galeria-grid");
  galeria.innerHTML = "";
  (rest.galeria || []).forEach(img => {
    const src = img.startsWith("http") ? img : `imagenes/${img}`;
    galeria.innerHTML += `<img src="${src}" alt="Foto de ${rest.nombre}">`;
  });

  const resenas = document.getElementById("lista-resenas");
  resenas.innerHTML = "";
  if (rest.resenas && rest.resenas.length) {
    rest.resenas.forEach(r => {
      const rating = "★".repeat(r.rating || 0);
      resenas.innerHTML += `
        <article class="resena">
          <header>
            <span>${r.autor || "Anónimo"}</span>
            <span class="rating">${rating}</span>
          </header>
          <div class="fuente">${r.fuente || ""} ${r.fecha ? "· " + r.fecha : ""}</div>
          <p>${r.comentario || ""}</p>
        </article>
      `;
    });
  } else {
    resenas.innerHTML = `<div class="empty">Aún no hay reseñas, sé el primero en opinar.</div>`;
  }
}

cargarRestaurante();
