function aceptarReseña() {
  window.location.href = "reseñas.html";
}

function volverEventos() {
  window.location.href = "eventos.html";
}

function irA(pagina) {
  window.location.href = pagina;
}

function filtrarEventos() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  console.log("Filtrar por:", texto);
}
