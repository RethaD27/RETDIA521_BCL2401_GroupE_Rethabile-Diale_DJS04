// Import necessary data and components
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./book-preview.js";
import "./theme-toggler.js";
import "./search-filter.js";

// Wait for the DOM content to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  let page = 1; // Current page number
  let matches = books; // Array of books initially containing all books

  // Function to get DOM elements easily
  const getElement = (selector) => document.querySelector(selector);

  // Function to create book previews and append them to a container
  const createBookPreviews = (books, container) => {
    books.forEach((book) => {
      const bookPreview = document.createElement("book-preview");
      bookPreview.setAttribute("book", JSON.stringify(book));
      container.appendChild(bookPreview);
    });
  };

  // Function to update the "Show more" button based on remaining books
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

  // Function to apply search filters to the list of books
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

  // Function to handle clicking on a book preview
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

  // Function to open an overlay
  const openOverlay = (overlaySelector, focusSelector = null) => {
    const overlay = getElement(overlaySelector);
    overlay.style.display = "block";
    if (focusSelector) {
      const focusElement = getElement(focusSelector);
      if (focusElement) {
        focusElement.focus();
      }
    }
  };

  // Function to close an overlay
  const closeOverlay = (overlaySelector) => {
    const overlay = getElement(overlaySelector);
    overlay.style.display = "none";
  };

  // Function to apply the selected theme
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

    // Apply theme to all book previews
    const bookPreviews = document.querySelectorAll("book-preview");
    bookPreviews.forEach((preview) => {
      preview.classList.toggle("night-theme", isNight);
    });

    getElement("[data-settings-theme]").value = isNight ? "night" : "day";
  };

  // Initial setup: create book previews, update "Show more" button, apply theme
  createBookPreviews(
    matches.slice(0, BOOKS_PER_PAGE),
    getElement("[data-list-items]")
  );
  updateShowMoreButton();

  // Event listener for "Show more" button click
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

  // Event listener for clicking on a book preview
  getElement("[data-list-items]").addEventListener(
    "book-click",
    handleBookClick
  );

  // Event listeners for various UI interactions
  document
    .querySelector("[data-search-cancel]")
    .addEventListener("click", () => closeOverlay("[data-search-overlay]"));
  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => closeOverlay("[data-settings-overlay]"));
  document
    .querySelector("[data-header-search]")
    .addEventListener("click", () =>
      openOverlay("[data-search-overlay]", "[data-search-title]")
    );
  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => openOverlay("[data-settings-overlay]"));
  document
    .querySelector("[data-list-close]")
    .addEventListener("click", () => closeOverlay("[data-list-active]"));

  // Event listener for theme selection form submission
  document
    .querySelector("[data-settings-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      applyTheme(theme);
      closeOverlay("[data-settings-overlay]");
    });

  // Event listener for search filter changes
  getElement("[data-search-filter]").addEventListener("search", (event) => {
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

  // Apply the initial theme based on the saved settings or default
  const initialTheme = getElement("[data-settings-theme]").value;
  applyTheme(initialTheme);
});
