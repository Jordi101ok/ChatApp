# ChatApp client — rebuild steps

## 1. Create the Vite project

From the solution folder (`C:\Users\USER\source\repos\ChatApp`):

```
npm create vite@latest chatapp.client -- --template react-ts
```

Pick **ESLint** when it asks which linter.

```
cd chatapp.client
npm install
npm install react-router-dom
```

## 2. Copy these files in

Overwrite / create, keeping the folder structure:

```
chatapp.client/
├── vite.config.ts          ← overwrite
└── src/
    ├── App.tsx             ← overwrite
    ├── auth/
    │   ├── AuthContext.tsx
    │   └── RequireAuth.tsx
    ├── pages/
    │   ├── Home.tsx
    │   ├── Login.tsx
    │   └── Register.tsx
    └── types/
        └── auth.ts
```

If App.tsx has `import './App.css'` and you removed App.css, delete that line.

## 3. Check the port

`vite.config.ts` proxies to `https://localhost:7023`. Confirm that matches
your API — it's in `ChatApp/Properties/launchSettings.json` under the
`https` profile.

## 4. Run both

- API: F5 in Visual Studio
- Client: `npm run dev` in chatapp.client (use a terminal OUTSIDE Visual
  Studio — the integrated one dies on Ctrl+C)

Open http://localhost:53345

## 5. Commit immediately

Before testing. Make sure `chatapp.client/.gitignore` has `node_modules`
and `dist`.

## 6. Test checklist

| Action | Expected |
|---|---|
| Land on `/` | redirected to `/login` |
| Click "Create one" | `/register`, no page reload |
| Register with a new email | lands on `/`, shows your name |
| Click "Sign out" | back to `/login` |
| Sign in with that account | back to `/` |
| Sign in, wrong password | red "Invalid email or password." |
| Register, existing email | red "Email already registered." |

## If the page is blank

That's a JS error. Open the browser console (F12 → Console) and reload.
Most likely cause: `react-router-dom` didn't install — check
`package.json` dependencies for it.
