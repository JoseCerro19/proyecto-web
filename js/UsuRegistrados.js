document.addEventListener('DOMContentLoaded', function() {
    var usuarios = [
        {
            "correo": "jo@gmail.com",
            "nombre": "Jose",
            "apellido": "Cerro",
            "contraseña": "123",
            "roles": "Administrador",
            "pais": "Colombia",
            "id": "1"
        },
        {
            "correo": "diegova@gmail.com",
            "nombre": "Diego",
            "apellido": "Vasquez",
            "contraseña": "1234",
            "roles": "Administrador",
            "pais": "Colombia",
            "id": "2"
        },
        {
            "correo": "danielafo@gmail.com",
            "nombre": "Daniela",
            "apellido": "Fontalvo",
            "contraseña": "12345",
            "roles": "Usuario",
            "pais": "Venezuela",
            "id": "3"
        },
        {
            "correo": "kevinalva@gmail.com",
            "nombre": "kevin",
            "apellido": "Alvarez",
            "contraseña": "123456",
            "roles": "Usuario",
            "pais": "Peru",
            "id": "4"
        },
        {
            "correo": "sofiaro@gmail.com",
            "nombre": "Sofia",
            "apellido": "Rojas",
            "contraseña": "1234567",
            "roles": "Usuario",
            "pais": "Mexico",
            "id": "5"
        },
        {
            "correo": "elvita@gmail.com",
            "nombre": "Elvira",
            "apellido": "Taylor",
            "contraseña": "12345678",
            "roles": "Usuario",
            "pais": "Mexico",
            "id": "6"
        },
        {
            "correo": "evelyn@gmail.com",
            "nombre": "Evelyn",
            "apellido": "Acuña",
            "contraseña": "12345678",
            "roles": "Usuario",
            "pais": "Inglaterra",
            "id": "7"
        }
    ];

    var tabla = document.getElementById('user-table');
    var cuerpoTabla = document.getElementById('user-table-body');

    usuarios.forEach(function(usuario) {
        var fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.roles}</td>
            <td>${usuario.pais}</td>
        `;

        cuerpoTabla.appendChild(fila);
    });
});
