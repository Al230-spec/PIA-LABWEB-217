function filtrarUsuarios() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    console.log("Filtrar por:", texto);

$(document).ready(function() {
$('#tabla').on('click', '.eliminar', function() {
    $(this).closest('tr').remove();
});
});

}
