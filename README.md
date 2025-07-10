
# Fine Coding - A Modern AI-Powered Blog Template

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://choosealicense.com/licenses/mit/)

**Fine Coding** is a feature-rich, open-source blog template built with the latest web technologies. It's designed for developers who appreciate fine craftsmanship in code and want a stunning, high-performance platform to share their knowledge. Inspired by a "Matrix" digital aesthetic, this template combines a sleek UI with powerful AI features, a full admin dashboard, and engaging user interactions.

This project serves as both a ready-to-deploy blog and a comprehensive portfolio piece showcasing modern development practices.

![Fine Coding Screenshot](https://res.cloudinary.com/dr0weongo/image/upload/v1751168647/file_00000000591c61f59c33352b1d8f37fd_ncuhov.png)

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Configuration](#installation--configuration)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

---

## About The Project

In a world of fast-paced development, **Fine Coding** champions the timeless principles of software craftsmanship. This blog is not just a platform; it's a statement. It demonstrates that software can be functional, beautiful, maintainable, and a joy to use.

The entire application was built with the principles it advocates, serving as a live example of what's possible with modern tools and a developer-centric mindset.

## Key Features

-   **Modern Frontend:** Built with the **Next.js App Router**, React, and TypeScript for a type-safe, performant experience.
-   **Sleek UI/UX:**
    -   Styled with **Tailwind CSS** and **ShadCN/UI** components.
    -   A custom-built, animated light/dark mode toggle.
    -   "Matrix"-style code rain effect on the homepage.
    -   Intermittent "glitch" effect on the header title for a dynamic feel.
    -   "Aura" glow animation on post cards that enhances visual feedback.
-   **AI Integration with Genkit:**
    -   AI-powered tag suggestions for new posts based on content analysis.
-   **Full-Fledged Admin Dashboard:**
    -   Secure authentication powered by **Firebase Auth**.
    -   Complete CRUD (Create, Read, Update, Delete) functionality for blog posts.
    -   Complete CRUD functionality for the **Resource Hub**.
    -   Ability to export newsletter subscribers to CSV.
-   **Rich Content & Community Features:**
    -   A **Resource Hub** to share curated tools and links with the community.
    -   A "wishlist" form for users to suggest new resources.
-   **User Engagement:**
    -   Interactive "like" button on posts with client-side state persistence.
    -   Interactive "favorite" button on resources.
    -   A complete comment section for visitors on both blog posts and resources.
    -   Newsletter subscription form integrated with Firebase and optional Beehiiv sync.
-   **Fully Responsive:** Designed to look and work great on all devices, from mobile phones to desktops.

## Built With

This project leverages a curated stack of modern and powerful technologies:

-   [Next.js](https://nextjs.org/)
-   [React](https://reactjs.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [ShadCN/UI](https://ui.shadcn.com/)
-   [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
-   [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Zod](https://zod.dev/)
-   [Resend](https://resend.com/) (for email notifications)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   **Node.js**: Version 20.x or later.
-   **npm** or **yarn**.
-   **Firebase Account**: You will need a Firebase project to handle authentication and the database.

### Installation & Configuration

1.  **Clone the repository**
    ```sh
    git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    cd YOUR_REPO_NAME
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up Firebase**
    -   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    -   In your project, go to **Authentication** and enable the **Email/Password** sign-in provider.
    -   Go to **Firestore Database** and create a new database in production mode.

4.  **Configure Environment Variables**
    -   Create a `.env.local` file in the root of your project by copying from `.env.example` if it exists, or creating a new one.
        ```sh
        cp .env.example .env.local # if .env.example exists
        ```
    -   Open your new `.env.local` file and fill in the required variables. You can find your Firebase project credentials in your Firebase project settings.
    -   You will also need a `GOOGLE_API_KEY` for Genkit. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   For newsletter features, you will need `RESEND_API_KEY`, `ADMIN_EMAIL`, `BEEHIIV_API_KEY`, and `BEEHIIV_PUBLICATION_ID`.

---

## Usage

This project requires two separate development servers to be running simultaneously: one for the Next.js application and one for the Genkit AI flows.

1.  **Start the Next.js development server:**
    ```sh
    npm run dev
    ```
    Your application will be available at `http://localhost:9002`.

2.  **In a new terminal window, start the Genkit development server:**
    ```sh
    npm run genkit:dev
    ```
    The Genkit development UI (Flows Explorer) will be available at `http://localhost:4000`.

Now you can navigate to `http://localhost:9002/admin` to create your first admin user (Firebase will automatically create the user on the first login attempt if the account doesn't exist) and start writing posts!

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## Acknowledgements

-   [ShadCN/UI](https://ui.shadcn.com/) for the fantastic UI components.
-   [Uiverse.io](https://uiverse.io/) for inspiration on some of the CSS animations.
-   The teams behind Next.js, Firebase, and Genkit for their incredible tools.
