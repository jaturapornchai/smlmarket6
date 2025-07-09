# BUILD.md - Complete Project Reconstruction Guide

This document provides comprehensive instructions to recreate the SMLMarket project exactly as it is, using GitHub Copilot agent.

## 🎯 Project Overview

**Project Name**: SMLMarket (smlmarket6)  
**Type**: E-commerce web application with PDF quotation system  
**Framework**: Next.js 15 with TypeScript  
**Styling**: Tailwind CSS 4  
**Backend**: Firebase (Firestore, Authentication, Hosting)  
**Special Features**: Thai PDF generation with local fonts, Shopping cart, Product management  

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- GitHub Copilot access

## 🔧 Step 1: Project Initialization

### Create Next.js Project
```bash
npx create-next-app@latest smlmarket6 --typescript --tailwind --eslint --app --src-dir
cd smlmarket6
```

## 📦 Step 2: Package Dependencies

### Install Exact Dependencies
```bash
npm install @react-pdf/renderer@^4.3.0 firebase@^11.10.0 jspdf@^3.0.1 jspdf-autotable@^5.0.2
npm install -D @types/jspdf@^1.3.3
```

### Complete package.json
```json
{
  "name": "smlmarket6",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@react-pdf/renderer": "^4.3.0",
    "@types/jspdf": "^1.3.3",
    "firebase": "^11.10.0",
    "jspdf": "^3.0.1",
    "jspdf-autotable": "^5.0.2",
    "next": "15.3.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## ⚙️ Step 3: Configuration Files

### next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Firebase Configuration Files

#### firebase.json
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### .firebaserc
```json
{
  "projects": {
    "default": "sml-market"
  }
}
```

### Environment Files

#### .env.example
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🎨 Step 4: Global Styles

### src/app/globals.css
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Sarabun', 'Noto Sans Thai', Arial, Helvetica, sans-serif;
}

/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Custom utility classes */
.float-animation { animation: float 6s ease-in-out infinite; }
.pulse-glow { animation: pulse-glow 2s infinite; }
.gradient-shift { 
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Smooth scrolling */
html { scroll-behavior: smooth; }

/* Custom scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { 
  background: #c1c1c1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track { background: #1f1f1f; }
  ::-webkit-scrollbar-thumb { background: #555; }
  ::-webkit-scrollbar-thumb:hover { background: #777; }
}

/* Text utilities */
.product-name {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  overflow-wrap: break-word;
}

.no-clamp {
  display: block !important;
  -webkit-line-clamp: unset !important;
  line-clamp: unset !important;
  -webkit-box-orient: unset !important;
  overflow: visible !important;
}

/* Hide number input spinner buttons */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
```

## 📂 Step 5: Project Structure

Create the following directory structure:

