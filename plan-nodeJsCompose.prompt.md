## Plan: Fix Docker Compose Node version for Next.js build

TL;DR - The repo’s `package.json` and Next.js version require Node >= 20.9.0, but `docker-compose.yml` is using `node:18-alpine` and `yarn` commands. Update `docker-compose.yml` to use a newer Node image and the correct install/run commands for this repo.

**Steps**
1. Edit `docker-compose.yml`.
   - Change `image: node:18-alpine` to a Node 20+ image such as `node:22.17.0-alpine`.
   - Change the service `command` from `sh -c "yarn install && yarn dev"` to a command matching the repo’s package manager, such as `sh -c "npm ci && npm run dev"`.
2. Verify the repo’s package manager files.
   - Confirm `package-lock.json` exists and `pnpm-lock.yaml` does not, so `npm ci` is the simplest and most compatible approach for Docker Compose.
3. Run Docker Compose again.
   - Rebuild and start the container with `sudo docker compose up --build -d`.
   - Confirm the app starts without the Node version error.

**Relevant files**
- `/home/ubuntu/rainco2008-repos/chinavibe/docker-compose.yml` — update Node base image and runtime install/start command.
- `/home/ubuntu/rainco2008-repos/chinavibe/package.json` — source of Node engine requirement and available scripts.
- `/home/ubuntu/rainco2008-repos/chinavibe/Dockerfile` — already uses `node:22.17.0-alpine`, which is a good reference for the correct Node major version.

**Verification**
1. Confirm `docker-compose.yml` now uses `node:22.17.0-alpine` or higher.
2. Confirm `docker-compose.yml` command uses `npm ci && npm run dev` or similar working install/run flow.
3. Run `sudo docker compose up --build -d` and ensure the Next.js service starts without the Node version error.

**Decision**
- Use `node:22.17.0-alpine` in `docker-compose.yml` because it aligns with the existing Dockerfile and satisfies Next.js requirement.
- Use `npm ci` rather than `yarn install` because the repository contains `package-lock.json` and does not appear to include Yarn lock metadata.
