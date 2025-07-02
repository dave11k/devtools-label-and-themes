let inspectedTabId = chrome.devtools.inspectedWindow.tabId;
let currentTheme = null;

function applyDevToolsTheme(themeFileName) {
  if (themeFileName === 'default') {
    // Clear any applied theme
    if (currentTheme) {
      chrome.devtools.panels.applyStyleSheet('', true);
      currentTheme = null;
    }
    return;
  }

  // Fetch the theme CSS file
  fetch(`themes/${themeFileName}.css`)
    .then(response => response.text())
    .then(css => {
      // Apply the CSS to DevTools
      chrome.devtools.panels.applyStyleSheet(css, true);
      currentTheme = themeFileName;
    })
    .catch(error => {
      console.error('Error loading theme:', error);
    });
}

function saveLabel(label) {
  const storageKey = `devtools_label_${inspectedTabId}`;
  chrome.storage.local.set({ [storageKey]: label }, () => {
    console.log('Label saved:', label);
    updateLabelDisplay(label);
  });
}

function loadLabel() {
  const storageKey = `devtools_label_${inspectedTabId}`;
  chrome.storage.local.get([storageKey], (result) => {
    const label = result[storageKey] || '';
    updateLabelDisplay(label);
  });
}

function updateLabelDisplay(label) {
  const display = document.getElementById('currentLabelDisplay');
  display.textContent = label || 'No Label Set';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Load existing label
  loadLabel();

  // Theme button event listeners
  document.getElementById('blueBtn').addEventListener('click', () => {
    applyDevToolsTheme('blue-theme');
  });

  document.getElementById('greenBtn').addEventListener('click', () => {
    applyDevToolsTheme('green-theme');
  });

  document.getElementById('redBtn').addEventListener('click', () => {
    applyDevToolsTheme('red-theme');
  });

  document.getElementById('defaultBtn').addEventListener('click', () => {
    applyDevToolsTheme('default');
  });

  // Label input event listener
  const labelInput = document.getElementById('labelInput');
  labelInput.addEventListener('input', (event) => {
    const label = event.target.value;
    saveLabel(label);
  });

  labelInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const label = event.target.value;
      saveLabel(label);
    }
  });
});