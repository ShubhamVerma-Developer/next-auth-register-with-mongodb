# Next.js App with NextAuth and Google Authentication

This is a Next.js application with authentication implemented using NextAuth and Google as the provider.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Adding Authentication](#adding-authentication)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/nextjs-nextauth-app.git
    cd nextjs-nextauth-app
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

## Configuration

1. Create a new project on the [Google Cloud Console](https://console.cloud.google.com/).

2. Navigate to the OAuth 2.0 Credentials page:

    - Go to the Credentials page.
    - Click on "Create Credentials" and select "OAuth 2.0 Client ID".
    - Configure the OAuth consent screen with the necessary details.
    - Create the OAuth client ID. Set the authorized redirect URIs to `http://localhost:3000/api/auth/callback/google`.

3. Obtain your Client ID and Client Secret from the Google Cloud Console.

4. Create a `.env.local` file in the root of your project and add the following environment variables:

    ```env
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

## Adding Authentication

1. Install NextAuth.js:

    ```bash
    npm install next-auth
    ```

    or

    ```bash
    yarn add next-auth
    ```

2. Create an `[...nextauth].ts` file in the `pages/api/auth` directory:

    ```typescript
    // pages/api/auth/[...nextauth].ts
    import NextAuth from "next-auth";
    import GoogleProvider from "next-auth/providers/google";

    export default NextAuth({
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ],
      secret: process.env.NEXTAUTH_SECRET,
    });
    ```

3. Create a `_app.tsx` file in the `pages` directory (if it doesn't exist) and wrap your application with the `SessionProvider`:

    ```typescript
    // pages/_app.tsx
    import { SessionProvider } from "next-auth/react";
    import { AppProps } from "next/app";

    function MyApp({ Component, pageProps }: AppProps) {
      return (
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      );
    }

    export default MyApp;
    ```

4. Add a login button in your components/pages:

    ```typescript
    // components/LoginButton.tsx
    import { signIn, signOut, useSession } from "next-auth/react";

    const LoginButton: React.FC = () => {
      const { data: session } = useSession();

      if (session) {
        return (
          <>
            Signed in as {session.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        );
      }
      return <button onClick={() => signIn("google")}>Sign in with Google</button>;
    }

    export default LoginButton;
    ```

5. Use the `LoginButton` component in your pages:

    ```typescript
    // pages/index.tsx
    import LoginButton from "../components/LoginButton";

    const Home: React.FC = () => {
      return (
        <div>
          <h1>Welcome to the Next.js App</h1>
          <LoginButton />
        </div>
      );
    }

    export default Home;
    ```

## Running the Application

1. Start the development server:

    ```bash
    npm run dev
    ```

    or

    ```bash
    yarn dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Deployment

Follow the official Next.js deployment documentation: [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin my-feature-branch`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
