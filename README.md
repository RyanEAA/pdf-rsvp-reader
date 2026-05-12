# PDF RSVP Reader
A browser-based speed-reading tool that lets you load any PDF and read it word-by-word using the Rapid Serial Visual Presentation (RSVP) technique. Each word is displayed one at a time in a large centered display, while the source PDF scrolls to highlight exactly where that word appears in the original document.
How It Works

Upload a PDF using the file picker
Press Play to start — words flash at 250ms intervals (240 words per minute)
The large display at the top shows the current word
The PDF below highlights that word's position in the source document
Use Pause to stop and Reset to start over


## File Overview
- main.jsx
The entry point. Mounts the React app into the DOM inside StrictMode and imports global styles.
- App.jsx
The root component and central state manager. Handles:

PDF file upload and parsing via pdfjs-dist
Word list extraction (via pdfTextExtractor)
- Playback state — play, pause, reset, and the 250ms interval timer
Passing the current word down to both the RSVP display and PDF viewer

- components/RSVPDisplay.jsx
A focused display component that renders the current word in large text at the top of the screen. Shows a placeholder message when no PDF is loaded.
components/PDFViewer.jsx
Renders the full PDF page-by-page using pdfjs-dist canvas rendering. For each page, it:

Draws the page onto an HTML <canvas> at 1.5× scale
Overlays an absolutely-positioned highlight <div> on the active word's bounding box
Converts PDF coordinate space (bottom-left origin) to canvas space (top-left origin) using viewport.convertToViewportPoint

- utils/pdfTextExtractor.js
Extracts all words from a PDF along with their positions. For each text item returned by PDF.js:

Reads the transform matrix to get the word's origin in PDF user space
Converts to canvas pixel coordinates using the viewport transform (which handles the y-axis flip)
Splits multi-word text runs into individual words with proportionally estimated x-positions
Returns an array of { text, page, x, y, width, height } objects


## Key Technical Notes
Coordinate system: PDF.js text items use a coordinate system with the origin at the bottom-left of the page. Canvas and HTML use top-left. The extractor uses viewport.convertToViewportPoint() to handle this conversion correctly.
Scale: All rendering and coordinate extraction uses SCALE = 1.5. The scale value in PDFViewer.jsx and pdfTextExtractor.js must always match.
Word splitting: PDF text items are often whole lines or phrases. The extractor splits them by whitespace and estimates each word's x-position proportionally by character count — accurate enough for highlighting purposes.

## Dependencies

pdfjs-dist — PDF parsing and rendering
React — UI framework
Vite — build tool (required for the ?url worker import)