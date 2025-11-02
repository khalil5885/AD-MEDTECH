const API_BASE = '/books';

const globalStatusEl = document.querySelector('#global-status');
const refreshBtn = document.querySelector('#refresh-btn');
const booksTableBody = document.querySelector('#books-table tbody');
const bookRowTemplate = document.querySelector('#book-row-template');
const lookupForm = document.querySelector('#lookup-form');
const lookupResult = document.querySelector('#lookup-result');
const addForm = document.querySelector('#add-form');
const updateForm = document.querySelector('#update-form');
const deleteForm = document.querySelector('#delete-form');

function displayStatus(message, type = 'info') {
  if (!globalStatusEl) return;
  globalStatusEl.textContent = message;
  globalStatusEl.dataset.type = type;
}

function toJSON(response) {
  if (!response.ok) {
    return response.json().then((payload) => {
      const error = new Error(payload?.message || response.statusText);
      error.details = payload;
      throw error;
    });
  }
  return response.json();
}

function renderBooks(books = []) {
  booksTableBody.innerHTML = '';
  if (!Array.isArray(books) || books.length === 0) {
    const row = bookRowTemplate.content.cloneNode(true);
    row.querySelector('.book-id').textContent = '—';
    row.querySelector('.book-title').textContent = 'No books found';
    row.querySelector('.book-author').textContent = '—';
    row.querySelector('.book-year').textContent = '—';
    row.querySelector('.book-read').textContent = '—';
    booksTableBody.appendChild(row);
    return;
  }

  books.forEach((book) => {
    const row = bookRowTemplate.content.cloneNode(true);
    row.querySelector('.book-id').textContent = book.id ?? '—';
    row.querySelector('.book-title').textContent = book.title ?? '—';
    row.querySelector('.book-author').textContent = book.author ?? '—';
    row.querySelector('.book-year').textContent = book.year ?? '—';
    const readCell = row.querySelector('.book-read');
    const isRead = Boolean(book.isRead ?? book.read ?? book.completed ?? false);
    readCell.textContent = isRead ? 'Yes' : 'No';
    readCell.dataset.read = String(isRead);
    booksTableBody.appendChild(row);
  });
}

async function loadBooks() {
  displayStatus('Loading books…');
  try {
    const books = await fetch(API_BASE).then(toJSON);
    renderBooks(books);
    displayStatus(`Loaded ${books.length} book${books.length === 1 ? '' : 's'}.`, 'success');
  } catch (error) {
    console.error('Failed to load books', error);
    renderBooks([]);
    displayStatus(`Failed to load books: ${error.message}`, 'error');
  }
}

refreshBtn?.addEventListener('click', loadBooks);

lookupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(lookupForm);
  const id = formData.get('id');
  if (!id) return;

  lookupResult.textContent = 'Loading…';

  try {
    const book = await fetch(`${API_BASE}/${id}`).then(toJSON);
    lookupResult.textContent = JSON.stringify(book, null, 2);
    displayStatus(`Loaded book ${id}.`, 'success');
  } catch (error) {
    console.error('Failed to fetch book', error);
    lookupResult.textContent = `Error: ${error.message}`;
    displayStatus(`Failed to fetch book: ${error.message}`, 'error');
  }
});

addForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(addForm);
  const payload = {
    title: formData.get('title')?.trim(),
    author: formData.get('author')?.trim(),
    year: formData.get('year') ? Number(formData.get('year')) : undefined,
    isRead: formData.get('isRead') === 'on',
  };

  try {
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(toJSON);
    addForm.reset();
    displayStatus('Book created successfully!', 'success');
    await loadBooks();
  } catch (error) {
    console.error('Failed to add book', error);
    displayStatus(`Failed to add book: ${error.message}`, 'error');
  }
});

updateForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(updateForm);
  const id = formData.get('id');
  if (!id) return;

  const payload = {};
  const title = formData.get('title')?.trim();
  const author = formData.get('author')?.trim();
  const year = formData.get('year');
  const isRead = formData.get('isRead');

  if (title) payload.title = title;
  if (author) payload.author = author;
  if (year) payload.year = Number(year);
  if (isRead !== null) payload.isRead = isRead === 'on';

  if (Object.keys(payload).length === 0) {
    displayStatus('Provide at least one field to update.', 'error');
    return;
  }

  try {
    await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(toJSON);
    updateForm.reset();
    displayStatus(`Book ${id} updated successfully.`, 'success');
    await loadBooks();
  } catch (error) {
    console.error('Failed to update book', error);
    displayStatus(`Failed to update book: ${error.message}`, 'error');
  }
});

deleteForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(deleteForm);
  const id = formData.get('id');
  if (!id) return;

  if (!confirm(`Are you sure you want to delete book ${id}?`)) {
    return;
  }

  try {
    await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    });
    deleteForm.reset();
    displayStatus(`Book ${id} deleted successfully.`, 'success');
    await loadBooks();
  } catch (error) {
    console.error('Failed to delete book', error);
    displayStatus(`Failed to delete book: ${error.message}`, 'error');
  }
});

loadBooks();

