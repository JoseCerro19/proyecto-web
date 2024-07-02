document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('new-post-form');
    const postList = document.getElementById('post-list');
    const postContentTextarea = document.getElementById('post-content');

    postContentTextarea.addEventListener('input', () => {
        postContentTextarea.style.height = 'auto';
        postContentTextarea.style.height = postContentTextarea.scrollHeight + 'px';
    });

    postForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = postContentTextarea.value;

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

        postForm.reset();
        postContentTextarea.style.height = 'auto';
    });

    postList.addEventListener('submit', (event) => {
        event.preventDefault();

        if (event.target.classList.contains('new-reply-form')) {
            const replyContent = event.target.querySelector('.reply-content').value;
            const repliesContainer = event.target.parentElement.nextElementSibling;

            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            replyElement.textContent = replyContent;

            repliesContainer.appendChild(replyElement);

            event.target.reset();
        }
    });
});
