# devtools-label-and-themes

A Chrome DevTools extension that provides visual theming and labeling for your debugger sessions. 

## Features

- **Custom Labels**: Add unique labels to distinguish between different DevTools instances
- **Visual Themes**: Choose from Blue, Green, Red, or Default theme color schemes
- **Per-Tab Storage**: Each tab maintains its own label and theme settings
- **Modern UI**: Clean, intuitive interface integrated into DevTools

## Important Note

**DevTools Styling Limitation**: As of Chrome's recent updates, the experimental flag "Allow extensions to load custom stylesheets" has been removed. This means direct DevTools interface styling is no longer possible. The extension now applies visual themes to the extension panel itself, providing a clear visual indicator of the selected theme and maintaining the labeling functionality.

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. Open DevTools and look for the "Debugger Tools" panel

## Usage

1. Open DevTools (F12 or right-click → Inspect)
2. Navigate to the "Debugger Tools" panel
3. Select a theme (Blue, Green, Red, or Default)
4. Add a custom label to identify this DevTools instance
5. The extension panel will reflect your theme choice with visual styling

## Architecture

This extension uses Chrome Extension Manifest V3 with:
- `chrome.devtools.panels` API for panel integration
- `chrome.storage.local` for per-tab data persistence
- Modern CSS styling with theme-based color schemes
