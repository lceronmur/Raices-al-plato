async function cargarProducto() {
  // 1. Obtener el parámetro ?item=xxx
  const params = new URLSearchParams(window.location.search);
  const item = params.get("item");

  if (!item) {
    alert("No se especificó producto");
    return;
  }

  // 2. Cargar base de datos JSON
  const response = await fetch("data/productos.json");
  const data = await response.json();

  const producto = data[item];
  if (!producto) {
    alert("Producto no encontrado");
    return;
  }

  // 3. Insertar datos en el HTML
  document.getElementById("producto-title").innerText = producto.nombre;
  document.getElementById("titulo-producto").innerText = producto.nombre;

  const breadcrumbEl = document.getElementById("breadcrumb");
  if (breadcrumbEl) {
    const crumbs = [
      { label: "Inicio", href: "index.html" },
      { label: "Mapa", href: "mapa.html" },
      { label: "Producto", href: null },
      { label: producto.nombre, href: null }
    ];
    breadcrumbEl.innerHTML = crumbs
      .map(c => c.href ? `<a href="${c.href}">${c.label}</a>` : `<span>${c.label}</span>`)
      .join(" > ");
  }

  document.getElementById("texto-que-es").innerText = producto.que_es;
  document.getElementById("texto-descripcion").innerText = producto.descripcion;

  // imágenes y video
  const videoCard = document.getElementById("video-card");
  const videoOverlay = document.getElementById("video-overlay");
  const videoThumb = document.getElementById("video-thumb");
  const videoPlayer = document.getElementById("product-video");
  const ytPlayer = document.getElementById("product-yt");
  const playButton = videoOverlay.querySelector(".play-btn");

  const poster = "imagenes/" + (producto.video?.poster || producto.imagenes.video_thumb);
  videoThumb.src = poster;

  const videoSrc = producto.video?.src;
  const resolvedVideoSrc = videoSrc
    ? (videoSrc.startsWith("http") ? videoSrc : `videos/${videoSrc}`)
    : null;

  const getYouTubeId = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1);
      }
      if (u.hostname.includes("youtube.com")) {
        if (u.searchParams.get("v")) return u.searchParams.get("v");
        const parts = u.pathname.split("/");
        const watchIndex = parts.indexOf("embed");
        if (watchIndex !== -1 && parts[watchIndex + 1]) return parts[watchIndex + 1];
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const youtubeId = resolvedVideoSrc ? getYouTubeId(resolvedVideoSrc) : null;

  if (youtubeId) {
    // Mostrar embed de YouTube
    videoCard.classList.add("is-yt");
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    videoOverlay.addEventListener("click", () => {
      ytPlayer.src = embedUrl;
      ytPlayer.style.display = "block";
      videoCard.classList.add("is-playing");
    });
  } else if (resolvedVideoSrc) {
    videoPlayer.src = resolvedVideoSrc;
    videoPlayer.poster = poster;
    videoPlayer.controls = true;

    const iniciarVideo = () => {
      videoCard.classList.add("is-playing");
      videoPlayer.play();
    };

    videoOverlay.addEventListener("click", iniciarVideo);
    videoPlayer.addEventListener("play", () => videoCard.classList.add("is-playing"));
    videoPlayer.addEventListener("ended", () => videoCard.classList.remove("is-playing"));
    videoPlayer.addEventListener("pause", () => {
      if (videoPlayer.currentTime === 0) {
        videoCard.classList.remove("is-playing");
      }
    });
  } else {
    videoCard.classList.add("no-video");
    playButton.innerText = "Sin video";
  }

  document.getElementById("img1").src = "imagenes/" + producto.imagenes.img1;
  document.getElementById("img2").src = "imagenes/" + producto.imagenes.img2;
  document.getElementById("dog1").src = "imagenes/" + producto.imagenes.dog1;
  document.getElementById("dog2").src = "imagenes/" + producto.imagenes.dog2;

  // ingredientes
  const ul = document.getElementById("lista-ingredientes");
  ul.innerHTML = "";
  producto.ingredientes.forEach(ing => {
    ul.innerHTML += `<li>- ${ing}</li>`;
  });

  // lugares recomendados
  const tarjetas = document.getElementById("tarjetas-lugares");
  tarjetas.innerHTML = "";
  producto.lugares.forEach(l => {
    const enlace = l.restauranteId ? `<a class="btn-link" href="/restaurante.html?id=${l.restauranteId}">Ver más</a>` : "";
    tarjetas.innerHTML += `
        <div class="tarjeta">
            <img src="imagenes/${l.img}">
            <h3>${l.nombre}</h3>
            <p>${l.direccion}</p>
            ${enlace}
        </div>`;
  });

}

cargarProducto();
