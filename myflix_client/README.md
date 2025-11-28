# myFlix Client (minimal)

This folder contains a minimal React client that fetches movies from the myFlix API. By default it uses the Vite env variable `VITE_API_BASE`.
If you want the client to use your Heroku deployment, create a `.env` file in `myflix_client` with:

```
VITE_API_BASE=https://lloydapi.herokuapp.com
```

When not set, the client falls back to `http://localhost:8080`.

Quick start:

1. Install dependencies:

```bash
cd myflix_client
npm install
```

2. Start the API (from the `myflix_api` server folder):

```bash
cd ../myflix_api/myflix_api
npm run start
```

3. Start the client:

```bash
cd ../../myflix_client
npm start
```

Open `http://localhost:5173` (Vite default) to view the app. Restart the Vite dev server after changing `.env` so it picks up the new value.

Notes:
- The app initializes `movies` as an empty array and populates it via `fetch` to `/movies`.
- Components use `prop-types` for validation.
