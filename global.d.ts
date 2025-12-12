// CSS Module declarations
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

// Global CSS declarations (for side-effect imports like in layout.tsx)
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";