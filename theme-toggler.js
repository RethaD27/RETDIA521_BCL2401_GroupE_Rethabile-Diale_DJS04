class ThemeToggler extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.applyTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "night"
        : "day"
    );
  }

  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector("form")
      .addEventListener("submit", this.handleSubmit.bind(this));
  }

  applyTheme(theme) {
    const isNight = theme === "night";
    document.documentElement.style.setProperty(
      "--color-dark",
      isNight ? "255, 255, 255" : "10, 10, 20"
    );
    document.documentElement.style.setProperty(
      "--color-light",
      isNight ? "10, 10, 20" : "255, 255, 255"
    );
    this.shadowRoot.querySelector("select").value = theme;
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    this.applyTheme(theme);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
        label {
          font-size: 1em;
        }
        select {
          font-size: 1em;
        }
        button {
          font-size: 1em;
          padding: 0.2em 0.5em;
        }
      </style>
      <form>
        <label for="theme">Theme:</label>
        <select name="theme" id="theme">
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>
        <button type="submit">Apply</button>
      </form>
    `;
  }
}

customElements.define("theme-toggler", ThemeToggler);
