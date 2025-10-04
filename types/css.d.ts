// Type declarations for CSS imports in Next.js

// Global CSS files (like globals.css, tailwind imports, etc.)
declare module "*.css" {
  const content: any;
  export = content;
}

// SCSS files
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// Sass files
declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}

// Less files
declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}

// PostCSS files
declare module "*.pcss" {
  const content: any;
  export = content;
}

// Specific declaration for app globals
declare module "./globals.css";
declare module "../globals.css";
declare module "app/globals.css";
