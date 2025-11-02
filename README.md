# AD-MEDTECH

This repository now contains a lightweight front-end that lets you exercise the book REST API described in the requirements screenshot.

## Front-end preview

The static files live in [`frontend/`](frontend/). Open `index.html` in a browser that can reach your backend (e.g. by serving the folder with `python -m http.server`) and you will be able to:

- List all books (`GET /books`).
- Fetch a single book by id (`GET /books/:id`).
- Add a new book (`POST /books`).
- Update book information or mark a book as read (`PATCH /books/:id`).
- Delete a book (`DELETE /books/:id`).

The page calls the API via `fetch` using same-origin relative URLs, so host the static assets on the same origin/port as your backend or adjust `API_BASE` in [`frontend/app.js`](frontend/app.js).
