# <img src="./public/favlogo.png" width="30" height="30" style="vertical-align: bottom" /> Spade

**Create beautiful images of your code.**

Spade (formerly DevSnap) is a powerful, customizable code snippet generator built with Next.js. It allows developers to create stunning, shareable images of their code with ease, offering sophisticated styling options and instant export capabilities.


## Features

-   ** Beautiful Themes**: Choose from popular color schemes like Monokai, Nord, Dracula, and Light.
-   ** Extensive Language Support**: Syntax highlighting for TypeScript, JavaScript, Python, Rust, Go, HTML, CSS, and [many more](./app/page.tsx).
-   ** Custom Backgrounds**: Use preset gradients or define your own **Custom CSS** backgrounds (hex codes, linear gradients, images).
-   ** Live Editing**: Type directly into the code window with a seamless editing experience.
-   ** Smart Export**:
    -   **Export PNG**: High-quality download of your snippet.
    -   **Tweet Integration**: Automatically copies the image to your clipboard and opens Twitter with a pre-filled status.
-   ** Deep Customization**:
    -   Adjust padding and shadow intensity.
    -   Toggle line numbers and filename.
    -   Auto-updating file extensions based on selected language.

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/spade.git
    cd spade
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to start creating.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Syntax Highlighting**: [Shiki](https://shiki.style/)
-   **Image Generation**: [html-to-image](https://github.com/bubkoo/html-to-image)
-   **Font**: Inter & JetBrains Mono

## License

MIT
