// Importing data and constants from external module
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import BookPreview from "./book-preview.js";

// Initializing variables for pagination and filtering
let page = 1;

const createBookPreviews = (books, container) => {
  const fragment = document.createDocumentFragment();
  books.forEach((book) => {
    const preview = new BookPreview();
    preview.book = book;
    fragment.appendChild(preview);
  });
  container.appendChild(fragment);
};

const updateShowMoreButton = () => {
  const remainingBooks = books.length - page * BOOKS_PER_PAGE;
  const button = document.querySelector("[data-list-button]");
  button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining">(${
        remainingBooks > 0 ? remainingBooks : 0
      })</span>
    `;
  button.disabled = remainingBooks <= 0;
};

// Initial rendering of book previews
createBookPreviews(
  books.slice(0, BOOKS_PER_PAGE),
  document.querySelector("[data-list-items]")
);
updateShowMoreButton();

// Function to create and append options to a select element
const createOptions = (options, defaultOption, container) => {
  const fragment = document.createDocumentFragment();
  const firstOption = document.createElement("option");
  firstOption.value = "any";
  firstOption.innerText = defaultOption;
  fragment.appendChild(firstOption);
  Object.entries(options).forEach(([id, name]) => {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    fragment.appendChild(element);
  });
  container.appendChild(fragment);
};

// Populate genre and author dropdowns
createOptions(
  genres,
  "All Genres",
  document.querySelector("[data-search-genres]")
);
createOptions(
  authors,
  "All Authors",
  document.querySelector("[data-search-authors]")
);

// Function to apply theme based on user preference
const applyTheme = (theme) => {
  const isNight = theme === "night";
  document.documentElement.style.setProperty(
    "--color-dark",
    isNight ? "255, 255, 255" : "10, 10, 20"
  );
  document.documentElement.style.setProperty(
    "--color-light",
    isNight ? "10, 10, 20" : "255, 255, 255"
  );
  document.querySelector("[data-settings-theme]").value = isNight
    ? "night"
    : "day";
};

// Applying theme based on user's preferred color scheme
applyTheme(
  window.matchMedia("(prefers-color-scheme: dark)").books ? "night" : "day"
);

// Updating "Show more" button initially
updateShowMoreButton();

// Function to close overlay
const closeOverlay = (selector) => {
  document.querySelector(selector).open = false;
};

// Function to open overlay
const openOverlay = (selector, focusSelector = null) => {
  document.querySelector(selector).open = true;
  if (focusSelector) document.querySelector(focusSelector).focus();
};

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

// Close search overlay
document
  .querySelector("[data-search-cancel]")
  .addEventListener("click", () => closeOverlay("[data-search-overlay]"));

// Close settings overlay
document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => closeOverlay("[data-settings-overlay]"));

// Open search overlay
document
  .querySelector("[data-header-search]")
  .addEventListener("click", () =>
    openOverlay("[data-search-overlay]", "[data-search-title]")
  );

// Open settings overlay
getElement("[data-header-settings]").addEventListener("click", () =>
  openOverlay("[data-settings-overlay]")
);

// Close active book overlay
document
  .querySelector("[data-list-close]")
  .addEventListener("click", () => closeOverlay("[data-list-active]"));

document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    applyTheme(theme);
    closeOverlay("[data-settings-overlay]");
  });

// Submit event listener for search form
document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    books = applySearchFilters(filters);
    page = 1;
    document
      .querySelector("[data-list-message]")
      .classList.toggle("list__message_show", books.length < 1);
    document.querySelector("[data-list-items]").innerHTML = "";
    createBookPreviews(
      books.slice(0, BOOKS_PER_PAGE),
      document.querySelector("[data-list-items]")
    );
    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeOverlay("[data-search-overlay]");
  });

// Click event listener for "show more" button
document.querySelector("[data-list-button]").addEventListener("click", () => {
  page++;
  const start = (page - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;
  createBookPreviews(
    books.slice(start, end),
    document.querySelector("[data-list-items]")
  );
  updateShowMoreButton();
});

// Click event listener for book reviews
document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.composedPath());
    const active = pathArray.find((node) => node?.dataset?.preview);
    if (active) {
      const book = books.find((book) => book.id === active.dataset.preview);
      if (book) {
        document.querySelector("[data-list-active]").open = true;
        document.querySelector("[data-list-blur]").src = book.image;
        document.querySelector("[data-list-image]").src = book.image;
        document.querySelector("[data-list-title]").innerText = book.title;
        document.querySelector("[data-list-subtitle]").innerText = `${
          authors[book.author]
        } (${new Date(book.published).getFullYear()})`; // Fixed string interpolation
        document.querySelector("[data-list-description]").innerText =
          book.description;
      }
    }
  });
