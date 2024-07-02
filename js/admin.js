document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('new-post-form');
    const postList = document.getElementById('post-list');

    postForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        const postElement = document.createElement('div');
        postElement.className = 'post';

        postElement.innerHTML = `
            <div class="post-title">${title}</div>
            <div class="post-content">${content}</div>
            <div class="reply-form">
                <form class="new-reply-form">
                    <textarea class="reply-content" required></textarea>
                    <button type="submit">Responder</button>
                </form>
            </div>
            <div class="replies"></div>
        `;

        postList.appendChild(postElement);

        // Clear the form
        postForm.reset();
    });

    postList.addEventListener('submit', (event) => {
        if (event.target.classList.contains('new-reply-form')) {
            event.preventDefault();

            const replyContent = event.target.querySelector('.reply-content').value;
            const repliesContainer = event.target.nextElementSibling;

            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            replyElement.textContent = replyContent;

            repliesContainer.appendChild(replyElement);

            // Clear the reply form
            event.target.reset();
        }
    });
});
