# Bontrager Positioning App - Modular Structure

This application has been refactored from a single 7,740-line HTML file into a modular, maintainable structure.

## Project Structure

```
bontrager-app/
├── index.html                 # Main HTML file (clean, only structure)
├── manifest.json             # PWA manifest
├── service-worker.js         # Service worker for offline support
├── css/
│   └── styles.css           # All CSS styles (separated from HTML)
├── js/
│   ├── main.js              # Core initialization & page navigation
│   ├── utils.js             # Utility functions
│   ├── dev.js               # Developer mode functions
│   ├── pwa.js               # PWA installation & management
│   ├── zoom.js              # Image zoom/pan/pinch system
│   └── data/
│       ├── book.js          # BOOK data structure
│       ├── quiz.js          # QUIZ data structure
│       └── images.js        # IMAGE_DATA & image mapping
├── icons/                    # App icons (add icon files here)
└── README.md                # This file
```

## File Organization

### HTML (index.html)
- Only the HTML structure and page layouts
- Links to external CSS and JS files
- Clean, readable markup

### CSS (css/styles.css)
- All styling (previously in `<style>` tag)
- CSS Variables for theming (dark/light mode)
- Component styles organized by section

### JavaScript Files (js/)

**main.js** - Core application logic
- Page navigation & DOM management
- Building chapter, position, and quiz lists
- Opening/closing positions and quizzes
- Settings management (fonts, colors, dark mode)

**utils.js** - Utility & helper functions
- Navigation functions (navTo, closeSidebar, etc.)
- Modal management
- Toast notifications
- Settings functions

**dev.js** - Developer mode features
- Developer login & authentication
- Edit modals for positions
- Image upload & editing
- Data management & export

**pwa.js** - Progressive Web App
- Service worker registration
- Install prompts
- Manifest generation
- Offline support

**zoom.js** - Image zoom functionality
- Pinch zoom on mobile
- Mouse wheel zoom
- Pan/drag functionality
- Double-tap to zoom

**data/book.js** - Course data
- BOOK object with chapters, subchapters, positions
- Position information (descriptions, technical details, CR angles, etc.)

**data/quiz.js** - Quiz questions
- QUIZ object with questions and answers
- Organized by chapter

**data/images.js** - Image management
- IMAGE_DATA with image paths
- Image mapping functions
- Position name to image matching

## Features

### Core Features
✅ Multi-page responsive application (learn, quiz, settings, etc.)
✅ Dark mode / Light mode toggle
✅ Font customization (family, weight, size)
✅ Color customization
✅ Progress tracking
✅ Study mode (hides distracting elements)
✅ Flashcard mode
✅ Quiz system with scoring

### Developer Features
✅ Developer login
✅ Edit positions, images, and quiz questions
✅ Image editor (crop, resize, dual images)
✅ Data export & embedding
✅ Appearance customization panel

### Offline & PWA
✅ Works completely offline
✅ Installable as app
✅ Service worker for caching
✅ Icon generation
✅ Manifest configuration

### Advanced
✅ Image zoom, pan, and pinch on mobile
✅ Search across all positions
✅ Quick review section
✅ AI chat assistant
✅ Responsive design (mobile, tablet, desktop)

## How to Use

1. **Open the app**: Open `index.html` in a web browser
2. **Learn**: Navigate to "Section 1 — Learn" to view radiographic positions
3. **Quiz**: Test yourself in "Section 2 — Quiz"
4. **Customize**: Go to Settings to personalize appearance
5. **Developer Mode**: Switch to Developer mode in sidebar (requires credentials)

## Development Workflow

To modify the app:

1. **Update styling**: Edit `css/styles.css`
2. **Add positions**: Edit `js/data/book.js` and add images to `renamed_images/` folder
3. **Add quiz questions**: Edit `js/data/quiz.js`
4. **Modify behavior**: Edit relevant `js/*.js` files
5. **Test changes**: Open `index.html` in browser

## Modularization Benefits

✅ **Easier Maintenance** - Each file has a single responsibility
✅ **Faster Loading** - Lazy load modules as needed (future enhancement)
✅ **Better Organization** - Clear separation of concerns
✅ **Simpler Debugging** - Find code faster with organized structure
✅ **Team-Friendly** - Multiple developers can work on different files
✅ **Reusable Code** - Functions and modules can be reused
✅ **Scalability** - Easy to add new features and pages

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Works offline as PWA

## Credits

Built by QUTAIBA SALAMA based on Bontrager 10th Edition book.

