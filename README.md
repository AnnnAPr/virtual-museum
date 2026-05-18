# Virtual Museum

An interactive web application that allows users to explore the collection of the Metropolitan Museum of Art using their [Metropolitan Museum of Art Collection API](https://metmuseum.github.io/). The application is built using vanilla JavaScript and uses Vite as a development server.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Install Dependencies

Open your terminal, navigate to the root directory of the project (`virtual-museum`), and run the following command to install all required dependencies (like Vite, ESLint, and Prettier):

```bash
npm install
```

### 2. Start the Development Server

Once the dependencies are installed, you can start the local development server:

```bash
npm run dev
```

This will start the Vite server. Look at your terminal output for the local URL. `Ctrl+Click` that URL or copy it into your web browser to view the application.

### 3. Build for Production

If you want to create an optimized, production-ready build of the application, run:

```bash
npm run build
```

This will generate a `dist` folder containing the minified HTML, CSS, and JavaScript files ready to be deployed to any static hosting service.

### 4. Preview the Production Build

To test the production build locally before deploying, you can run:

```bash
npm run preview
```

## Code Quality Commands

This project uses ESLint and Prettier to maintain code quality and formatting. Husky and lint-staged are configured to automatically run these checks before commits.

It can also be run manually:

- **Check for code errors:** `npm run lint`
- **Auto-format code files:** `npm run format`

## Testing

This project uses **Vitest** and **jsdom** to test routing logic and DOM manipulations.

To run the test suite in watch mode (ideal for development):

```bash
npm run test
```

To run the test suite a single time without watch mode:

```bash
npm run test -- --run
```

## Features

- **Gallery Search:** Search the entire Met catalog with smart pagination that automatically handles missing images and API limits.
- **Departments Exploration:** Browse art categorized by museum departments.
- **Dynamic Routing:** Fast, single-page navigation between Home, Gallery, and Departments without page reloads.
