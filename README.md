# Personal website

This is my personal website, a mix of blog, portfolio, and experimental space. It is built with Next.js, React, Tailwind CSS, shadcn/ui, Framer Motion, react-i18next, and TypeScript.
I originally made it for myself to share what I am learning, share my thoughts, and store my projects. I like to think of it as a digital garden.

## Features

-   **Blog**: Where I write about technology, economics, culture, and whatever else feels worth discussing. Usually long-form posts and reflections on tech, economics, culture, sometimes personal diary.
-   **Projects**: Serves as my portfolio. Collection of projects, open-source work, and random things I've built.
-   **Multilingual support**: Fully internationalized using `react-i18next`. The site supports multiple languages, with a toggle in the header.
-   **Dark mode by default**: Because nobody wants to burn their eyes at 2 am.
-   **Responsive design**: The website is fully responsive and works well on most screen sizes.

## Getting started

If you want to run this project locally, it only takes a few steps.

### Prerequisites

-   Node.js (v18 or higher)
-   `pnpm` (or `npm`, or any other package manager you prefer)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/jartf/website-v4.git
    ```
2.  Navigate to the project directory (if not already in it)
    ```sh
    cd website-v4
    ```
3.  Install dependencies
    ```sh
    pnpm install
    ```
4.  Start the development server
    ```sh
    pnpm dev
    ```

The website should now be running at `http://localhost:3000`.

## Scripts

The main scripts are straightforward:

-   `pnpm dev`: Runs the development server.
-   `pnpm build`: Builds the project for production.
-   `pnpm start`: Starts the production server.
-   `pnpm lint`: Lints the codebase.

## Project Structure

The project is organized as follows:

-   `app/`: Contains the main application logic, including pages, layouts, and components.
-   `components/`: Contains reusable UI components.
-   `content/`: Contains the content for the blog and other pages, written in Markdown.
-   `hooks/`: Contains custom React hooks.
-   `i18n/`: Contains the internationalization configuration and translation files.
-   `lib/`: Contains utility functions and other shared code.
-   `public/`: Contains static assets, such as images and fonts.
-   `styles/`: Contains global styles and Tailwind CSS configuration.
-   `translations/`: Contains the translation files for the website.

## Contributing

This repo is mostly for my own use, but I'm keeping it public for anyone curious. Feel free to explore, fork it, and dig through the code.
If you come across an issue or notice something that could be improved, feel free to open a pull request or issue.

## License

This project is distributed under the Nolicense license. See the `LICENSE` file for more information.
