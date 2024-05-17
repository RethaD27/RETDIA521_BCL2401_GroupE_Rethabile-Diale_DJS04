// book-preview.js

import { authors } from "./data.js";

class BookPreview extends HTMLElement {
  static get observedAttributes() {
    return ["book"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "book" && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const book = JSON.parse(this.getAttribute("book"));
    if (!book) return;

    this.shadowRoot.innerHTML = `
      <style>
        .preview {
          display: flex;
          align-items: center;
          margin-bottom: 1em;
          border: 1px solid #ccc;
          padding: 1em;
          cursor: pointer;
        }
        .preview__image {
          max-width: 100px;
          margin-right: 1em;
        }
        .preview__info {
          flex: 1;
        }
        .preview__title {
          font-size: 1.2em;
          margin: 0;
        }
        .preview__author {
          font-size: 0.9em;
          color: #666;
        }
      </style>
      <button class="preview" data-preview="${book.id}">
        <img class="preview__image" src="${book.image}" alt="${
      book.title
    } cover">
        <div class="preview__info">
          <h3 class="preview__title">${book.title}</h3>
          <div class="preview__author">${authors[book.author]}</div>
        </div>
      </button>
    `;
  }
}

customElements.define("book-preview", BookPreview);
