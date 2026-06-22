document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const spinner = document.getElementById('spinner');
    const container = document.getElementById('notes-container');

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            renderNotes(data);
        } catch (error) {
            container.innerHTML = `<p style="color: #ef4444;">Error loading release notes. Please try again.</p>`;
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const setLoading = (isLoading) => {
        refreshBtn.disabled = isLoading;
        if (isLoading) {
            spinner.classList.add('active');
        } else {
            spinner.classList.remove('active');
        }
    };

    const renderNotes = (notes) => {
        container.innerHTML = '';
        if (notes.length === 0) {
            container.innerHTML = '<p>No release notes found.</p>';
            return;
        }

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const dateStr = new Date(note.published).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const contentSnippet = note.summary || note.content || '';
            const tweetText = `BigQuery Update: ${note.title} - ${note.link}`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

            card.innerHTML = `
                <div class="note-header">
                    <h2 class="note-title">${note.title}</h2>
                    <span class="note-date">${dateStr}</span>
                </div>
                <div class="note-content">
                    ${contentSnippet}
                </div>
                <a href="${tweetUrl}" target="_blank" class="tweet-btn">
                    <svg class="tweet-icon" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Tweet
                </a>
            `;
            container.appendChild(card);
        });
    };

    refreshBtn.addEventListener('click', fetchNotes);
    
    // Initial fetch
    fetchNotes();
});
