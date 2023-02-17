# Cloudflare KV-Auth

This is an example of how one could use Cloudflare's distributed and fast KV data store together with Cloudflare Pages as a user authentication method.
This is a Proof of concept so DO NOT USE IT FOR PRODUCTION.

## 🚀 Demo

[Try now](https://poc-kv-auth.pages.dev)

## 📃 Documentation

Generally it is not recommended to store users passwords and you should avoid it as much as possible, by instead using OAuth Providers or using E-Mail Sign in with magic-links.

Pages comes with a feature called Pages functions where you can execute server-side code on the edge. The KV data store is directly available to those Pages functions.
This projects consists of two root folders:

### `/public` (Frontend)

This folder contains the static html ressources. The forms submit the user data to `functions` endpoints.

### `/functions` (Backend)

This folder contains the API endpoints for registering a user, logging in and out.
Cloudflare Pages uses file-based routing and creates the endpoints at the specified route. (starting from `functions` as root).
The `/function/protected/_middleware.js` function checks for a valid `session_id` and then forwards the request to the static assets handler if authenticated.

## 👩‍💻 Setup in Cloudflare

**Step 0**: Fork repository (or create own)

**Step 1**: Create New Pages project in Cloudflare dashboard and connect to repo

**Step 2**: Set **Build output directory**: to 'public'. Leave **Build command** blank.

**Step 3**: Generate secure token

```bash
openssl rand -base64 32
```

**Step 4**: Create environment variable **'SECRET'** in dashboard and paste secure token. _You should also hit the encrypt button so not even you but only your functions have access to the secret_

**Step 5**
Trigger new Deployment with a commit to the repository or from the dashboard.

## 🛠️ Development (local)

**Step 0**:
Clone the repo:

```bash
git clone https://github.com/max-elia/poc-kv-auth.git
```

**Step 1**: Install wrangler
[Instructions here](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

**Step 2**: Install dependencies

```bash
npm install // (or pnpm)
```

**Step 3**: Create secure token and paste in SECRET variable in .dev.vars file

```bash
openssl rand -base64 32
```

**Step 4**: Run locally

```bash
npm run dev
```

## Feedback

If you have any feedback, feel free to open an issue or pull request.

## ✍️ Authors

-   [@max-elia](https://www.github.com/max-elia)

## 💼 License

[MIT](https://github.com/max-elia/poc-kv-auth/blob/main/LICENSE)
