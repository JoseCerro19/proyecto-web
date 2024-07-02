{{const validarDatos = (event) => {
  event.preventDefault(); // Prevenir el envío del formulario
  
  fetch('../json/login.json')
    .then(response => {
      return response.ok ? response.json() : Promise.reject(response);
    })

    .then(data => {
      let correo = document.getElementById("email").value.toLowerCase();
      correo = correo.replace(/\s+/g, '');
      let password = document.getElementById("password").value;
      let sw = false;
    
      data.forEach(element => {
        if (element.correo === correo && element.contraseña === password) {
          if (element.roles === "administrador") {
            window.location.href = "../html/pag-Admin.html";
          } else if (element.roles === "usuario") {
            window.location.href = "../html/pag-Usuario.html";
          }
          let NombreCompleto = {
            nombre: element.nombre,
            apellido: element.apellido,
            tipousu: element.roles
          };
          
          // Convertir objeto a JSON y guardarlo en local storage
          localStorage.setItem('Nombre', JSON.stringify(NombreCompleto));
          sw = true;
          return; 
        }
      });
      
      if (!sw) {
        alert("Correo o contraseña inválido");
      }
    })
    .catch(error => {
      console.error('Error al leer el archivo JSON:', error);
    });
};

document.getElementById('loginForm').addEventListener('submit', validarDatos);
}}