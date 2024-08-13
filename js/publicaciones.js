document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('new-post-form');
    const postList = document.getElementById('post-list');
    const postContentTextarea = document.getElementById('post-content');
    const nombreCompleto = JSON.parse(localStorage.getItem('Nombre'));

    if (!nombreCompleto) {
        alert('No se ha encontrado el nombre de usuario en el localStorage.');
        return;
    }

    const idUsuario = nombreCompleto.id;
    const esAdmin = nombreCompleto.tipousu === 'administrador';

    // Ajustar la altura del textarea automáticamente
    postContentTextarea.addEventListener('input', () => {
        postContentTextarea.style.height = 'auto';
        postContentTextarea.style.height = postContentTextarea.scrollHeight + 'px';
    });

    // Función para crear una publicación
    const createPost = async (content, idUsuario) => {
        try {
            const response = await fetch('https://proyecto-web-azure.vercel.app/publicaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contenido: content, id_usuario: idUsuario })
            });

            if (!response.ok) {
                throw new Error('Error al crear la publicación');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            alert('Error al crear la publicación: ' + error.message);
        }
    };

    // Función para obtener todas las publicaciones
    const fetchPosts = async () => {
        try {
            const response = await fetch('https://proyecto-web-azure.vercel.app/publicaciones');
            if (!response.ok) {
                throw new Error('Error al obtener las publicaciones');
            }

            const posts = await response.json();
            postList.innerHTML = ''; // Limpiar la lista de publicaciones
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'card mb-3';
                postElement.dataset.id = post.id_publi; // Añadir data-id aquí
                postElement.innerHTML = `
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="username">${post.nombre_usuario}</span>
                        <div class="d-flex align-items-center">
                            <button type="button" class="btn btn-info btn-sm me-2 toggle-replies">Mostrar respuestas</button>
                            ${post.id_usuario === idUsuario || esAdmin ? `
                            <button class="btn btn-secondary btn-sm me-2 edit-post" data-id="${post.id_publi}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-post" data-id="${post.id_publi}">Eliminar</button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${post.contenido}</p>
                        <div class="reply-form">
                            <form class="new-reply-form">
                                <div class="mb-3">
                                    <label for="reply-content" class="form-label">Responder:</label>
                                    <textarea class="form-control" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-secondary">Responder</button>
                            </form>
                        </div>
                        <div class="replies mt-3" style="display: none;">
                            <!-- Aquí se agregarán las respuestas -->
                        </div>
                    </div>
                `;
                postList.appendChild(postElement);
            });
        } catch (error) {
            console.error(error);
            alert('Error al obtener las publicaciones: ' + error.message);
        }
    };

    // Función para obtener todas las respuestas de una publicación específica
    const fetchReplies = async (postId) => {
        try {
            const response = await fetch(`https://proyecto-web-azure.vercel.app/publicaciones/${postId}/respuestas`);
            if (!response.ok) {
                throw new Error('Error al obtener las respuestas');
            }

            const replies = await response.json();
            return replies;
        } catch (error) {
            console.error(error);
            alert('Error al obtener las respuestas: ' + error.message);
        }
    };

    // Función para crear una respuesta
    const createReply = async (content, postId, idUsuario) => {
        try {
            const response = await fetch('https://proyecto-web-azure.vercel.app/respuestas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contenido: content, publicacion_id: postId, id_usuario: idUsuario })
            });

            if (!response.ok) {
                throw new Error('Error al crear la respuesta');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            alert('Error al crear la respuesta: ' + error.message);
        }
    };

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

    // Manejar el envío del formulario de nueva publicación
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const content = postContentTextarea.value;

        if (content.trim() === '') {
            alert('El contenido no puede estar vacío.');
            return;
        }

        await createPost(content, idUsuario);

        postForm.reset();
        postContentTextarea.style.height = 'auto';
        alert('Publicación creada con éxito!');
        
        // Refrescar la lista de publicaciones
        fetchPosts();
    });

    // Manejar el envío del formulario de respuestas
    postList.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (event.target.classList.contains('new-reply-form')) {
            const replyContent = event.target.querySelector('textarea').value;
            const postElement = event.target.closest('.card');
            const postId = postElement.dataset.id; // Obtener el ID de la publicación

            if (replyContent.trim() === '') {
                alert('El contenido de la respuesta no puede estar vacío.');
                return;
            }

            const reply = await createReply(replyContent, postId, idUsuario);

            const replyElement = document.createElement('div');
            replyElement.className = 'card mb-2';
            replyElement.innerHTML = `
                <div class="card-body">
                    <p class="username mb-1">${reply.nombre_usuario}</p> <!-- Nombre del usuario sobre la respuesta -->
                    <p class="card-text">${reply.contenido}</p>
                    <!-- Eliminar los botones de edición y eliminación para todos los usuarios -->
                </div>
            `;

            event.target.reset();

            const repliesContainer = postElement.querySelector('.replies');
            repliesContainer.appendChild(replyElement);
        }
    });

    // Manejar la eliminación y edición de publicaciones y respuestas
    postList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-post')) {
            const postId = event.target.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
                await deletePost(postId);
            }
        }

        if (event.target.classList.contains('edit-post')) {
            const postId = event.target.dataset.id;
            const postElement = event.target.closest('.card');
            const postContent = postElement.querySelector('.card-text').textContent;

            const newContent = prompt('Editar contenido:', postContent);

            if (newContent && newContent.trim() !== '') {
                await editPost(postId, newContent);
            }
        }

        if (event.target.classList.contains('delete-reply')) {
            const replyId = event.target.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar esta respuesta?')) {
                await deleteReply(replyId);
            }
        }

        if (event.target.classList.contains('edit-reply')) {
            const replyId = event.target.dataset.id;
            const replyElement = event.target.closest('.card-body');
            const replyContent = replyElement.querySelector('.card-text').textContent;

            const newContent = prompt('Editar contenido:', replyContent);

            if (newContent && newContent.trim() !== '') {
                await editReply(replyId, newContent);
            }
        }

        if (event.target.classList.contains('toggle-replies')) {
            const postElement = event.target.closest('.card');
            const repliesContainer = postElement.querySelector('.replies');

            if (repliesContainer.style.display === 'none' || repliesContainer.style.display === '') {
                const postId = postElement.dataset.id;
                const replies = await fetchReplies(postId);

                repliesContainer.innerHTML = ''; // Limpiar el contenedor de respuestas

                replies.forEach(reply => {
                    const replyElement = document.createElement('div');
                    replyElement.className = 'card mb-2';
                    replyElement.innerHTML = `
                        <div class="card-body">
                            <p class="username mb-1">${reply.nombre_usuario}</p> <!-- Nombre del usuario sobre la respuesta -->
                            <p class="card-text">${reply.contenido}</p>
                            <!-- Eliminar los botones de edición y eliminación para todos los usuarios -->
                        </div>
                    `;
                    repliesContainer.appendChild(replyElement);
                });

                repliesContainer.style.display = 'block';
                event.target.textContent = 'Ocultar respuestas';
            } else {
                repliesContainer.style.display = 'none';
                event.target.textContent = 'Mostrar respuestas';
            }
        }
    });

    // Cargar todas las publicaciones al cargar la página
    fetchPosts();
});
