let sortedNotes = [];

async function fetchNotes() {
    try {
        const response = await fetch('../JSON/notes.json');
        const data = await response.json();
        return data.notes;
    } catch (error) {
        console.error('Error loading notes:', error);
        return [];
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function createNoteCard(note, index) {
    return `
        <article class="note-card" data-note-index="${index}">
            <div class="note-header">
                <h3>${note.title}</h3>
                <time datetime="${note.date}">${formatDate(note.date)}</time>
            </div>
            <p class="note-preview">${note.preview}</p>
            <div class="note-footer">
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <button onclick="openNote(${index})" class="read-more">Read More</button>
            </div>
        </article>
    `;
}

async function populateNotes() {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;

    const notes = await fetchNotes();
    sortedNotes = notes.sort((a, b) => new Date(b.date) - new Date(a.date));
    notesGrid.innerHTML = sortedNotes.map((note, i) => createNoteCard(note, i)).join('');
}

function openNote(index) {
    const note = sortedNotes[index];
    if (!note) return;

    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.innerHTML = `
        <div class="note-modal-content">
            <button onclick="closeNote()" class="close-button">&times;</button>
            <div class="note-modal-body">
                <h2>${note.title}</h2>
                <time datetime="${note.date}">Published: ${formatDate(note.date)}</time>
                ${note.lastUpdated !== note.date ?
                    `<time datetime="${note.lastUpdated}">Updated: ${formatDate(note.lastUpdated)}</time>`
                    : ''}
                <div class="note-content">${note.content}</div>
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.addEventListener('keydown', handleEscKey);
}

function closeNote() {
    const modal = document.querySelector('.note-modal');
    if (modal) {
        modal.remove();
        document.removeEventListener('keydown', handleEscKey);
    }
}

function handleEscKey(event) {
    if (event.key === 'Escape') closeNote();
}

document.addEventListener('DOMContentLoaded', () => {
    populateNotes();

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-section').forEach(el => fadeObserver.observe(el));
});
