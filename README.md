# Apple Threejs and GSAP Implementation

Building a 3D Apple website using Threejs and GSAP.

## Install Tailwind CSS

```bash
bun add -D install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## General Dependencies

-   [@gsap/react](https://www.npmjs.com/package/@gsap/react)
-   [gsap](https://www.npmjs.com/package/gsap)
-   [three](https://www.npmjs.com/package/three)
-   [@react-three/fiber](https://www.npmjs.com/package/@react-three/fiber)
-   [@react-three/drei](https://www.npmjs.com/package/@react-three/drei)
-   [@sentry/react](https://www.npmjs.com/package/@sentry/react)
-   [@sentry/vite-plugin](https://www.npmjs.com/package/@sentry/vite-plugin)

## Add @react-three as plugin in eslint

Create project on sentry.io then you can choose on terminal when you run the wizard.

-   plugins: ["react-refresh", "@react-three"],
-   Install @sentry/react
-   Add some init code in main.jsx
-   run npx @sentry/wizard@latest -i sourcemaps
-   Will added @sentry/vite-plugin
