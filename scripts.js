// main.js

import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./book-preview.js";
import "./theme-toggler.js";
import "./search-filter.js";

// Initializing variables for pagination and filtering
let page = 1;
let matches = books;

// Function to get DOM element by selector
const getElement = (selector) => document.querySelector(selector);

// Function to create and append book previews using the new web component
const createBookPreviews = (books, container) => {
  books.forEach((book) => {
    const bookPreview = document.createElement("book-preview");
    bookPreview.setAttribute("book", JSON.stringify(book));
    bookPreview.addEventListener("click", (event) =>
      handleBookClick(event, book)
    );
    container.appendChild(bookPreview);
  });
};

// Event handler for book clicks
const handleBookClick = (event) => {
  const book = event.detail;
  getElement("[data-list-active]").open = true;
  getElement("[data-list-blur]").src = book.image;
  getElement("[data-list-image]").src = book.image;
  getElement("[data-list-title]").innerText = book.title;
  getElement("[data-list-subtitle]").innerText = `${
    authors[book.author]
  } (${new Date(book.published).getFullYear()})`;
  getElement("[data-list-description]").innerText = book.description;
};

// Listen for the custom `book-click` event
getElement("[data-list-items]").addEventListener("book-click", handleBookClick);

// Initial rendering of book previews
createBookPreviews(
  matches.slice(0, BOOKS_PER_PAGE),
  getElement("[data-list-items]")
);

// Function to update "show more" button text & state
const updateShowMoreButton = () => {
  const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
  const button = getElement("[data-list-button]");
  button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining">(${
        remainingBooks > 0 ? remainingBooks : 0
      })</span>
    `;
  button.disabled = remainingBooks <= 0;
};

// Updating "Show more" button initially
updateShowMoreButton();

// Event listener for search form submission
getElement("search-filter").addEventListener("search", (event) => {
  const filters = event.detail;
  matches = applySearchFilters(filters);
  page = 1;
  getElement("[data-list-message]").classList.toggle(
    "list__message_show",
    matches.length < 1
  );
  getElement("[data-list-items]").innerHTML = "";
  createBookPreviews(
    matches.slice(0, BOOKS_PER_PAGE),
    getElement("[data-list-items]")
  );
  updateShowMoreButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Function to apply search filters to book data
const applySearchFilters = (filters) => {
  return books.filter((book) => {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    return titleMatch && authorMatch && genreMatch;
  });
};

// Click event listener for "show more" button
getElement("[data-list-button]").addEventListener("click", () => {
  page++;
  const start = (page - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;
  createBookPreviews(
    matches.slice(start, end),
    getElement("[data-list-items]")
  );
  updateShowMoreButton();
});

// Click event listener for book reviews
getElement("[data-list-items]").addEventListener("click", (event) => {
  const pathArray = Array.from(event.composedPath());
  const active = pathArray.find((node) => node?.dataset?.preview);
  if (active) {
    const book = books.find((book) => book.id === active.dataset.preview);
    if (book) {
      getElement("[data-list-active]").open = true;
      getElement("[data-list-blur]").src = book.image;
      getElement("[data-list-image]").src = book.image;
      getElement("[data-list-title]").innerText = book.title;
      getElement("[data-list-subtitle]").innerText = `${
        authors[book.author]
      } (${new Date(book.published).getFullYear()})`;
      getElement("[data-list-description]").innerText = book.description;
    }
  }
});
