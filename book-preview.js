class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.getElementById("book-preview-template");
    const templateContent = template.content.cloneNode(true);
    this.shadowRoot.appendChild(templateContent);
  }

  connectedCallback() {
    this.updatePreview();
  }

  updatePreview() {
    const image = this.getAttribute("image");
    const title = this.getAttribute("title");
    const author = this.getAttribute("author");

    const imageElement = this.shadowRoot.querySelector(".preview__image");
    const titleElement = this.shadowRoot.querySelector(".preview__title");
    const authorElement = this.shadowRoot.querySelector(".preview__author");

    imageElement.src = image;
    titleElement.textContent = title;
    authorElement.textContent = author;
  }
}

customElements.define("book-preview", BookPreview);
