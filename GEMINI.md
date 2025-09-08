## Project Overview

This project is a static personal blog website. It uses a simple architecture where blog posts are written in Markdown and a Node.js script generates a JSON file (`posts.json`) that lists all the posts. The frontend is plain HTML, CSS, and JavaScript (with jQuery) that fetches the JSON file to dynamically display the list of posts.

**Key Technologies:**

*   HTML
*   CSS
*   JavaScript (with jQuery)
*   Node.js (for the post generation script)
*   Markdown

## Building and Running

There is no complex build process. The site is composed of static files.

To update the list of posts, you need to run the `generate-posts.js` script. This will update the `posts.json` file.

**Prerequisites:**

*   Node.js and npm installed.

**Steps to update posts:**

1.  Make sure you have the dependencies installed:
    ```bash
    # No package.json, so no npm install needed.
    # The script only uses built-in Node.js modules.
    ```
2.  Run the script to generate the `posts.json` file:
    ```bash
    node scripts/generate-posts.js
    ```

After running the script, the `posts.json` file will be updated, and the changes will be visible on the website.

## Development Conventions

*   **Blog Posts:** New blog posts should be created as Markdown files in the `/posts` directory. The filename will be used to generate the URL slug.
*   **Post Generation:** The `scripts/generate-posts.js` script is responsible for updating the list of posts. It should be run every time a new post is added or a post is removed.
*   **Styling:** The website's styling is defined in `static/style.css`.
*   **Configuration:** The main site configuration is in `site.json`.
