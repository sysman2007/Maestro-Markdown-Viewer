# Maestro Markdown Viewer — Persian RTL

[فارسی](README.fa.md) | **English**

A Chrome extension (Manifest V3) that renders Markdown files right in the browser, with full Persian and right-to-left support, real Mermaid rendering, PrismJS syntax highlighting, local fonts, light and dark themes, a table of contents and clean printing.

Everything runs **fully locally**. File contents are never sent to any server.

---

## Installation

1. Extract the ZIP file.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the extension folder (the one that contains `manifest.json`).
5. In the extension details, turn on **Allow access to file URLs** (required for local files).
6. Open a Markdown file in Chrome.

### Supported files

| Extension | `file://` | `http://` and `https://` |
|---|---|---|
| `.md` | ✅ | ✅ |
| `.markdown` | ✅ | ✅ |
| `.mdx` | ✅ | ✅ |

---

## Features

### Text direction and fonts
- Each block (heading, paragraph, list item, blockquote, table cell) is checked separately:
  - If it contains even one Persian, Arabic or Hebrew letter: **RTL** with the selected Persian font.
  - If it is entirely English: **LTR** with Inter or the standard system fonts.
- Code blocks and inline code are always **LTR** and monospace.
- Table of contents entries also get their own direction and font.
- Fonts are bundled with the extension and never downloaded from the internet:
  - **Persian:** IranSans X, IranSans, Vazirmatn, IranYekan X
  - **English:** Inter, or the standard system fonts

