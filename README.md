# Book Search

Search millions of books by title or author. Each result shows the cover, authors, and first publication year, and links to the book's page on Open Library. Results load 20 at a time with a "Load more" button.

Built with plain HTML, CSS, and JavaScript. Book data comes from [Open Library](https://openlibrary.org/developers/api), which is free and needs no API key.

## Use it

1. Download or clone this repo.
2. Open `index.html` in your browser.

## How it works

1. The search text goes to Open Library's search API (`https://openlibrary.org/search.json`).
2. The `fields` parameter asks for only the data the app uses: title, authors, first publication year, cover ID, and the book's key.
3. `script.js` builds a list item for each book. Covers come from `https://covers.openlibrary.org/b/id/<cover_id>-M.jpg`.
4. "Load more" asks the API for the next page with the `page` parameter.

## Files

- `index.html`: page structure
- `style.css`: layout and styling
- `script.js`: API calls and page updates

## Ideas for next steps

- Sort results (newest first, most editions)
- Add a "Saved books" list stored with `localStorage`
- Click a book to see its description and subjects
- Turn it into a movie search with the [TMDB](https://www.themoviedb.org/documentation/api) or [OMDb](https://www.omdbapi.com/) API. Both need a free API key, and a key in front-end code is visible to anyone, so keep that in mind before you publish it.

## Live demo

Add your GitHub Pages link here once it's published.
