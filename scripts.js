import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Define the BookPreview class
class BookPreview extends HTMLElement {
  static get observedAttributes() {
    return ["author", "id", "image", "title"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const author = this.getAttribute("author");
    const id = this.getAttribute("id");
    const image = this.getAttribute("image");
    const title = this.getAttribute("title");

    const template = document.createElement("template");
    template.innerHTML = `
            <style>
                .preview {
                    border-width: 0;
                    width: 100%;
                    font-family: Roboto, sans-serif;
                    padding: 0.5rem 1rem;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    text-align: left;
                    border-radius: 8px;
                    border: 1px solid rgba(var(--color-dark), 0.15);
                    background: rgba(var(--color-light), 1);
                }

                @media (min-width: 60rem) {
                    .preview {
                        padding: 1rem;
                    }
                }

                .preview_hidden {
                    display: none;
                }

                .preview:hover {
                    background: rgba(var(--color-blue), 0.05);
                }

                .preview__image {
                    width: 48px;
                    height: 70px;
                    object-fit: cover;
                    background: grey;
                    border-radius: 2px;
                    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                                0px 1px 1px 0px rgba(0, 0, 0, 0.1), 
                                0px 1px 3px 0px rgba(0, 0, 0, 0.1);
                }

                .preview__info {
                    padding: 1rem;
                }

                .preview__title {
                    margin: 0 0 0.5rem;
                    font-weight: bold;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                    color: rgba(var(--color-dark), 0.8);
                }

                .preview__author {
                    color: rgba(var(--color-dark), 0.4);
                }
            </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" alt="${title}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            </button>
        `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

// Register the custom element
customElements.define("book-preview", BookPreview);

let page = 1;
let matches = books;

// Utility function to get a DOM element
const getElement = (selector) => document.querySelector(selector);

// Function to create and append book previews using the Web Component
const createBookPreviews = (books, container) => {
  const fragment = document.createDocumentFragment();
  books.forEach(({ author, id, image, title }) => {
    const element = document.createElement("book-preview");
    element.setAttribute("author", author);
    element.setAttribute("id", id);
    element.setAttribute("image", image);
    element.setAttribute("title", title);
    fragment.appendChild(element);
  });
  if (container) {
    container.appendChild(fragment);
  }
};

// Initial rendering of book previews
createBookPreviews(
  matches.slice(0, BOOKS_PER_PAGE),
  document.querySelector("[data-list-items]")
);

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

// Set theme based on user's preferred color scheme
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

applyTheme(
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"
);

// Update "Show more" button text and state
const updateShowMoreButton = () => {
  const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
  const button = document.querySelector("[data-list-button]");
  button.innerText = `Show more (${remainingBooks})`;
  button.disabled = remainingBooks <= 0;
  button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining">(${
          remainingBooks > 0 ? remainingBooks : 0
        })</span>
    `;
};

updateShowMoreButton();

// Event listener functions
const closeOverlay = (selector) => {
  document.querySelector(selector).open = false;
};

const openOverlay = (selector, focusSelector = null) => {
  document.querySelector(selector).open = true;
  if (focusSelector) document.querySelector(focusSelector).focus();
};

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

// Event listeners
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

document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    applyTheme(theme);
    closeOverlay("[data-settings-overlay]");
  });

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = applySearchFilters(filters);
    page = 1;
    document
      .querySelector("[data-list-message]")
      .classList.toggle("list__message_show", matches.length < 1);
    document.querySelector("[data-list-items]").innerHTML = "";
    createBookPreviews(
      matches.slice(0, BOOKS_PER_PAGE),
      document.querySelector("[data-list-items]")
    );
    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeOverlay("[data-search-overlay]");
  });

document.querySelector("[data-list-button]").addEventListener("click", () => {
  createBookPreviews(
    matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE),
    document.querySelector("[data-list-items]")
  );
  page += 1;
  updateShowMoreButton();
});

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
        } (${new Date(book.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerText =
          book.description;
      }
    }
  });
