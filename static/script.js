document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const spinner = document.getElementById('spinner');
    const container = document.getElementById('notes-container');
    let currentNotes = [];

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            currentNotes = data;
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

    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const escapeCsv = (str) => {
        if (!str) return '""';
        const stripped = stripHtml(str).replace(/"/g, '""');
        return `"${stripped}"`;
    };

    const exportToCsv = () => {
        if (currentNotes.length === 0) return;
        
        const headers = ['Title', 'Date', 'Link', 'Summary'];
        const csvRows = [headers.join(',')];

        currentNotes.forEach(note => {
            const dateStr = new Date(note.published).toLocaleDateString();
            const row = [
                escapeCsv(note.title),
                escapeCsv(dateStr),
                escapeCsv(note.link),
                escapeCsv(note.summary || note.content)
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'bigquery_release_notes.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderNotes = (notes) => {
        container.innerHTML = '';
        if (notes.length === 0) {
            container.innerHTML = '<p>No release notes found.</p>';
            return;
        }

        notes.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const dateStr = new Date(note.published).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const contentSnippet = note.summary || note.content || '';
            const plainTextSnippet = stripHtml(contentSnippet).trim();
            const tweetText = `BigQuery Update: ${note.title} - ${note.link}`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

            card.innerHTML = `
                <div class="note-header">
                    <h2 class="note-title">${note.title}</h2>
                    <span class="note-date">${dateStr}</span>
                </div>
                <div class="note-content" id="content-${index}">
                    ${contentSnippet}
                </div>
                <div class="card-actions">
                    <a href="${tweetUrl}" target="_blank" class="tweet-btn">
                        <svg class="tweet-icon" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Tweet
                    </a>
                    <button class="copy-btn" data-text="${encodeURIComponent(note.title + '\n' + note.link + '\n\n' + plainTextSnippet)}">
                        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        // Add copy event listeners
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const textToCopy = decodeURIComponent(e.currentTarget.getAttribute('data-text'));
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    const originalHTML = e.currentTarget.innerHTML;
                    e.currentTarget.innerHTML = `
                        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Copied!
                    `;
                    e.currentTarget.style.backgroundColor = '#10b981';
                    setTimeout(() => {
                        e.currentTarget.innerHTML = originalHTML;
                        e.currentTarget.style.backgroundColor = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            });
        });
    };

    refreshBtn.addEventListener('click', fetchNotes);
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportToCsv);
    
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-theme');
            document.body.classList.toggle('light-theme');
        });
    }
    
    // Initial fetch
    fetchNotes();
});
