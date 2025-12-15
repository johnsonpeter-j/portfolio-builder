# Portfolio Builder

**Portfolio Builder** is a full-stack web application designed to help developers and creatives craft professional, high-performance portfolios in minutes. Built with **Next.js 16**, **MongoDB**, and **NextAuth**, it offers a seamless "No-Code" experience where users can sign up, choose from premium, aesthetically driven templates, and manage multiple portfolios from a centralized dashboard.

## Key Features

*   **Dynamic Template System**: Choose between distinct visual styles:
    *   *Neo-Modern*: Dark mode, Bento-grid layouts, glowing animations.
    *   *Swiss Minimal*: Editorial typography, high-contrast design.
*   **Live Builder**: Real-time editor with auto-save functionality to update personal details, skills, and projects instantly.
*   **Authentication & Management**: Secure user accounts via NextAuth.js to save progress and manage multiple portfolio versions.
*   **Public Deployments**: One-click publishing generates a unique, shareable URL (e.g., `/p/xm9-w2`) for every portfolio.
*   **Rich Media Support**: Projects support image previews, live demo links, and GitHub repository integration.

## Tech Stack

*   **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS v4, Framer Motion.
*   **Backend**: Next.js API Routes (Serverless), Mongoose.
*   **Database**: MongoDB.
*   **Auth**: NextAuth.js (v4).

## Getting Started

### Prerequisites

*   Node.js 18+
*   MongoDB Instance (Local or Atlas)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/portfolio-builder.git
    cd portfolio-builder
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory:
    ```env
    # Database
    MONGO_URL=mongodb://localhost:27017/portfolio-builder
    
    # JWT Authentication
    JWT_SECRET=your_jwt_secret_key_min_32_characters_long
    AUTH_SECRET=your_auth_secret_key_min_32_characters_long
    JWT_EXPIRES_IN=30
    JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_characters_long
    JWT_REFRESH_EXPIRES_IN=90
    JWT_ALGORITHM=HS256
    JWT_ISSUER=portfolio-builder
    JWT_AUDIENCE=portfolio-builder-users
    
    # NextAuth
    NEXTAUTH_URL=http://localhost:3000
    ```
    
    **Note**: Generate secure random strings for JWT_SECRET and AUTH_SECRET. You can use:
    ```bash
    openssl rand -base64 32
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

*   `/app`: Next.js App Router pages and layouts.
*   `/app/components/templates`: The core portfolio template designs.
*   `/lib`: Database and Auth utility functions.
*   `/models`: Mongoose schemas (User, Portfolio).
