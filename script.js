// Book search using the Open Library API (free, no API key needed).
// Type a title or author, and the app shows matching books with covers.
// Results come 20 at a time. "Load more" fetches the next page.

const PAGE_SIZE = 20;

const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const searchButton = document.querySelector("#search-button");
const message = document.querySelector("#message");
const resultsList = document.querySelector("#results");
const loadMoreButton = document.querySelector("#load-more");

let currentQuery = "";
let currentPage = 1;
let totalFound = 0;
let shownCount = 0;

async function fetchBooks(query, page) {
  // "fields" asks the API for only the data we use, which keeps responses small.
  const params = new URLSearchParams({
    q: query,
    page,
    limit: PAGE_SIZE,
    fields: "key,title,author_name,first_publish_year,cover_i",
  });

  const response = await fetch(`https://openlibrary.org/search.json?${params}`);
  if (!response.ok) throw new Error("The book search is unavailable. Try again in a moment.");
  return response.json(); // { numFound, docs: [...] }
}

function formatAuthors(names) {
  if (!names || names.length === 0) return "Unknown author";
  const shown = names.slice(0, 3).join(", ");
  return names.length > 3 ? `${shown} and others` : shown;
}

function createBookItem(book) {
  const item = document.createElement("li");

  // Cover image, or a plain box if the book has no cover
  if (book.cover_i) {
    const cover = document.createElement("img");
    cover.className = "cover";
    cover.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    cover.alt = ""; // the title next to it already describes the book
    cover.loading = "lazy";
    item.append(cover);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "cover no-cover";
    placeholder.textContent = "No cover";
    item.append(placeholder);
  }

  const info = document.createElement("div");
  info.className = "info";

  const heading = document.createElement("h2");
  if (book.key && book.key.startsWith("/works/")) {
    const link = document.createElement("a");
    link.href = `https://openlibrary.org${book.key}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = book.title;
    heading.append(link);
  } else {
    heading.textContent = book.title;
  }

  const authors = document.createElement("p");
  authors.textContent = formatAuthors(book.author_name);

  info.append(heading, authors);

  if (book.first_publish_year) {
    const year = document.createElement("p");
    year.textContent = `First published in ${book.first_publish_year}`;
    info.append(year);
  }

  item.append(info);
  return item;
}

function updateMessage() {
  message.textContent = `Showing ${shownCount} of ${totalFound.toLocaleString()} results for "${currentQuery}".`;
  loadMoreButton.hidden = shownCount >= totalFound;
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  loadMoreButton.disabled = isLoading;
}

async function loadPage() {
  setLoading(true);
  try {
    const data = await fetchBooks(currentQuery, currentPage);

    if (currentPage === 1 && data.docs.length === 0) {
      message.textContent = `No books found for "${currentQuery}". Try a different title or author.`;
      loadMoreButton.hidden = true;
      return;
    }

    for (const book of data.docs) {
      resultsList.append(createBookItem(book));
    }
    totalFound = data.numFound;
    shownCount += data.docs.length;
    updateMessage();
  } catch (error) {
    if (currentPage > 1) currentPage--; // let "Load more" retry the same page
    message.textContent = error.message;
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const query = queryInput.value.trim();
  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  shownCount = 0;
  totalFound = 0;
  resultsList.innerHTML = "";
  loadMoreButton.hidden = true;
  message.textContent = "Searching...";
  loadPage();
});

loadMoreButton.addEventListener("click", () => {
  currentPage++;
  loadPage();
});
