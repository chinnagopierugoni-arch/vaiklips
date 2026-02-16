# ShortClips AI

A futuristic 3D interactive web application that automatically converts long videos into AI-generated reels and shorts.

## Features

- **Immersive 3D Landing Page**: Built with React Three Fiber, featuring holographic interfaces and particle effects.
- **AI Dashboard**: Manage uploads and view generated content.
- **Smart Upload**: Drag-and-drop zone with real-time progress visualization.
- **Cinematic UI**: Glassmorphism, neon accents, and smooth animations using Framer Motion.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS v4
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion
- **Backend**: Client-side logic with LocalStorage (serverless-ready)

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## Project Structure

- `src/app`: Next.js App Router pages (Home, Login, Dashboard, Upload).
- `src/components/3d`: Three.js scenes and components.
- `src/components/ui`: Reusable UI components (Buttons, Cards).
- `src/server`: Express backend structure (optional standalone usage).
