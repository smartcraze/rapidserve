# Project Notes

## What this frontend does
- Next.js App Router frontend for RapidServe, a code deployment platform.
- The marketing home page is in `app/page.tsx` and links to the `/dashboard`.
- The credentials sign-in page is in `app/signin/page.tsx` and the signup page is in `app/signup/page.tsx`.
- The main workspace is in `app/dashboard/page.tsx`, which displays existing projects and houses the inline Fargate deployment creation dialog.
- The project detail screen is in `app/dashboard/[projectId]/page.tsx` which streams build logs over Socket.IO and contains settings management tools.
- The legacy route `/deploy` has been migrated and now redirects directly to `/dashboard`.

## Current runtime assumptions
- The frontend talks to the Express API backend at `http://localhost:9000`.
- User Auth is custom JWT credentials based (`/api/v1/users/login` and `/signup`).
- Live Socket.IO log streaming is listened to on `http://localhost:9002` via the `logs:<project-slug>` channel subscription.
- Deployed apps are expected at `http://<slug>.localhost:8000`.

## UI structure
- Shared UI primitives live in `components/ui/` (using full shadcn/ui components such as Toaster, Table, ScrollArea, Tabs, Dialog, Avatar, and Card).
- Tailwind CSS and the existing design tokens in `app/globals.css` are preserved.
- Framer Motion is part of the UI for page and card transitions.

## Editing rules
- Do not delete files unless explicitly requested.
- Keep changes focused and preserve existing routes and backend contracts unless the task is specifically to change them.
- If you add or rename a route, update this file so the next change has the right context.

