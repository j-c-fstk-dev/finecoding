# Setup Guide: Starting a New Project Based on "Fine Coding"

This guide provides a step-by-step checklist to initialize a new project with the same technology stack and structure as the "Fine Coding" blog.

## 1. Prerequisites: Your Developer Toolkit

Before you begin, ensure you have the following tools installed on your system:

-   **Node.js:** Version 20.x or later.
-   **A Package Manager:** `npm` (included with Node.js), `yarn`, or `pnpm`.
-   **Git:** For version control.
-   **A Code Editor:** We recommend Visual Studio Code.
-   **A GitHub Account:** For hosting your code and connecting to deployment services.

---

## 2. Configuring External Services

Set up the required cloud services before initializing the project.

### a. Firebase (Backend & Database)

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Create a project"**.
3.  From the project dashboard, go to **Authentication** (under "Build").
4.  Click **"Get started"** and enable the **Email/Password** sign-in provider.
5.  Go back to the "Build" menu and click on **Firestore Database**.
6.  Click **"Create database"**. Start in **Production mode** and choose a server location.
7.  Go to **Project settings** (gear icon) > **General** tab.
8.  Scroll to "Your apps" and click the web icon (`</>`) to register a new web app.
9.  Firebase will show you a `firebaseConfig` object. Keep these credentials handy for the environment variables step.

### b. Google AI Studio (For Genkit)

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Sign in and click **"Create API key in new project"**.
3.  Copy the generated API key.

### c. Netlify (For Deployment)

1.  Go to [Netlify](https://www.netlify.com/) and sign up using your GitHub account. You will connect your project later.

---

## 3. Initializing the Next.js Project

1.  Open your terminal and run the Next.js creation command:
    ```sh
    npx create-next-app@latest
    ```

2.  When prompted, provide the following answers:
    ```
    What is your project named? [Your-Project-Name]
    Would you like to use TypeScript? Yes
    Would you like to use ESLint? Yes
    Would you like to use Tailwind CSS? Yes
    Would you like to use `src/` directory? Yes
    Would you like to use App Router? (recommended) Yes
    Would you like to customize the default import alias? No
    ```

3.  Navigate into your new project directory:
    ```sh
    cd [Your-Project-Name]
    ```

---

## 4. Installing Dependencies

1.  Install the required `npm` packages for functionality:
    ```sh
    npm install firebase genkit @genkit-ai/googleai zod @hookform/resolvers lucide-react framer-motion date-fns react-markdown remark-gfm react-syntax-highlighter resend next-pwa qrcode.react patch-package use-debounce
    ```

2.  Install the required development dependencies:
    ```sh
    npm install -D @tailwindcss/typography
    ```

3.  Install ShadCN/UI components (run the `init` command first, then add components):
    ```sh
    npx shadcn-ui@latest init
    ```
    Answer the `init` prompts as follows:
    ```
    Would you like to use HSL color variables for colors? Yes
    Which style would you like to use? Default
    Where is your global CSS file? src/app/globals.css
    Where is your tailwind.config.js located? tailwind.config.ts
    Configure the import alias for components: @/components
    Configure the import alias for utils: @/lib/utils
    Are you using React Server Components? Yes
    ```

4.  Use the ShadCN/UI CLI to add all the components used in this project:
    ```sh
    npx shadcn-ui@latest add accordion alert-dialog avatar badge button card checkbox collapsible command dialog dropdown-menu form input label menubar popover progress radio-group scroll-area select separator sheet skeleton slider switch table tabs textarea toast tooltip
    ```

---

## 5. Configuring Environment Variables

1.  In the root of your new project, create a file named `.env.local`.

2.  Copy the following template into `.env.local` and fill it with the credentials you gathered in Step 2.

    ```env
    # Firebase Configuration (from your Firebase project settings)
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
    NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcde...

    # Google AI (Genkit) Configuration (from Google AI Studio)
    GOOGLE_API_KEY=AIza...

    # Site URL (for sitemap, metadata, and sharing features)
    # Use http://localhost:3000 for development and your production URL for deployment
    NEXT_PUBLIC_SITE_URL=http://localhost:3000

    # Optional: Resend for email notifications
    RESEND_API_KEY=re_...
    ADMIN_EMAIL=your-admin-email@example.com
    ```

**Important:** Any variable prefixed with `NEXT_PUBLIC_` is exposed to the browser. Keys like `GOOGLE_API_KEY` and `RESEND_API_KEY` should remain server-side only (no prefix).

You are now ready to start copying the application logic (layouts, pages, components, and server actions) from the "Fine Coding" project into your new project structure. Good luck!