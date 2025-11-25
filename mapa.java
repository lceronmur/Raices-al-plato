<script>
function cambiarZona(zona) {

  const img = document.getElementById("mapa-img");

  if (zona === "norte") {
    img.src = "imgs/norte.png";
  }
  else if (zona === "centro") {
    img.src = "imgs/centro.png";
  }
  else if (zona === "sur") {
    img.src = "imgs/sur.png";
  }
  else if (zona === "toda") {
    img.src = "imagenes/Mapadividido.png";
  }

}
</script>
