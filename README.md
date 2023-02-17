# Cloudflare KV-Auth

This is an example of how one could use Cloudflare's distributed and fast KV data store together with Cloudflare Pages as a user authentication method.
This is a Proof of concept so DO NOT USE IT FOR PRODUCTION.

## 🚀 Demo

[Try now](https://poc-kv-auth.pages.dev)

## 📃 Documentation

Generally it is not recommended to store users passwords and you should avoid it as much as possible, by instead using OAuth Providers or using E-Mail Sign in with magic-links.

Pages comes with a feature called Pages functions where you can execute server-side code on the edge. The KV data store is directly available to the Pages functions.

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
[]()
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

If you have any feedback, please reach out to me at subhendukundu14@gmail.com

## ✍️ Authors

-   [@max-elia](https://www.github.com/max-elia)

## 💼 License

[MIT](https://github.com/maxelia/poc-kv-auth/blob/main/LICENSE)
