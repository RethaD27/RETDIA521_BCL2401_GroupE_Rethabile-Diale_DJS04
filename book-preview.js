// book-preview.js
import { html, LitElement, property, customElement } from "lit-element";

@customElement("book-preview")
class BookPreview extends LitElement {
  @property({ type: Object }) book;

  render() {
    return html`
      <button class="preview" data-preview=${this.book.id}>
        <img class="preview__image" src=${this.book.image} />
        <div class="preview__info">
          <h3 class="preview__title">${this.book.title}</h3>
          <div class="preview__author">${authors[this.book.author]}</div>
        </div>
      </button>
    `;
  }
}

export default BookPreview;
