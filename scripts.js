import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./book-preview.js";
class BookStore {
  constructor(books, authors, genres, booksPerPage) {
    this.books = books;
    this.authors = authors;
    this.genres = genres;
    this.booksPerPage = booksPerPage;
    this.page = 1;
    this.matches = books;
  }

  init() {
    this.renderBooks(this.getBooksToRender());
    this.populateGenres("[data-search-genres]", "All Genres");
    this.populateAuthors("[data-search-authors]", "All Authors");
    this.setTheme();
    this.updateShowMoreButton();
    this.addEventListeners();
  }

  getBooksToRender() {
    return this.matches.slice(0, this.page * this.booksPerPage);
  }

  renderBooks(books) {
    const fragment = document.createDocumentFragment();
    books.forEach((book) => {
      const element = document.createElement("book-preview");
      element.setAttribute("author", this.authors[book.author]);
      element.setAttribute("id", book.id);
      element.setAttribute("image", book.image);
      element.setAttribute("title", book.title);
      fragment.appendChild(element);
    });

    document.querySelector("[data-list-items]").appendChild(fragment);
    this.updateShowMoreButton();
  }

  populateGenres(selector, defaultOptionText) {
    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = this.createOptionElement(
      defaultOptionText,
      "any"
    );
    genreHtml.appendChild(firstGenreElement);

    for (const [id, name] of Object.entries(this.genres)) {
      const element = this.createOptionElement(name, id);
      genreHtml.appendChild(element);
    }

    document.querySelector(selector).appendChild(genreHtml);
  }

  populateAuthors(selector, defaultOptionText) {
    const authorsHtml = document.createDocumentFragment();
    const firstAuthorElement = this.createOptionElement(
      defaultOptionText,
      "any"
    );
    authorsHtml.appendChild(firstAuthorElement);

    for (const [id, name] of Object.entries(this.authors)) {
      const element = this.createOptionElement(name, id);
      authorsHtml.appendChild(element);
    }

    document.querySelector(selector).appendChild(authorsHtml);
  }

  createOptionElement(text, value) {
    const element = document.createElement("option");
    element.value = value;
    element.innerText = text;
    return element;
  }

  setTheme() {
    const theme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "night"
        : "day";
    this.updateTheme(theme);
    document.querySelector("[data-settings-theme]").value = theme;
  }

  updateTheme(theme) {
    const darkMode = theme === "night";
    document.documentElement.style.setProperty(
      "--color-dark",
      darkMode ? "255, 255, 255" : "10, 10, 20"
    );
    document.documentElement.style.setProperty(
      "--color-light",
      darkMode ? "10, 10, 20" : "255, 255, 255"
    );
  }

  updateShowMoreButton() {
    const showMoreButton = document.querySelector("[data-list-button]");
    const remainingBooks = this.matches.length - this.page * this.booksPerPage;
    showMoreButton.innerText = `Show more (${remainingBooks})`;
    showMoreButton.disabled = remainingBooks < 1;

    showMoreButton.innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${
              remainingBooks > 0 ? remainingBooks : 0
            })</span>`;
  }

  addEventListeners() {
    document
      .querySelector("[data-search-cancel]")
      .addEventListener("click", () => {
        document.querySelector("[data-search-overlay]").open = false;
      });

    document
      .querySelector("[data-settings-cancel]")
      .addEventListener("click", () => {
        document.querySelector("[data-settings-overlay]").open = false;
      });

    document
      .querySelector("[data-header-search]")
      .addEventListener("click", () => {
        document.querySelector("[data-search-overlay]").open = true;
        document.querySelector("[data-search-title]").focus();
      });

    document
      .querySelector("[data-header-settings]")
      .addEventListener("click", () => {
        document.querySelector("[data-settings-overlay]").open = true;
      });

    document
      .querySelector("[data-settings-form]")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        this.updateTheme(theme);
        document.querySelector("[data-settings-overlay]").open = false;
      });

    document
      .querySelector("[data-search-form]")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        this.matches = this.applyFilters(formData);
        this.page = 1;
        this.renderFilteredBooks();
      });

    document
      .querySelector("[data-list-button]")
      .addEventListener("click", () => {
        this.page += 1;
        this.renderBooks(this.getBooksToRender());
      });
  }

  applyFilters(formData) {
    const filters = Object.fromEntries(formData);
    return this.books.filter((book) => {
      const matchesTitle = filters.title
        ? book.title.toLowerCase().includes(filters.title.toLowerCase())
        : true;
      const matchesAuthor =
        filters.author !== "any" ? book.author === filters.author : true;
      const matchesGenre =
        filters.genre !== "any" ? book.genres.includes(filters.genre) : true;
      return matchesTitle && matchesAuthor && matchesGenre;
    });
  }

  renderFilteredBooks() {
    const listItems = document.querySelector("[data-list-items]");
    listItems.innerHTML = ""; // Clear current books
    this.renderBooks(this.getBooksToRender());
  }
}

// Initialize BookStore
const bookStore = new BookStore(books, authors, genres, BOOKS_PER_PAGE);
bookStore.init();
