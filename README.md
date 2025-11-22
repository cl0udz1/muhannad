# Portfolio

A dynamic, full-stack portfolio website built with Next.js 15, Tailwind CSS, Framer Motion, and Appwrite.

## Features

- **Dynamic Content**: All sections (Hero, Projects, Settings) are editable via the Admin Dashboard.
- **Admin Dashboard**: Protected route (`/admin`) for managing content.
- **Appwrite Integration**: Uses Appwrite for Auth, Database, and Storage.
- **Modern UI**: "Awwwards" style aesthetics with Bento grids and smooth animations.
- **Responsive**: Fully optimized for all devices.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, Shadcn/UI, Lucide Icons.
- **Backend**: Appwrite (Cloud or Self-hosted).

## Getting Started

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file in the root directory with the following variables:
    ```env
    NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
    APPWRITE_API_KEY=your_api_key
    ```
4.  **Initialize Backend**:
    Run the setup script to create the database and collections automatically:
    ```bash
    node setup_backend.js
    ```
5.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
6.  **Access the Admin Panel**:
    Navigate to `http://localhost:3000/login` to log in. You can create an account via the Appwrite Console or add a registration form if needed (currently admin-only via console creation recommended).

## Deployment

This project is configured for **Static Export** (`output: 'export'`), making it perfect for **Appwrite Sites**, Vercel, or Netlify.

### Deploy to Appwrite Sites

1.  **Build the project**:
    ```bash
    npm run build
    ```
    This will generate a static `out` directory.

2.  **Upload to Appwrite**:
    - Go to your Appwrite Console > Functions > Sites (if available) or Storage.
    - *Note: For Appwrite Sites, you typically zip the `out` folder and upload it.*

### Local Preview of Production Build

Since this is a static export, `npm start` might not work as expected for dynamic routes if not configured. Use `serve` to preview:

```bash
npx serve out
```

