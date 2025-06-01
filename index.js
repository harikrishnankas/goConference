async function loadContent(url, selector) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = text;
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    }
  }

// document.addEventListener("DOMContentLoaded", function(event) { 
  // loadContent("/form", "#form");
// });
  