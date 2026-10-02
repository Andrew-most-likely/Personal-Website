let sortedNotes = [];
let lastFocused = null;

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
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function renderTags(tags) {
    return `<div class="note-tags">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`;
}

function createNoteCard(note, index) {
    return `
        <article class="note-card">
            <time datetime="${note.date}">${formatDate(note.date)}</time>
            <div>
                <h3 class="note-title">
                    <button type="button" class="note-open" data-note-index="${index}" aria-haspopup="dialog">${note.title}</button>
                </h3>
                <p class="note-preview">${note.preview}</p>
                ${renderTags(note.tags)}
            </div>
        </article>
    `;
}

async function populateNotes() {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;

    const notes = await fetchNotes();
    sortedNotes = notes.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedNotes.length === 0) {
        notesGrid.innerHTML = '<p class="notes-empty">No notes yet. Check back soon.</p>';
        return;
    }

    notesGrid.innerHTML = sortedNotes.map((note, i) => createNoteCard(note, i)).join('');
    notesGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.note-open');
        if (button) openNote(Number(button.dataset.noteIndex));
    });
}

function openNote(index) {
    const note = sortedNotes[index];
    if (!note) return;

    lastFocused = document.activeElement;

    const updated = note.lastUpdated && note.lastUpdated !== note.date
        ? `<span>Updated <time datetime="${note.lastUpdated}">${formatDate(note.lastUpdated)}</time></span>`
        : '';

    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.innerHTML = `
        <div class="note-modal-content" role="dialog" aria-modal="true" aria-labelledby="note-modal-title">
            <button type="button" class="close-button" aria-label="Close">&times;</button>
            <div class="note-modal-body">
                <p class="note-modal-meta">
                    <span>Published <time datetime="${note.date}">${formatDate(note.date)}</time></span>
                    ${updated}
                </p>
                <h2 id="note-modal-title">${note.title}</h2>
                <div class="note-content">${note.content}</div>
                ${renderTags(note.tags)}
            </div>
        </div>
    `;

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('.close-button')) closeNote();
    });

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleEscKey);
    modal.querySelector('.close-button').focus();
}

function closeNote() {
    const modal = document.querySelector('.note-modal');
    if (!modal) return;

    modal.remove();
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleEscKey);
    if (lastFocused) lastFocused.focus();
}

function handleEscKey(event) {
    if (event.key === 'Escape') closeNote();
}

document.addEventListener('DOMContentLoaded', populateNotes);
