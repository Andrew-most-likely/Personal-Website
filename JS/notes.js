// Store notes data globally after fetching
let notesData = [];

// Fetch notes data
async function fetchNotes() {
    try {
        const response = await fetch('../JSON/notes.json');
        const data = await response.json();
        notesData = data.notes; // Store the notes data
        return data.notes;
    } catch (error) {
        console.error('Error loading notes:', error);
        return [];
    }
}

// Format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Create HTML for a single note card
function createNoteCard(note) {
    return `
        <article class="note-card" data-note-id="${note.id}">
            <div class="note-header">
                <h3>${note.title}</h3>
                <time datetime="${note.date}">${formatDate(note.date)}</time>
            </div>
            <p class="note-preview">${note.preview}</p>
            <div class="note-footer">
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <button onclick="openNote(${note.id})" class="read-more">Read More</button>
            </div>
        </article>
    `;
}

// Populate notes grid
async function populateNotes() {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;

    const notes = await fetchNotes();
    notesGrid.innerHTML = notes
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(createNoteCard)
        .join('');
}

// Open individual note
function openNote(noteId) {
    const note = notesData.find(n => n.id === noteId);
    if (!note) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.innerHTML = `
        <div class="note-modal-content">
            <button onclick="closeNote()" class="close-button">&times;</button>
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
    `;
    document.body.appendChild(modal);

    // Add escape key listener
    document.addEventListener('keydown', handleEscKey);
}

// Close note modal
function closeNote() {
    const modal = document.querySelector('.note-modal');
    if (modal) {
        modal.remove();
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscKey);
    }
}

// Handle escape key press
function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeNote();
    }
}

// Initialize notes section
document.addEventListener('DOMContentLoaded', () => {
    populateNotes();
    
});