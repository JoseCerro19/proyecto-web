
document.addEventListener('DOMContentLoaded', function () {
    const datosUsuario = JSON.parse(localStorage.getItem('Nombre'));
    console.log(datosUsuario);

    if (datosUsuario.tipousu === 'administrador') {
        const botonUsuario = document.getElementById('tipousuarios');
        botonUsuario.style.display = 'block';
    }

    if(datosUsuario.tipousu === 'usuario'){
        const botonPerfil = document.getElementById('perfil');
        botonPerfil.style.display = 'block';
    }
});


const redirigir = () =>{
    const datosUsuario = JSON.parse(localStorage.getItem('Nombre'));
    console.log(datosUsuario);

    if (datosUsuario.tipousu === 'administrador'){
        window.location.href = 'pag-Admin.html'
    }else{
        window.location.href = 'pag-Usuario.html'
    }
}