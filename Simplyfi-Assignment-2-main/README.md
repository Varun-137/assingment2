# User Profiles (SimplyFI Assignment)

## Scripts
- npm start: Run dev server at http://localhost:3000
- npm run build: Production build to ./build

## Stack
- React (CRA)
- Ant Design (layout/components)
- Bootstrap CSS (helper classes)
- DiceBear Avatars API (avatars)

## Features
- Fetches users from `https://jsonplaceholder.typicode.com/users`
- Shows loading spinner and error state
- Responsive grid of user profile cards
- DiceBear avatars based on username
- Edit user data via Ant Design Modal + Form (state lifted to App)

## Setup
```bash
npm install
npm start
```

## Deploy (Vercel)
```bash
npm run build
npx vercel deploy --prod build
```

## Notes
- AntD global CSS imported in `src/index.js`.
- Bootstrap linked in `public/index.html`.
