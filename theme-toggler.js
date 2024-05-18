// Define the ThemeToggler custom element
class ThemeToggler extends HTMLElement {
  // The connectedCallback method is called when the element is added to the DOM
  connectedCallback() {
    this.render();
  }

  // Render the HTML and CSS for the theme toggler
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

    // Add an event listener to the button to handle theme toggling
    this.querySelector("button").addEventListener("click", () => {
      // Check the current theme by examining the CSS variable for --color-dark
      const isNight =
        document.documentElement.style.getPropertyValue("--color-dark") ===
        "255, 255, 255";

      // Toggle the theme by changing the CSS variables for --color-dark and --color-light
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

// Define the custom element, making it available for use as <theme-toggler>
customElements.define("theme-toggler", ThemeToggler);