### Markdown elements
- Headings (`#` to `######`, plus Setext style with `===` and `---`)
- **Bold**, *italic*, ~~strikethrough~~, `inline code`, line breaks with two trailing spaces
- Links and images (optional title; images load lazily)
- Bulleted and numbered lists, blockquotes, horizontal rules
- Tables with left, center and right aligned columns
- Code blocks fenced with ```` ``` ```` or `~~~`
- Lines that contain only an HTML tag (such as `<div dir="rtl">`) are rendered as HTML, not as raw text.

### Syntax highlighting
- **PrismJS 1.30.0** with more than 80 languages, including JavaScript, TypeScript, JSX/TSX, JSON, HTML/XML, CSS, Bash, PowerShell, Python, C#, Java, C/C++, Go, Rust, PHP, Ruby, Kotlin, Swift, SQL, YAML, TOML, INI, GraphQL, Dockerfile, Diff and Markdown.
- Language label, line count, and line numbers in a separate column (multi-line strings and comments keep their highlighting).
- **Copy** button for code.

### Mermaid diagrams
- Rendered with the official **Mermaid 11**, including `graph`/`flowchart`, `stateDiagram-v2` and other diagram types.
- Tuned for Persian labels: each label line has its own direction, so mixed text such as `OwnerId = خریدار` is not scrambled.
- Diagram font stack: Inter for Latin text and digits, then IranSans X for Persian. Rendering waits for fonts to load so measurements are correct.
- Colors follow the page theme, and diagrams re-render when the theme changes.
- If Mermaid cannot parse a diagram, it is drawn by the fallback renderer and the rest of the page stays intact.
- **Fullscreen** button (keeps the aspect ratio; closes with `Esc`), **Copy source** button, and a collapsible view of the diagram source.

### Table of contents (sidebar) and navigation
- The table of contents is built automatically from the document headings.
- **Visibility depends on screen size:**
  - Desktop (wider than 850px): open by default.
  - Mobile (850px or narrower): closed by default; when opened it overlays the content.
  - When the viewport crosses 850px (for example, on window resize), the default for the new size is applied again.
- **Open and close** by clicking the **header logo** or the **☰** button. The logo is a real button with `aria-expanded` and works with the keyboard.
- On mobile, the sidebar closes automatically after you click a TOC entry.
- The active heading is highlighted while scrolling, and the link target briefly flashes.
- Internal links (`[...](#heading)`) scroll within the page and do not open a new tab; only external links open in a new tab.
- Heading IDs follow GitHub's rules, with approximate matching when there is a small mismatch.
- If the URL contains a `#anchor`, the page scrolls to that section after loading.

### Header and toolbar
| Button | Action |
|---|---|
| Logo / ☰ | Open and close the table of contents |
| ◐ | Switch between light and dark theme (for the current page) |
| Print | Print |
| Settings | Open the extension settings page |

On mobile, the Print and Settings buttons are hidden to save space.

### Printing
- The header, sidebar, footer and code and diagram buttons are removed when printing; only the document content is printed.

### Settings
Available from the Settings button in the header, the extension popup, or the Options page. Settings are stored in `chrome.storage.sync` and sync across devices signed in to the same Chrome account.

| Setting | Default | Description |
|---|---|---|
| Persian font | IranSans X | IranSans X, IranSans, Vazirmatn, IranYekan X |
| English font | Inter | Inter or the standard system fonts |
| Theme | Auto | Auto (follows the system theme), light, dark |
| Maximum content width | 980px | |
| Font size | 17px | |
| Line height | 1.9 | |
| Show table of contents | On | When off, the sidebar starts closed at every size but can still be opened with the logo or ☰ |

---

## Project structure

| File / folder | Role |
|---|---|
| `manifest.json` | Extension definition (Manifest V3), content scripts and permissions |
| `viewer.js` | Markdown parser, page rendering, text direction, table of contents, Mermaid and styles |
| `background.js` | Service worker; opens the settings page from inside the viewer |
| `popup.html`, `popup.js` | Popup for the toolbar button |
| `options.html`, `options.js`, `options.css` | Settings page |
| `vendor/` | PrismJS, Mermaid and the fallback Mermaid renderer |
| `fonts/` | Local Persian and English fonts |
| `icons/` | Extension icons and header logo |

### Permissions
- `storage`: to save settings.
- `host_permissions` for `file:///*`, `http://*/*` and `https://*/*`: to run the viewer on Markdown files. The content script only runs on URLs ending in `.md`, `.markdown` or `.mdx`.

---

## License

The extension code is released under the **Apache License 2.0**. The full text is in [`LICENSE`](LICENSE).

Third-party libraries and fonts in `vendor/` and `fonts/` are under their own licenses and are not covered by Apache 2.0:
- PrismJS and Mermaid: MIT License
- Inter and Vazirmatn: SIL Open Font License 1.1
- IranSans, IranSans X and IranYekan X: the font vendor's license (check its terms before redistributing)

## Changelog

### 1.5.0
- Released under the Apache License 2.0.
- The sidebar is open by default on desktop and closed by default on mobile; the default is re-applied when the viewport crosses 850px.
- Clicking the header logo opens and closes the sidebar (with keyboard support and `aria-expanded`).

### 1.3.0
- Replaced the hand-written renderer with the official Mermaid 11; the previous renderer is kept as a fallback.
- Fixed overlapping and clipped Persian text, empty edge and `subgraph` labels, and white-on-white text in `stateDiagram`.
- Diagram colors follow the theme; improved Fullscreen (keeps aspect ratio, closes with `Esc`).
- Updated PrismJS to 1.30.0 with more than 80 languages; line numbers in a separate column.
- In-page scrolling for internal links, GitHub-style heading IDs, active heading highlight, and rendering of HTML-only lines.

### 1.2.0
- Mermaid rendering for `graph TB`, `graph LR` and `stateDiagram-v2`, with zoom, source copy and collapsible source.
- PrismJS syntax highlighting, line numbers, line count and language label.
- Maestro Markdown logo used for the icons and header.

### 1.0.2
- Removed the inline-script CSP violation from the popup.
- Settings open through the service worker with `chrome.runtime.openOptionsPage()`.

### 1.0.1
- Persian table of contents entries always use IRANSansX.
- The Settings button in the header opens the settings page directly.
