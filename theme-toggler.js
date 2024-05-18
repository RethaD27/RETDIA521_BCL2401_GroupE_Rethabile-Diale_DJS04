class ThemeToggler extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <style>
        .theme-toggler {
          padding: 10px;
          background-color: var(--color-light);
          color: var(--color-dark);
          border: none;
          cursor: pointer;
        }
      </style>
      <button class="theme-toggler">Toggle Theme</button>
    `;
    this.querySelector("button").addEventListener("click", () => {
      const isNight =
        document.documentElement.style.getPropertyValue("--color-dark") ===
        "255, 255, 255";
      document.documentElement.style.setProperty(
        "--color-dark",
        isNight ? "10, 10, 20" : "255, 255, 255"
      );
      document.documentElement.style.setProperty(
        "--color-light",
        isNight ? "255, 255, 255" : "10, 10, 20"
      );
    });
  }
}

customElements.define("theme-toggler", ThemeToggler);
