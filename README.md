# Retirement Calculator

This project is a Retirement Calculator built with React.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm) installed on your system.

### Installing

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd Retirement-Calculator
    ```

2.  **Install dependencies**:
    Navigate to the project's root directory in your terminal and run:
    ```bash
    npm install
    ```
    This will download and install all the necessary packages defined in `package.json`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.<br />
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Deploying and Embedding the Calculator

To use this calculator on a live website, follow these steps:

### 1. Build the Application

First, create a production-ready build of the calculator:

```bash
npm run build
```

This command will create a `build` directory in your project root. This folder contains all the static assets (HTML, CSS, JavaScript) needed to run your calculator.

### 2. Host the `build` Folder Contents

The contents of the `build` folder need to be hosted on a web server. Popular options for hosting static sites include:

-   **Netlify:** Offers easy drag-and-drop deployment and a generous free tier.
-   **Vercel:** Optimized for React projects, with a good free tier.
-   **GitHub Pages:** Host directly from your GitHub repository (if applicable).
-   **AWS S3, Google Cloud Storage, Azure Blob Storage:** Cloud provider solutions.
-   **Traditional Web Hosting:** Upload the contents to a directory (e.g., `public_html`) on your existing hosting plan.

Once hosted, your calculator will be accessible via a specific URL (e.g., `https://your-calculator.netlify.app/` or `https://yourwebsite.com/calculator/`).

### 3. Embed as an iframe

After your calculator is hosted and you have its public URL, you can embed it into any other website (like a GoHighLevel page) using an HTML `<iframe>` tag.

Add the following HTML snippet to the page where you want the calculator to appear:

```html
<iframe
  src="URL_OF_YOUR_HOSTED_CALCULATOR"
  width="100%" 
  height="800px"   <!-- Adjust height as needed -->
  style="border:none;"
  title="Retirement Calculator">
</iframe>
```

**Important:**

-   Replace `URL_OF_YOUR_HOSTED_CALCULATOR` with the actual URL where your calculator is live.
-   Adjust the `height` attribute of the iframe to ensure the entire calculator is visible without unnecessary scrollbars. You might need to experiment to find the optimal height.
-   The `width="100%"` will make the iframe responsive to its container. You can use a fixed pixel width if preferred (e.g., `width="600px"`).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/). 