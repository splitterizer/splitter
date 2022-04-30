const lightSwitch = <HTMLInputElement>document.getElementById("lightSwitch");
if (lightSwitch) {
  const settings =
    localStorage.getItem("lightSwitch") || getSystemDefaultTheme();

  lightSwitch.checked = settings == "dark";

  lightSwitch.onchange = onToggleMode;
  onToggleMode();
}
/**
 * @function darkmode
 * @summary: changes the theme to 'dark mode' and save settings to local stroage.
 * Basically, replaces/toggles every CSS class that has '-light' class with '-dark'
 */
function darkMode() {
  document.querySelectorAll(".bg-light").forEach((element) => {
    element.className = element.className.replace(/-light/g, "-dark");
  });

  document.body.classList.add("bg-dark");

  if (document.body.classList.contains("text-dark")) {
    document.body.classList.replace("text-dark", "text-light");
  } else {
    document.body.classList.add("text-light");
  }

  // set light switch input to true
  if (!lightSwitch.checked) {
    lightSwitch.checked = true;
  }
  localStorage.setItem("lightSwitch", "dark");
  // add/remove class body.dark-mode-on 4 css
  document.body.classList.add("dark-mode-on");
}

/**
 * @function lightmode
 * @summary: changes the theme to 'light mode' and save settings to local stroage.
 */
function lightMode() {
  document.querySelectorAll(".bg-dark").forEach((element) => {
    element.className = element.className.replace(/-dark/g, "-light");
  });

  document.body.classList.add("bg-light");

  if (document.body.classList.contains("text-light")) {
    document.body.classList.replace("text-light", "text-dark");
  } else {
    document.body.classList.add("text-dark");
  }

  if (lightSwitch.checked) {
    lightSwitch.checked = false;
  }
  localStorage.setItem("lightSwitch", "light");
  // add/remove class body.dark-mode-on 4 css
  document.body.classList.remove("dark-mode-on");
}

/**
 * @function onToggleMode
 * @summary: the event handler attached to the switch. calling @darkMode or @lightMode depending on the checked state.
 */
function onToggleMode() {
  if (lightSwitch.checked) {
    darkMode();
  } else {
    lightMode();
  }
}

/**
 * @function getSystemDefaultTheme
 * @summary: get system default theme by media query
 */
function getSystemDefaultTheme() {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  if (darkThemeMq.matches) {
    return "dark";
  }
  return "light";
}
