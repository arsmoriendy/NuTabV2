let theme;
if (localStorage["theme"]) {
  theme = localStorage["theme"];
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  theme = localStorage["preferedDarkTheme"] || "dark"
} else {
  theme = localStorage["preferedLightTheme"] || "light"
}

document.documentElement.setAttribute("data-theme", theme);