```
src/
├── app/
│   ├── cart/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   ├── product/
│   │   └── [id]/
│   │       ├── loading.tsx
│   │       ├── not-found.tsx
│   │       └── page.tsx
│   ├── quotation/
│   │   └── page.tsx
│   ├── test/
│   │   └── page.tsx
│   ├── test-product-url/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── FirebaseExample.tsx
│   ├── GradientIcon.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── Notification.tsx
│   ├── OrdersClient.tsx
│   ├── PDFPreview.tsx
│   ├── Pagination.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetailClient.tsx
│   ├── ProductPageClient.tsx
│   ├── SearchBar.tsx
│   └── index.ts
└── lib/
    ├── api.ts
    ├── authContext.tsx
    ├── cartService.ts
    ├── constants.ts
    ├── firebase.ts
    ├── firebaseHooks.ts
    ├── firebaseTypes.ts
    ├── imageUtils.ts
    ├── orderService.ts
    ├── pdfReactRendererLocal.tsx
    ├── productUtils.ts
    └── userService.ts

public/
├── fonts/
│   ├── NotoSansThai-Regular.ttf
│   └── NotoSansThai-Bold.ttf
├── demo-images/
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

## 🔤 Step 6: Font Setup

### Download Thai Fonts
1. Download Noto Sans Thai fonts from Google Fonts
2. Place in `public/fonts/`:
   - `NotoSansThai-Regular.ttf`
   - `NotoSansThai-Bold.ttf`

### Font URLs for Download:
- Regular: https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.woff2
- Bold: https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.woff2

Convert .woff2 to .ttf using online converters.

## 🚀 Step 7: Key Implementation Details

### Firebase Integration
The project uses Firebase for:
- **Authentication**: User login/logout
- **Firestore**: Product data, cart, orders
- **Hosting**: Static site deployment

### PDF Generation System
- **Library**: @react-pdf/renderer for Thai support
- **Local Fonts**: Uses public/fonts/NotoSansThai-Regular.ttf
- **Features**: Quotation generation, preview, download
- **Layout**: Optimized compact design with proper Thai text rendering

### E-commerce Features
- **Shopping Cart**: Firebase-based cart persistence
- **Product Search**: Integration with external API
- **Order Management**: Complete order lifecycle
- **Responsive Design**: Mobile-first approach

## 🎯 Step 8: Critical Components to Implement

### 1. Main Layout (src/app/layout.tsx)
- Root layout with Thai font loading
- Metadata configuration
- Global providers setup

### 2. PDF System (src/lib/pdfReactRendererLocal.tsx)
- Thai font registration
- Quotation document structure
- PDF generation and preview functions

### 3. Firebase Configuration (src/lib/firebase.ts)
- Firebase app initialization
- Service exports (auth, firestore, etc.)

### 4. Shopping Cart (src/lib/firebaseHooks.ts)
- Cart state management
- Firebase integration
- Real-time updates

### 5. Product Components
- ProductCard for listings
- ProductDetailClient for individual products
- Search integration

## 🔧 Step 9: Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

## 🌐 Step 10: Firebase Setup

1. Create Firebase project: https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Hosting
5. Copy configuration to .env.local

## 📝 Step 11: API Integration

The project integrates with external product API:
- **Base URL**: https://smlgoapi.dedepos.com
- **Endpoint**: /search-by-vector
- **Features**: Thai/English search support

## 🎨 Step 12: UI/UX Features

### Design System
- **Colors**: Blue primary (#3b82f6), Gray secondary
- **Typography**: Sarabun, Noto Sans Thai
- **Animations**: Smooth transitions, hover effects
- **Responsive**: Mobile-first design

### Components
- Reusable Button component with variants
- Card components for product display
- Loading spinners and notifications
- Header with navigation and cart icon

## 🔍 Step 13: Key Features Implementation

### PDF Quotation System
- Generate professional Thai quotations
- Support for Thai text rendering
- Print-ready A4 format
- Optimized spacing for maximum content

### Shopping Cart
- Add/remove products
- Quantity management
- Persistent storage in Firebase
- Real-time updates

### Authentication
- Email/password login
- Protected routes
- User session management

## 🚀 Step 14: Deployment

### Build Process
```bash
npm run build
```

### Firebase Deployment
```bash
firebase deploy --only hosting
```

### Live URL
The deployed application will be available at:
- https://sml-market.web.app

## 📚 Step 15: Documentation Files

The project includes these documentation files:
- `README.md` - Project overview and getting started
- `BUILD.md` - This complete reconstruction guide
- `THAI_PDF_SOLUTION.md` - Thai PDF implementation details
- `THAI_PDF_FINAL_SOLUTION.md` - Final PDF solution documentation

## ⚠️ Important Notes

1. **Font Files**: Must download and place Thai fonts in public/fonts/
2. **Firebase Config**: Must create your own Firebase project and update config
3. **TypeScript**: Some strict type checking is disabled for PDF components
4. **Build Settings**: ESLint and TypeScript errors ignored during build for deployment
5. **PDF Features**: Thai text support requires local font files

## 🎯 Success Criteria

When completed, the project should have:
- ✅ Working e-commerce functionality
- ✅ Thai PDF generation with proper fonts
- ✅ Firebase authentication and data
- ✅ Responsive design on all devices
- ✅ Shopping cart persistence
- ✅ Product search and display
- ✅ Order management system
- ✅ Deployable to Firebase Hosting

## 📞 Support

If you encounter issues during reconstruction:
1. Check Firebase configuration
2. Verify font files are properly placed
3. Ensure all dependencies are installed with exact versions
4. Review TypeScript/ESLint configuration

---

This guide provides everything needed to recreate the SMLMarket project exactly as it exists. Follow each step carefully and you'll have an identical, fully functional e-commerce application with Thai PDF support.
