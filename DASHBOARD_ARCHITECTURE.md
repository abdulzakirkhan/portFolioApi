# Portfolio Dashboard Architecture Guide

## Overview
Transform your hardcoded JSON portfolio into a **database-driven system** with an **admin dashboard** for managing all content.

---

## 1. ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                        Your System                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐              ┌──────────────┐             │
│  │   Portfolio  │              │   Dashboard  │             │
│  │  (React App) │◄─────┐   ┌──►│  (React UI)  │             │
│  │              │      │   │   │              │             │
│  │ - Displays   │      │   │   │ - Create     │             │
│  │   content    │      │   │   │ - Update     │             │
│  │ - Fetches    │      │   │   │ - Delete     │             │
│  │   from API   │      │   │   │ - Manage     │             │
│  └──────────────┘      │   │   └──────────────┘             │
│                        │   │                                 │
│                   ┌────┴───┴────┐                            │
│                   │  Express.js  │                           │
│                   │   API Server │                           │
│                   │              │                           │
│                   │ - GET /api/* │ (Fetch data)             │
│                   │ - POST /api/*│ (Create)                 │
│                   │ - PUT /api/* │ (Update)                 │
│                   │ - DELETE /*  │ (Delete)                 │
│                   └────┬─────────┘                           │
│                        │                                     │
│         ┌──────────────┼──────────────┐                     │
│         │              │              │                     │
│    ┌────▼────┐  ┌─────▼──────┐  ┌───▼──────┐               │
│    │ MongoDB │  │   Local FS  │  │ Multer   │               │
│    │          │  │             │  │(Upload)  │               │
│    │- Sections│  │ /uploads/   │  │          │               │
│    │- Items   │  │ - images/   │  │Handle:   │               │
│    │- Tags    │  │ - media/    │  │- Files   │               │
│    │- Strings │  │ - logos/    │  │- Storage │               │
│    │- Profile │  │             │  │- Paths   │               │
│    └──────────┘  └─────────────┘  └──────────┘               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. DATABASE SCHEMA (MongoDB)

### Collections Structure

#### 2.1 `profiles` Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  location: String,
  bio: String,
  profileImage: String,  // Path: /uploads/images/profile-pic.jpg
  resumePdfUrl: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    portfolio: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.2 `sections` Collection
```javascript
{
  _id: ObjectId,
  id: String,              // "experience", "skills", "education"
  categoryId: String,      // "background", "showcase", "home"
  title: {
    locales: {
      en: { title_short: String, title_long: String, ... },
      es: { ... },
      fr: { ... },
      ko: { ... }
    }
  },
  jsonPath: String,        // Reference: "/data/sections/experience"
  faIcon: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.3 `sectionData` Collection (Dynamic Items)
```javascript
{
  _id: ObjectId,
  sectionId: ObjectId,     // Reference to sections._id
  sectionType: String,     // "experience", "education", "skills"
  itemId: Number,
  img: String,             // Path: /uploads/images/logo.jpg
  faIcon: String,
  faIconColors: {
    bg: String,
    fill: String
  },
  dateStart: { year: Number, month: Number, day: Number },
  dateEnd: { year: Number, month: Number, now: Boolean },
  categoryId: String,      // For filtering
  locales: {
    en: {
      title: String,
      province: String,
      country: String,
      institution: String,
      text: String,
      list: [String],
      tags: [String]
    },
    es: { ... },
    fr: { ... },
    ko: { ... }
  },
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.4 `categories` Collection
```javascript
{
  _id: ObjectId,
  id: String,          // "background", "showcase", "home"
  name: String,        // "Background", "Showcase", "Home"
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.5 `strings` Collection (Translations)
```javascript
{
  _id: ObjectId,
  key: String,         // "present", "experience_year_count_singular"
  locales: {
    en: String,
    es: String,
    fr: String,
    ko: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. BACKEND API STRUCTURE

### 3.1 Express.js Setup with Routes

```
backend/
├── server.js
├── config/
│   ├── database.js
│   └── upload.js
├── models/
│   ├── Profile.js
│   ├── Section.js
│   ├── SectionData.js
│   ├── Category.js
│   └── String.js
├── routes/
│   ├── profile.js
│   ├── sections.js
│   ├── sectionData.js
│   ├── categories.js
│   ├── strings.js
│   └── uploads.js
├── controllers/
│   ├── profileController.js
│   ├── sectionsController.js
│   ├── sectionDataController.js
│   ├── categoriesController.js
│   ├── stringsController.js
│   └── uploadsController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
└── public/
    └── uploads/
        ├── images/
        ├── media/
        └── logos/
```

### 3.2 API Endpoints

#### Profile Endpoints
```
GET    /api/profile              → Get profile info
POST   /api/profile              → Create profile
PUT    /api/profile/:id          → Update profile
DELETE /api/profile/:id          → Delete profile
```

#### Sections Endpoints
```
GET    /api/sections             → Get all sections
GET    /api/sections/:id         → Get single section
POST   /api/sections             → Create section
PUT    /api/sections/:id         → Update section
DELETE /api/sections/:id         → Delete section
```

#### Section Data (Items) Endpoints
```
GET    /api/sections/:sectionId/items           → Get all items in section
GET    /api/sections/:sectionId/items/:itemId   → Get single item
POST   /api/sections/:sectionId/items           → Create item
PUT    /api/sections/:sectionId/items/:itemId   → Update item
DELETE /api/sections/:sectionId/items/:itemId   → Delete item
```

#### File Upload Endpoints
```
POST   /api/uploads/image        → Upload image (returns path)
POST   /api/uploads/media        → Upload media (returns path)
DELETE /api/uploads/:filename    → Delete uploaded file
GET    /api/uploads/:path        → Serve static files
```

#### Categories Endpoints
```
GET    /api/categories           → Get all categories
POST   /api/categories           → Create category
PUT    /api/categories/:id       → Update category
DELETE /api/categories/:id       → Delete category
```

#### Strings (Translations) Endpoints
```
GET    /api/strings              → Get all strings
POST   /api/strings              → Create string
PUT    /api/strings/:id          → Update string
DELETE /api/strings/:id          → Delete string
```

---

## 4. LOCAL FILE UPLOAD STRATEGY

### 4.1 Upload Configuration (Multer)

```javascript
// config/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories if they don't exist
const uploadDir = path.join(__dirname, '../public/uploads');
const ensureDirs = () => {
  ['images', 'media', 'logos'].forEach(dir => {
    const dirPath = path.join(uploadDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDirs();
    
    // Determine folder based on file type
    let folder = 'images';
    if (file.mimetype.startsWith('image/')) {
      folder = 'images';
    } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
      folder = 'media';
    }
    
    cb(null, path.join(uploadDir, folder));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, videos, audio
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/wav'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024  // 50MB max
  }
});
```

### 4.2 File Storage Structure

```
public/
└── uploads/
    ├── images/
    │   ├── 1724620800000-profile-pic.jpg
    │   ├── 1724620801000-logo-repla.png
    │   └── 1724620802000-logo-fbm.png
    ├── media/
    │   ├── 1724620803000-intro.mp4
    │   └── 1724620804000-background.mp3
    └── logos/
        ├── 1724620805000-company-logo.svg
        └── 1724620806000-skill-icon.png
```

### 4.3 Returned Paths Format

When user uploads a file, API returns:
```javascript
{
  success: true,
  filePath: "/uploads/images/1724620800000-profile-pic.jpg",
  fileName: "1724620800000-profile-pic.jpg",
  message: "File uploaded successfully"
}
```

Then store this `filePath` in MongoDB as:
```javascript
{
  img: "/uploads/images/1724620800000-profile-pic.jpg"
}
```

---

## 5. HOW THEY CONNECT

### 5.1 Data Flow: Dashboard → Database → Portfolio

**Scenario: User updates experience item**

```
1. Dashboard (React)
   User fills form and uploads logo
   ↓
2. Dashboard sends FormData:
   - POST /api/sections/experience/items
   - With file upload
   ↓
3. Backend (Express)
   - Multer saves file to /public/uploads/images/
   - Returns file path: /uploads/images/filename.jpg
   - Saves data + filePath to MongoDB
   ↓
4. Database (MongoDB)
   sectionData collection updated:
   {
     sectionId: ObjectId,
     img: "/uploads/images/filename.jpg",
     locales: { ... },
     ...
   }
   ↓
5. Portfolio (React)
   - On mount: GET /api/sections/experience/items
   - Receives data with file paths
   - Renders: <img src="/uploads/images/filename.jpg" />
   ↓
6. Static Files
   Express serves /public/uploads/* as static
   Browser loads images from disk
```

### 5.2 Request/Response Example

**Dashboard creates new experience entry:**

```javascript
// Frontend (Dashboard)
const formData = new FormData();
formData.append('title', 'Full Stack Developer');
formData.append('institution', 'FBM Solutions');
formData.append('locales', JSON.stringify({
  en: { title: 'Full Stack Developer', ... }
}));
formData.append('dateStart', JSON.stringify({ year: 2025, month: 1 }));
formData.append('image', fileInputElement.files[0]); // Logo file

await fetch('/api/sections/experience/items', {
  method: 'POST',
  body: formData
});
```

```javascript
// Backend Response
{
  success: true,
  item: {
    _id: ObjectId,
    sectionId: ObjectId,
    img: "/uploads/images/1724620800000-fbm-logo.png",
    title: "Full Stack Developer",
    institution: "FBM Solutions",
    locales: { en: { ... } },
    ...
  }
}
```

```javascript
// Portfolio fetches and displays
const response = await fetch('/api/sections/experience/items');
const items = await response.json();

// In React component:
<img src={item.img} alt={item.institution} />
// Actual: <img src="/uploads/images/1724620800000-fbm-logo.png" />
```

---

## 6. MODIFIED PORTFOLIO (DataProvider)

### Current Approach (JSON files)
```javascript
// OLD - Loads from static JSON
const jSections = await utils.file.loadJSON("/data/sections.json")
```

### New Approach (API-driven)
```javascript
// NEW - Loads from API
const response = await fetch('/api/sections');
const jSections = await response.json();

// Also load profile
const profileResponse = await fetch('/api/profile');
const profile = await profileResponse.json();

// Load categories
const categoriesResponse = await fetch('/api/categories');
const categories = await categoriesResponse.json();
```

---

## 7. DASHBOARD COMPONENTS STRUCTURE

```
src/
├── pages/
│   ├── Dashboard.jsx
│   ├── ProfileEditor.jsx
│   ├── SectionsManager.jsx
│   ├── ItemsEditor.jsx
│   └── FileManager.jsx
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── MainLayout.jsx
│   │   └── FormBuilder.jsx
│   ├── forms/
│   │   ├── ProfileForm.jsx
│   │   ├── SectionForm.jsx
│   │   ├── ItemForm.jsx
│   │   └── FileUploadField.jsx
│   └── editors/
│       ├── MultiLanguageEditor.jsx
│       ├── DatePicker.jsx
│       └── RichTextEditor.jsx
├── hooks/
│   ├── useAPI.js
│   ├── useUpload.js
│   └── useDashboard.js
└── services/
    ├── apiService.js
    └── uploadService.js
```

### Example: Item Form Component

```javascript
// components/forms/ItemForm.jsx
import React, { useState } from 'react'
import FileUploadField from './FileUploadField'
import MultiLanguageEditor from '../editors/MultiLanguageEditor'

function ItemForm({ sectionId, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    img: null,
    dateStart: { year: 2025, month: 1 },
    dateEnd: { now: true },
    locales: { en: { title: '', institution: '', text: '', list: [] } },
    tags: []
  })

  const handleImageUpload = async (file) => {
    const uploadForm = new FormData()
    uploadForm.append('file', file)
    
    const response = await fetch('/api/uploads/image', {
      method: 'POST',
      body: uploadForm
    })
    
    const data = await response.json()
    setFormData(prev => ({ ...prev, img: data.filePath }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const submitForm = new FormData()
    submitForm.append('data', JSON.stringify(formData))
    
    await fetch(`/api/sections/${sectionId}/items`, {
      method: 'POST',
      body: submitForm
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      
      <FileUploadField 
        onUpload={handleImageUpload}
        label="Company Logo"
      />
      
      <MultiLanguageEditor 
        value={formData.locales}
        onChange={(locales) => setFormData(prev => ({ ...prev, locales }))}
      />
      
      <button type="submit">Save Item</button>
    </form>
  )
}

export default ItemForm
```

---

## 8. MIGRATION STRATEGY

### Phase 1: Setup Backend
1. Create Node.js/Express server
2. Setup MongoDB connection
3. Create models and schemas
4. Implement API endpoints
5. Test with Postman

### Phase 2: Implement File Upload
1. Setup Multer configuration
2. Create upload endpoints
3. Test file storage
4. Create static file serving

### Phase 3: Build Dashboard
1. Create React dashboard components
2. Implement forms for all sections
3. Add file upload UI
4. Connect to API endpoints
5. Add CRUD functionality

### Phase 4: Migrate Portfolio
1. Modify DataProvider to fetch from API
2. Update components to work with new data structure
3. Test all existing features
4. Remove old JSON file dependencies

### Phase 5: Testing & Deployment
1. Test complete workflow
2. Setup environment variables
3. Deploy backend
4. Deploy dashboard
5. Deploy updated portfolio

---

## 9. ENVIRONMENT VARIABLES

```
# .env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio
DB_NAME=portfolio

# Upload settings
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=52428800  # 50MB

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT (optional, for admin auth)
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

---

## 10. KEY BENEFITS

✅ **No more hardcoding** - Update from dashboard  
✅ **Real-time updates** - Changes immediately visible  
✅ **Multi-language support** - Manage all locales in one place  
✅ **Local file storage** - No external dependencies  
✅ **Database-backed** - Persistent storage  
✅ **Scalable** - Easy to add new sections/items  
✅ **Admin control** - Full CRUD operations  
✅ **Same database** - Single source of truth  

---

## 11. TECH STACK SUMMARY

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend (Portfolio) | React, Vite | Display portfolio |
| Frontend (Dashboard) | React, Vite | Manage content |
| Backend | Node.js, Express.js | API server |
| Database | MongoDB | Data storage |
| File Storage | Local FS (Multer) | Image/media storage |
| Static Files | Express static | Serve uploads |
| Auth (Optional) | JWT | Secure dashboard |

---

## Next Steps

Would you like me to:
1. Create the backend server structure?
2. Build the MongoDB models?
3. Create API endpoints?
4. Build dashboard components?
5. Set up the migration process?

Choose what to start with!

---

## 12. COLOR SCHEME & STYLING INTEGRATION

### 12.1 Shared Design System

The dashboard MUST use the same color scheme, typography, and styling system as the portfolio to ensure visual consistency.

#### 12.1.1 Theme Variables (SCSS)

Copy the entire theme system from the portfolio to the dashboard:

```
dashboard/src/styles/
├── themes/
│   ├── _theme-variables-builder.scss    // Copy from portfolio
│   ├── _variables-theme-dark.scss       // Copy from portfolio  
│   └── _variables-theme-light.scss      // Copy from portfolio
├── _constants.scss                       // Copy from portfolio
├── _extend.scss                          // Copy from portfolio
└── customization/
    ├── _bootstrap-customization.scss     // Copy from portfolio
    ├── _plugin-customization.scss       // Copy from portfolio
    └── _primitives-customization.scss    // Copy from portfolio
```

#### 12.1.2 Color Scheme Implementation

**Dark Theme Colors (from portfolio):**
```scss
$primary: #9dff8e;
$secondary: #a4afb5;
$dark: #161616;
$danger: #fdd2d2;
$muted: #6c757d;

$base-bg: #0c0c0c;
$base-bg-light: #181818;
$base-bg-dark: #090909;

$texts: #EEEEEE;
$texts-inverted: #111111;

$base-container-bg: #191919;
$base-popover-bg: #0e0e0e;
$base-boards: lighten($base-container-bg, 3%);
$base-info-badges: lighten($dark, 3%);
$empty: darken($base-container-bg, 3%);
$empty-accent: #131313;

$borders: #1D1D1D;
$scrollbar-track: #101010;
$scrollbar-thumb: #32343a;
```

**Light Theme Colors (from portfolio):**
```scss
$primary: #269366;
$secondary: darken(#798287, 10%);
$dark: #d1ead6;
$danger: #932626;
$muted: #7c8d7f;

$base-bg: #91d7aa;
$base-bg-light: #a6e3b8;
$base-bg-dark: #7ecb94;

$texts: #202521;
$texts-inverted: #EEE;

$base-container-bg: #f5faf6;
$base-container-bg-accent: #c2e9d0;
$base-popover-bg: #cae1d4;
$base-boards: lighten(#e6f6ea, 1%);
$base-info-badges: lighten(#d2e8d8, 3%);
$empty: #ffffff;

$borders: #eaf6eb;
$borders-nav-mobile: rgba(white, 0.15);
$borders-nav-mobile-accent: rgba(white, 0.6);
$scrollbar-track: #daf5e1;
$scrollbar-thumb: #55bd91;
```

#### 12.1.3 Typography

Use the same fonts as the portfolio:
```scss
$font-family-base: 'Saira', sans-serif;
$headings-font-family: 'Orbitron', sans-serif;
```

**Dashboard package.json dependencies:**
```json
{
  "dependencies": {
    "@fortawesome/fontawesome-free": "^6.6.0",
    "bootstrap": "^5.3.3",
    "primeicons": "^7.0.0",
    "react-bootstrap": "^2.10.4",
    "smooth-scrollbar": "^8.8.4"
  }
}
```

### 12.2 Preloader Integration

The dashboard should use a similar preloader experience as the portfolio:

#### 12.2.1 Preloader Colors
```scss
$loader-background: #111111;
$loader-contrast: #FFFFFF;
```

#### 12.2.2 Preloader Component Structure

Create a similar preloader component for the dashboard:

```
dashboard/src/components/
├── loaders/
│   ├── Preloader.jsx           // Similar to portfolio Preloader
│   └── Preloader.scss          // Same styling as portfolio
└── widgets/
    ├── Logo.jsx                // Same logo component
    └── PacMan.jsx              // Same loading animation
```

#### 12.2.3 Preloader Settings

Add to dashboard settings:
```javascript
{
  "preloaderSettings": {
    "enabled": true,
    "title": "Portfolio <strong>Dashboard</strong>",
    "subtitle": "Admin Panel",
    "logoOffset": {
      "right": 14,
      "top": 2,
      "bottom": 0
    }
  }
}
```

### 12.3 Dashboard Layout System

#### 12.3.1 Z-Index System (from portfolio)

Use the same z-index hierarchy:
```scss
$z-index-background: -1;
$z-index-content: 0;
$z-index-section-inactive: 10;
$z-index-section-active: 20;
$z-index-section-floating-items: 30;
$z-index-sidebar: 40;
$z-index-nav-tabs: 50;
$z-index-pop-over: 1200;
$z-index-modal: 1210;
$z-index-notifications: 1220;
$z-index-dialogs: 1230;
$z-index-activity-spinner: 1240;
$z-index-animated-cursor: 1250;
$z-index-loader: 1260;
```

#### 12.3.2 Layout Constraints

Use the same layout constraints:
```scss
$max-breakpoint-for-tabbed-interface: md;
$standard-border-radius: 10px;
$default-card-spacing: 0.5rem;
$default-card-spacing-mobile: 5px;
```

#### 12.3.3 Responsive Breakpoints

Use Bootstrap's breakpoint system (already imported in _extend.scss):
- Extra small: <576px
- Small: ≥576px
- Medium: ≥768px
- Large: ≥992px
- Extra large: ≥1200px
- XX Large: ≥1400px

### 12.4 Dashboard Component Styling

#### 12.4.1 Shared Components

Reuse these component styles from the portfolio:

**Buttons:**
- StandardButton.jsx/scss
- CircularButton.jsx/scss
- OptionPickerButton.jsx/scss

**Forms:**
- Input.jsx/scss
- Textarea.jsx/scss
- InputFieldWrapper.jsx/scss

**Generic:**
- AvatarView.jsx/scss
- Tags.jsx/scss
- Tooltip.jsx/scss
- Notification.jsx/scss

**Modals:**
- ModalWrapper.jsx/scss
- ConfirmationWindowModal.jsx/scss

#### 12.4.2 Dashboard-Specific Components

Create dashboard-specific components that follow the same styling patterns:

```
dashboard/src/components/dashboard/
├── Sidebar.jsx                  // Use same sidebar styling as NavSidebar
├── Header.jsx                   // Use same header styling
├── MainLayout.jsx              // Use same layout structure
├── DataTable.jsx               // Styled with theme variables
├── FormCard.jsx                // Use same card styling as portfolio
└── StatusBadge.jsx             // Use same badge styling as InfoBadge
```

### 12.5 Theme Switching Implementation

#### 12.5.1 Theme Provider

Create a ThemeProvider similar to the portfolio:

```javascript
// dashboard/src/providers/ThemeProvider.jsx
import React, { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ supportedThemes, defaultThemeId, children }) {
  const [selectedThemeId, setSelectedThemeId] = useState(defaultThemeId)

  const toggle = () => {
    setSelectedThemeId(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const getSelectedTheme = () => {
    return supportedThemes.find(theme => theme.id === selectedThemeId)
  }

  return (
    <ThemeContext.Provider value={{ 
      selectedThemeId, 
      setSelectedThemeId, 
      toggle, 
      getSelectedTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

#### 12.5.2 Theme CSS Variables

Ensure the dashboard applies the same CSS variables:

```javascript
// dashboard/src/main.jsx
useEffect(() => {
  const theme = getSelectedTheme()
  document.documentElement.setAttribute('data-theme', theme.id)
}, [selectedThemeId])
```

### 12.6 Icon System

Use the same icon libraries as the portfolio:

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-free": "^6.6.0",
    "primeicons": "^7.0.0"
  }
}
```

**Icon Usage Examples:**
```jsx
// Font Awesome
<i className="fa-solid fa-edit"></i>
<i className="fa-solid fa-trash"></i>
<i className="fa-solid fa-plus"></i>

// PrimeIcons  
<i className="pi pi-pencil"></i>
<i className="pi pi-trash"></i>
<i className="pi pi-plus"></i>
```

### 12.7 Dashboard Package.json Configuration

```json
{
  "name": "portfolio-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fortawesome/fontawesome-free": "^6.6.0",
    "bootstrap": "^5.3.3",
    "primeicons": "^7.0.0",
    "react": "^18.3.1",
    "react-bootstrap": "^2.10.4",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "smooth-scrollbar": "^8.8.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^9.9.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "sass-embedded": "^1.78.0",
    "vite": "^6.3.5"
  }
}
```

### 12.8 File Structure for Styling Integration

```
portfolio-dashboard/
├── src/
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── _theme-variables-builder.scss    [COPY FROM PORTFOLIO]
│   │   │   ├── _variables-theme-dark.scss       [COPY FROM PORTFOLIO]
│   │   │   └── _variables-theme-light.scss      [COPY FROM PORTFOLIO]
│   │   ├── customization/
│   │   │   ├── _bootstrap-customization.scss     [COPY FROM PORTFOLIO]
│   │   │   ├── _plugin-customization.scss       [COPY FROM PORTFOLIO]
│   │   │   └── _primitives-customization.scss    [COPY FROM PORTFOLIO]
│   │   ├── _constants.scss                       [COPY FROM PORTFOLIO]
│   │   ├── _extend.scss                          [COPY FROM PORTFOLIO]
│   │   ├── _root-flags.scss                      [COPY FROM PORTFOLIO]
│   │   └── app.scss                              [DASHBOARD MAIN STYLES]
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.scss
│   │   │   ├── Header.jsx
│   │   │   ├── Header.scss
│   │   │   └── MainLayout.jsx
│   │   ├── loaders/
│   │   │   ├── Preloader.jsx                     [SIMILAR TO PORTFOLIO]
│   │   │   └── Preloader.scss                    [COPY FROM PORTFOLIO]
│   │   └── widgets/
│   │       ├── Logo.jsx                          [COPY FROM PORTFOLIO]
│   │       └── PacMan.jsx                        [COPY FROM PORTFOLIO]
│   ├── providers/
│   │   ├── ThemeProvider.jsx                     [SIMILAR TO PORTFOLIO]
│   │   └── NotificationProvider.jsx              [SIMILAR TO PORTFOLIO]
│   └── main.jsx
└── package.json
```

### 12.9 Implementation Checklist

- [ ] Copy all theme SCSS files from portfolio to dashboard
- [ ] Copy Bootstrap customization files
- [ ] Copy plugin customization files
- [ ] Copy constants and extend files
- [ ] Implement ThemeProvider for dashboard
- [ ] Create preloader component with same styling
- [ ] Copy Logo and PacMan components
- [ ] Install same font and icon dependencies
- [ ] Implement responsive design with same breakpoints
- [ ] Use same z-index system
- [ ] Apply same border radius and spacing constants
- [ ] Test dark/light theme switching
- [ ] Ensure visual consistency with portfolio
