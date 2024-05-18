import { genres, authors } from "./data.js";

class SearchFilter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
    this.populateOptions();
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("form")
      .addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    this.dispatchEvent(new CustomEvent("search", { detail: filters }));
  }

  populateOptions() {
    const genreSelect = this.shadowRoot.querySelector('select[name="genre"]');
    const authorSelect = this.shadowRoot.querySelector('select[name="author"]');

    genreSelect.innerHTML = `<option value="any">All Genres</option>`;
    Object.entries(genres).forEach(([id, name]) => {
      genreSelect.innerHTML += `<option value="${id}">${name}</option>`;
    });

    authorSelect.innerHTML = `<option value="any">All Authors</option>`;
    Object.entries(authors).forEach(([id, name]) => {
      authorSelect.innerHTML += `<option value="${id}">${name}</option>`;
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
        label {
          font-size: 1em;
        }
        input, select, button {
          font-size: 1em;
          padding: 0.5em;
        }
        button {
          align-self: flex-start;
        }
      </style>
      <form>
        <label for="title">Title:</label>
        <input type="text" name="title" id="title">
        <label for="genre">Genre:</label>
        <select name="genre" id="genre"></select>
        <label for="author">Author:</label>
        <select name="author" id="author"></select>
        <button type="submit">Search</button>
      </form>
    `;
  }
}

customElements.define("search-filter", SearchFilter);
