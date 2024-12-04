<!--
* Contributors: @Zyruks
* Last updated on: December 3, 2024
* Last updated by: @Zyruks
-->

# FIFO App Overview 🗂️

Welcome to the **FIFO App**! This repository contains a simple application to manage a queue (First In, First Out) with support for user authentication, guest sessions, and theme management. Below is an overview of the project along with instructions on how to get started.

## Table of Contents 📑

- [Prerequisites 🛠️](#prerequisites)
- [Installation 🚀](#installation-🚀)
- [Environment Variables 🔑](#environment-variables-🔑)
- [General Setup ⚙️](#general-setup-⚙️)
- [Project Structure 📂](#project-structure-📂)
- [Utilities 🔧](#utilities-🔧)
- [Features 🌟](#features-🌟)

---

## Prerequisites 🛠️

Before using this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20.13.1)
- [pnpm](https://pnpm.io/) (version 9.9.0)

## Installation 🚀

To set up the project, clone the repository and install the dependencies:

```sh
git clone https://github.com/Zyruks/FIFO-app.git
cd fifo-app
pnpm install
```

## Environment Variables 🔑

To run the project, you'll need to configure environment variables. Here's a sample of what needs to be configured:

```sh
# Environment Variables Configuration Template
# Rename this file to `.env.local` or `.env` and populate it with your secrets.

# -------------------
# API Configuration
# -------------------
# Base URL for the API.
VITE_API_URL=

# -------------------
# Firebase Configuration
# -------------------
# Firebase project settings.
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

**Note:** Ensure these variables are kept secure and not exposed publicly.

## General Setup ⚙️

From the root of the project, you can run the following commands:

### Development

- **Run Development**:

  ```sh
  pnpm dev
  ```

### Build

- **Build Application**:

  ```sh
  pnpm build
  ```

### Preview

- **Preview Application**:

  ```sh
  pnpm preview
  ```

### Ports

- **Application**: [http://localhost:5173](http://localhost:5173)

## Project Structure 📂

The project is organized into the following directories:

- **`src/common`**: Contains shared logic and utilities:
  - **`context`**: Context providers for state management (`AuthContext`, `QueueContext`, `ThemeContext`).
  - **`hooks`**: Custom React hooks for event handling, local storage, and more.
  - **`constants`**: Centralized constants such as themes, form states, and Firebase error codes.
  - **`utils`**: Utility functions (`cn`, `validatePattern`).
- **`src/api`**: Contains Firebase initialization and API-related logic.
- **`src/components`**: Contains reusable UI components, such as `Button`, `TextInput`, and `LoginForm`.
- **`src/layouts`**: Layout components like `BaseLayout` for consistent structure.
- **`src/styles`**: SCSS files for styling (`main.scss`, `base/general.scss`).

## Utilities 🔧

- **TypeScript**: Provides static type checking.
- **ESLint**: Maintains code quality.
- **Prettier**: Ensures consistent code formatting.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Features 🌟

- **Authentication**: Firebase-based authentication with support for guest sessions.
- **Queue Management**: Add, remove, and manage items in a FIFO manner.
- **Theme Management**: Light, dark, and system themes.
- **Validation**: Client-side validation for forms using regular expressions.
