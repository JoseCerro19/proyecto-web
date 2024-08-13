document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const nombreCompleto = JSON.parse(localStorage.getItem('Nombre'));

    if (!nombreCompleto) {
        alert('No se ha encontrado el nombre de usuario en el localStorage.');
        return;
    }

    const idUsuario = nombreCompleto.id;
    const esAdmin = nombreCompleto.rol === 'administrador';

    // Función para eliminar una publicación
    const deletePost = async (postId) => {
        try {
            const response = await fetch(`https://proyecto-web-azure.vercel.app/eliminar_publicaciones/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_usuario: idUsuario })
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la publicación');
            }

            alert('Publicación eliminada con éxito!');
            fetchPosts();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar la publicación: ' + error.message);
        }
    };

    // Función para editar una publicación
    const editPost = async (postId, newContent) => {
        try {
            const response = await fetch(`https://proyecto-web-azure.vercel.app/editar_publicaciones/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contenido: newContent, id_usuario: idUsuario })
            });

            if (!response.ok) {
                throw new Error('Error al editar la publicación');
            }

            alert('Publicación actualizada con éxito!');
            fetchPosts();
        } catch (error) {
            console.error(error);
            alert('Error al editar la publicación: ' + error.message);
        }
    };

    // Función para eliminar una respuesta
    const deleteReply = async (replyId) => {
        try {
            const response = await fetch(`https://proyecto-web-azure.vercel.app/eliminar_respuestas/${replyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_usuario: idUsuario })
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la respuesta');
            }

            alert('Respuesta eliminada con éxito!');
            fetchPosts();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar la respuesta: ' + error.message);
        }
    };

    // Función para editar una respuesta
    const editReply = async (replyId, newContent) => {
        try {
            const response = await fetch(`https://proyecto-web-azure.vercel.app/editar_respuestas/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contenido: newContent, id_usuario: idUsuario })
            });

            if (!response.ok) {
                throw new Error('Error al editar la respuesta');
            }

            alert('Respuesta actualizada con éxito!');
            fetchPosts();
        } catch (error) {
            console.error(error);
            alert('Error al editar la respuesta: ' + error.message);
        }
    };

    // Función para mostrar y ocultar las respuestas
    const toggleReplies = async (postId, repliesContainer) => {
        if (repliesContainer.style.display === 'none' || repliesContainer.style.display === '') {
            repliesContainer.style.display = 'block';
            const replies = await fetchReplies(postId);
            replies.forEach(reply => {
                const replyElement = document.createElement('div');
                replyElement.className = 'card mb-2';
                replyElement.innerHTML = `
                    <div class="card-body">
                        <p class="card-text">${reply.contenido}</p>
                        <span class="username">${reply.nombre_usuario}</span>
                        ${reply.id_usuario === idUsuario || esAdmin ? `
                        <button type="button" class="btn btn-danger btn-sm float-end delete-reply" data-id="${reply.id_respuesta}">Eliminar</button>
                        ` : ''}
                    </div>
                `;
                repliesContainer.appendChild(replyElement);
            });
        } else {
            repliesContainer.style.display = 'none';
            repliesContainer.innerHTML = '';
        }
    };

    // Manejar la eliminación y edición de publicaciones
    postList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-post')) {
            const postElement = event.target.closest('.card');
            const postId = postElement.dataset.id;
            const newContent = prompt('Nuevo contenido de la publicación:');
            if (newContent !== null) {
                await editPost(postId, newContent);
            }
        } else if (event.target.classList.contains('delete-post')) {
            const postElement = event.target.closest('.card');
            const postId = postElement.dataset.id;
            const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta publicación?');
            if (confirmDelete) {
                await deletePost(postId);
            }
        } else if (event.target.classList.contains('delete-reply')) {
            const replyId = event.target.dataset.id;
            const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta respuesta?');
            if (confirmDelete) {
                await deleteReply(replyId);
            }
        }
    });

    // Manejar la visualización de respuestas
    postList.addEventListener('click', (event) => {
        if (event.target.classList.contains('toggle-replies')) {
            const postElement = event.target.closest('.card');
            const repliesContainer = postElement.querySelector('.replies');
            toggleReplies(postElement.dataset.id, repliesContainer);
        }
    });

    // Función para crear la lista de publicaciones
    const createPostElement = (post) => {
        const postElement = document.createElement('div');
        postElement.className = 'card mb-2';
        postElement.dataset.id = post.id_publi;
        postElement.innerHTML = `
            <div class="card-body">
                <p class="card-text">${post.contenido}</p>
                <span class="username">${post.nombre_usuario}</span>
                ${post.id_usuario === idUsuario || esAdmin ? `
                <div class="dropdown float-end">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><a class="dropdown-item edit-post" href="#">Editar</a></li>
                        <li><a class="dropdown-item delete-post" href="#">Eliminar</a></li>
                    </ul>
                </div>
                ` : ''}
                <button type="button" class="btn btn-info float-end toggle-replies" data-id="${post.id_publi}">Respuestas</button>
                <div class="replies" style="display: none;"></div>
            </div>
        `;
        return postElement;
    };

    // Función para cargar las publicaciones
    const fetchPosts = async () => {
        try {
            const response = await fetch('https://proyecto-web-azure.vercel.app/obtener_publicaciones');
            const posts = await response.json();
            postList.innerHTML = '';
            posts.forEach(post => {
                postList.appendChild(createPostElement(post));
            });
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
        }
    };

    // Cargar las publicaciones al inicio
    fetchPosts();
});
