# Welcome to Remix + Vite + shadcn/ui!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Getting Started

## Built in theme switcher

![image](https://github.com/jacob-ebey/remix-shadcn/assets/12063586/c6ed812c-764f-46b7-af30-26284f55535c)

![image](https://github.com/jacob-ebey/remix-shadcn/assets/12063586/4e378230-3b4b-4b78-8af4-096b30aacf79)

## Development

Run the Vite dev server:

```sh
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

## Docker

Building Docker image:

```sh
docker build -t opchaves/remix-shadcn
```

Running the production docker image:

```sh
docker run --rm -p 3000:3000 -e SESSION_SECRET="s3cr3t" -e DB_PATH='./data' opchaves/remix-shadcn
```

Setup your environment:

```sh
cp .env.example .env

SESSION_SECRET='s3cr3t'
DB_PATH='/data' # a persistent volume
NODE_ENV='production'
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build` and the server

- `server.js`
- `build/server`
- `build/client`

Take a look at the provided Dockerfile for further details on how to configure a production environment.
