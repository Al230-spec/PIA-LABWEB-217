// LIKE
if (localStorage.getItem('botonOculto') === 'true') {
      document.getElementById('likeBtn').style.display = 'none';
}

let likeCount = 0;
const likeBtn = document.getElementById('likeBtn');
const likeDisplay = document.getElementById('likeCount');

likeBtn.addEventListener('click', () => {
  likeCount++;
  likeDisplay.textContent = likeCount;
});

document.getElementById('likeBtn').addEventListener('click', function () {
  this.style.display = 'none'; // Ocultar el botón
    localStorage.setItem('botonOculto', 'true'); 
});


// ESTRELLAS
const estrellas = document.querySelectorAll('#estrellas span');

estrellas.forEach((estrella, index) => {
  estrella.addEventListener('click', () => {
    estrellas.forEach(e => e.classList.remove('seleccionada'));
    for (let i = 0; i <= index; i++) {
      estrellas[i].classList.add('seleccionada');
    }
  });
});


