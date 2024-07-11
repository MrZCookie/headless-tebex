# Headless Tebex

Generate a Tebex checkout using search parameters

## Usage

By cloning this repo and providing your webstore's public token, you are able to use url search parameters to generate and redirect the user to a Tebex checkout page

```
https://checkout.example.dev/?username=mrzcookie&packages=5231422,3275423,7575423
```

This can be used to easily streamline your checkout experience on a Minecraft server.

## Deployment

This app is built in vite and can be deployed to any static hosting provider, just clone the repository, provide your webstore's public token using the `WEBSTORE_ID` environment variable and built using `pnpm run build`

## Customize

Before you build the app, you are also able customize the `index.html` file with whatever you would like. Just make sure to leave the script tag thats located in the body element.
