function mostrarLogin() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function mostrarRegistro() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
}

function volverInicio() {
  document.getElementById("startScreen").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginInputs").innerHTML = "";
  document.getElementById("registroInputs").innerHTML = "";
  document.getElementById("rol").value = "";
  document.getElementById("rolRegistro").value = "";
}

function cambiarFormulario(contexto) {
  const rol = contexto === 'login'
    ? document.getElementById("rol").value
    : document.getElementById("rolRegistro").value;

  const container = contexto === 'login'
    ? document.getElementById("loginInputs")
    : document.getElementById("registroInputs");

  container.innerHTML = "";

  if (contexto === 'registro') {
    if (rol === 'estudiante') {
      window.location.href = "registroestudiante.html";
      return;
    }
    if (rol === 'admin') {
      window.location.href = "registroadmin.html";
      return;
    }
  }

  if (contexto === 'login') {
    if (rol === "estudiante") {
      container.innerHTML = `
        <input type="email" id="loginCorreoEstudiante" placeholder="Ingrese su correo universitario" />
        <input type="password" id="loginPassEstudiante" placeholder="Contraseña" />
        <button onclick="ingresarEstudiante()">Ingresar</button>
      `;
    } else if (rol === "admin") {

      window.location.href = "inicioadmin.html";
    }
  }
}


async function ingresarEstudiante() {
  const correo = document.getElementById("loginCorreoEstudiante").value;
  const contraseña = document.getElementById("loginPassEstudiante").value;

  if (!correo.endsWith("@uanl.edu.mx")) {
    alert("El correo debe terminar en @uanl.edu.mx");
    return;
  }

  if (!contraseña) {
    alert("Ingrese su contraseña");
    return;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      alert(data.message);
      window.location.href = 'pantaprincipal.html';
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    alert('Error en el servidor.');
  }
}

function ingresarAdmin() {
  const correo = document.getElementById("loginAdminCorreo").value;
  const contraseña = document.getElementById("loginAdminPassword").value;
  const clave = document.getElementById("loginAdminClave").value;

  if (!correo || !contraseña || !clave) {
    alert("Por favor, complete todos los campos");
    return;
  }

  if (clave !== "12345") {
    alert("Clave de administrador incorrecta");
    return;
  }


  alert("Inicio de sesión exitoso como administrador (simulado)");
  window.location.href = "inicioadmin.html";
}

