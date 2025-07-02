chrome.devtools.panels.create(
  "Debugger Tools",
  "icons/icon16.png", // Icon for the panel tab
  "panel.html",
  function(panel) {
    console.log("Custom Debugger Tools panel created!");
  }
);