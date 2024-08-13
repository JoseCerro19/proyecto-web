document.addEventListener('DOMContentLoaded', function () {
    var profileImageUpload = document.getElementById('profileImageUpload');
    var profileImage = document.getElementById('profileImage');
    var editProfileForm = document.getElementById('editProfileForm');
    var email;  

    var nombreCompleto = JSON.parse(localStorage.getItem('Nombre'));
    if (nombreCompleto) {
        email = nombreCompleto.correo;

        if (email) {
            fetch('http://127.0.0.1:5000/obtener_detalles', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo: email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.mensaje) {
                    console.error(data.mensaje);
                    alert(data.mensaje);
                } else {
                    document.getElementById('username').value = data.nombre || '';
                    document.getElementById('lastname').value = data.apellido || '';
                    document.getElementById('email').value = data.email || '';
                    document.getElementById('password').value = data.contraseña || '';
                    document.getElementById('bio').value = data.biografia || '';  

                    if (data.imagenPerfil) {
                        profileImage.src = data.imagenPerfil;
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            console.error('No se encontró el correo en localStorage.');
        }
    } else {
        console.error('No se encontraron datos de usuario en localStorage.');
    }

    profileImageUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    editProfileForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var nombre = document.getElementById('username').value;
        var apellido = document.getElementById('lastname').value;
        var email = document.getElementById('email').value;
        var contraseña = document.getElementById('password').value;
        var bio = document.getElementById('bio').value;

        console.log('Nombre de Usuario:', nombre);
        console.log('Apellido de Usuario:', apellido);
        console.log('Correo Electrónico:', email);
        console.log('Contraseña:', contraseña);
        console.log('Biografía:', bio);

        fetch('http://127.0.0.1:5000/actualizar_usuario', { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                email: email,
                contraseña: contraseña,
                bio: bio
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.mensaje || 'Cambios guardados correctamente.');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
