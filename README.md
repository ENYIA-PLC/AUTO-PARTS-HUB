# PartsHub Marketplace

PartsHub Marketplace is a modern, full-stack application designed to connect buyers and sellers of automotive parts. Built with React, TypeScript, and Tailwind CSS on the frontend, and an Express.js backend integrating Firebase Admin for secure operations.

## Features

- **Storefront & Product Catalog:** Browse auto parts with categories, search filtering, and price formatting.
- **Offline Support:** The Storefront utilizes local storage caching to allow users to view previously loaded parts securely even without an active internet connection.
- **Interactive Vehicle Diagram:** Visual, interactive exploration of car parts categorized by vehicle area (Engine, Brakes, Suspension, Electrical, etc.).
- **Order History & Real-Time Tracking:** Detailed order updates with a visual tracking timeline from processing to delivery.
- **Secure Backend API:** Express.js server verifying Firebase Auth tokens for protected transaction pathways.
- **Internationalization (i18n):** Native support for localization, including English, Hausa, Igbo, and Yoruba.
- **Theme Support:** Dark mode and light mode visual themes.
- **Wishlist & Parts Comparison:** Add multiple parts to compare specs, prices, and condition side-by-side.

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Motion (framer-motion), Lucide React
- **Backend:** Node.js, Express, Firebase Admin SDK
- **Database / Auth:** Firebase (Firestore / Authentication)
- **Deployment:** Docker / Cloud Run Compatible

## Getting Started

### Prerequisites

- Node.js (v18+)
- Firebase Project with Firestore and Auth enabled

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Environment Setup:
   - Configure your `.env` by copying `.env.example`.
   - Set up your `firebase-applet-config.json` with your Firebase project credentials.

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

Compile the application and the backend server bundle:

```bash
npm run build
npm start
```
