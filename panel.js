let inspectedTabId = chrome.devtools.inspectedWindow.tabId;
let currentTheme = null;

function applyDevToolsTheme(themeFileName) {
  if (themeFileName === 'default') {
    // Clear any applied theme
    if (currentTheme) {
      removeExistingTheme();
      currentTheme = null;
    }
    updateThemeDisplay('Default');
    return;
  }

  // Since DevTools styling is no longer supported without experimental flags,
  // we'll update the extension panel to show the selected theme visually
  removeExistingTheme();
  currentTheme = themeFileName;
  
  // Apply theme colors to the extension panel itself
  applyPanelTheme(themeFileName);
  updateThemeDisplay(themeFileName);
  
  console.log(`Theme selected: ${themeFileName} (DevTools styling not available without experimental flag)`);
}

function applyPanelTheme(themeFileName) {
  // Remove existing panel theme
  const existingTheme = document.getElementById('panel-theme');
  if (existingTheme) {
    existingTheme.remove();
  }
  
  // Get theme colors based on theme name
  const themeColors = getThemeColors(themeFileName);
  
  // Create CSS for the panel styling
  const panelCSS = `
    body {
      background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary}) !important;
      color: ${themeColors.text} !important;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .theme-buttons button {
      border: 2px solid ${themeColors.accent} !important;
      transition: all 0.3s ease;
    }
    
    .theme-buttons button:hover {
      background-color: ${themeColors.accent} !important;
      color: ${themeColors.background} !important;
    }
    
    .theme-buttons button.active {
      background-color: ${themeColors.accent} !important;
      color: ${themeColors.background} !important;
      box-shadow: 0 0 10px ${themeColors.accent}50;
    }
    
    .label-section {
      background: ${themeColors.background}20 !important;
      border: 1px solid ${themeColors.accent}30 !important;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }
    
    #labelInput {
      background: ${themeColors.background}40 !important;
      border: 1px solid ${themeColors.accent} !important;
      color: ${themeColors.text} !important;
    }
    
    #currentLabelDisplay {
      color: ${themeColors.accent} !important;
      font-weight: bold;
    }
    
    .theme-indicator {
      background: ${themeColors.accent} !important;
      color: ${themeColors.background} !important;
      border-radius: 20px;
      padding: 5px 15px;
      font-weight: bold;
      text-align: center;
      margin: 10px 0;
      box-shadow: 0 2px 10px ${themeColors.accent}30;
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'panel-theme';
  styleElement.textContent = panelCSS;
  document.head.appendChild(styleElement);
}

function getThemeColors(themeFileName) {
  const themes = {
    'blue-theme': {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#f8fafc',
      text: '#ffffff'
    },
    'green-theme': {
      primary: '#166534',
      secondary: '#22c55e',
      accent: '#4ade80',
      background: '#f0fdf4',
      text: '#ffffff'
    },
    'red-theme': {
      primary: '#991b1b',
      secondary: '#ef4444',
      accent: '#f87171',
      background: '#fef2f2',
      text: '#ffffff'
    }
  };
  
  return themes[themeFileName] || {
    primary: '#6b7280',
    secondary: '#9ca3af',
    accent: '#d1d5db',
    background: '#f9fafb',
    text: '#111827'
  };
}

function updateThemeDisplay(themeName) {
  let displayElement = document.getElementById('current-theme-display');
  if (!displayElement) {
    displayElement = document.createElement('div');
    displayElement.id = 'current-theme-display';
    displayElement.className = 'theme-indicator';
    document.querySelector('.theme-buttons').parentNode.insertBefore(displayElement, document.querySelector('.theme-buttons').nextSibling);
  }
  
  const displayName = themeName.replace('-theme', '').replace('-', ' ').toUpperCase();
  displayElement.textContent = `Current Theme: ${displayName}`;
}

function removeExistingTheme() {
  // Remove panel theme styling
  const existingTheme = document.getElementById('panel-theme');
  if (existingTheme) {
    existingTheme.remove();
  }
  
  // Remove theme display
  const themeDisplay = document.getElementById('current-theme-display');
  if (themeDisplay) {
    themeDisplay.remove();
  }
  
  // Reset active button states
  document.querySelectorAll('.theme-buttons button').forEach(btn => {
    btn.classList.remove('active');
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

function setActiveButton(clickedButton) {
  // Remove active class from all buttons
  document.querySelectorAll('.theme-buttons button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked button
  clickedButton.classList.add('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Load existing label
  loadLabel();

  // Theme button event listeners
  document.getElementById('blueBtn').addEventListener('click', (e) => {
    setActiveButton(e.target);
    applyDevToolsTheme('blue-theme');
  });

  document.getElementById('greenBtn').addEventListener('click', (e) => {
    setActiveButton(e.target);
    applyDevToolsTheme('green-theme');
  });

  document.getElementById('redBtn').addEventListener('click', (e) => {
    setActiveButton(e.target);
    applyDevToolsTheme('red-theme');
  });

  document.getElementById('defaultBtn').addEventListener('click', (e) => {
    setActiveButton(e.target);
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