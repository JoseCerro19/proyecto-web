var ruta = 'http://127.0.0.1:5000';

document.getElementById('registroForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var nombre = document.getElementById('username').value;
    var apellido = document.getElementById('lastname').value;
    var email = document.getElementById('email').value;
    var contra1 = document.getElementById('password').value;
    var contra2 = document.getElementById('confirmPassword').value;

    console.log(nombre, apellido, email, contra1);
    
    if (!validarEmail(email)) {
        alert('Hubo un error, el correo debe llevar "@" y un "."');
        return;
    }
    
    if (contra1.length >= 6 && contra1.length <= 15) {
        if (contra1 === contra2) {
            fetch(ruta + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre: nombre, apellido: apellido, email: email, contra: contra1, rol: "usuario" })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Se ha registrado de manera exitosa');
                } else {
                    alert('Lo sentimos, esta cuenta ya se encuentra registrada ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error en el registro');
            });
        } else {
            alert("Las contraseñas no coinciden");
        }
    } else {
        alert("La contraseña debe tener entre 6 y 15 caracteres");
    }
});

function validarEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
