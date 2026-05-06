# Project Notes

## What this frontend does
- Next.js App Router frontend for RapidServe, a code deployment platform.
- The marketing home page is in `app/page.tsx` and links into the deploy console at `/deploy`.
- The deploy console in `app/deploy/page.tsx` accepts a GitHub repo URL and project slug, then starts a deployment and streams build logs over Socket.IO.
- The older root `page.tsx` is a legacy deploy screen that still talks to separate local backend services.

## Current runtime assumptions
- `app/deploy/page.tsx` calls `http://localhost:9000/project` for deployment setup.
- `app/deploy/page.tsx` listens to `http://localhost:9002` for build logs.
- The legacy root page uses `http://localhost:4000/rundocker` and `ws://localhost:8080`.
- Deployed apps are expected at `http://<slug>.localhost:8000`.

## UI structure
- Shared UI primitives live in `components/ui/` and are used instead of hand-rolled controls where practical.
- Tailwind CSS and the existing design tokens in `app/globals.css` should be preserved unless a redesign explicitly changes them.
- Framer Motion is already part of the UI for page and card transitions.

## Editing rules
- Do not delete files unless explicitly requested.
- Keep changes focused and preserve existing routes and backend contracts unless the task is specifically to change them.
- If you add or rename a route, update this file so the next change has the right context.
