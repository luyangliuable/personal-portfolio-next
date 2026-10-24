# Personal Portfolio Next

<!-- markdown-toc start - Don't edit this section. -->

**Table of Contents**

- [Personal Portfolio Next](#personal-portfolio-next)
    - [1. <a name='GettingStarted'></a>Getting Started](#1-a-namegettingstartedagetting-started)
        - [1.1. <a name='Prerequisites'></a>Prerequisites](#11-a-nameprerequisitesaprerequisites)
        - [1.2. <a name='InstallDependencies'></a>Install Dependencies](#12-a-nameinstalldependenciesainstall-dependencies)
        - [1.3. <a name='LocalFullStackSetup'></a>Local Full-Stack Setup](#13-a-namelocalfullstacksetupalocal-full-stack-setup)
    - [2. <a name='RunningtheApplication'></a>Running the Application](#2-a-namerunningtheapplicationarunning-the-application)
    - [3. <a name='DevelopmentCommands'></a>Development Commands](#3-a-namedevelopmentcommandsadevelopment-commands)

<!-- markdown-toc end -->

Next.js portfolio app backed by the Rust portfolio API for posts, notes, and images.

## 1. <a name='GettingStarted'></a>Getting Started

### 1.1. <a name='Prerequisites'></a>Prerequisites

- Node.js 20+
- pnpm
- Docker Desktop, for local MongoDB and Redis
- Rust, for running the backend API locally

### 1.2. <a name='InstallDependencies'></a>Install Dependencies

```sh
pnpm install
cp .env.local.example .env.local
```

### 1.3. <a name='LocalFullStackSetup'></a>Local Full-Stack Setup

```sh
docker compose up -d
npm run seed
npm run dev:local
```

Both scripts unset any shell-exported `MONGOURI` and `*_STORE_LOCATION` so `.env.local` is used, and the seed refuses to write to a non-localhost MongoDB. Set `NOTES_STORE_LOCATION` to a local notes checkout to index its markdown as coding notes. Real copies of referenced images placed in `.local/originals/<id>.<ext>` are used instead of the generated placeholders.

In the backend repo:

```sh
cd /Users/liul31/personal-portfolio/server
cat > .env <<'ENV'
MONGOURI=mongodb://localhost:27017
IMAGE_STORE_LOCATION=/Users/liul31/pp-compare/.local/images
ENV
cargo run
```

The seed script creates deterministic PNG images in `.local/images`. Each seeded image ID maps to its own generated image, with the colour derived from the ID.

## 2. <a name='RunningtheApplication'></a>Running the Application

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend uses `NEXT_PUBLIC_API_BASE_URL` from `.env.local` for API calls, the production CORS origin and internal-link detection. Set it to an absolute URL (e.g. `https://your-domain/api`); without it the app falls back to a relative `/api`, which server-side rendering cannot fetch.

## 3. <a name='DevelopmentCommands'></a>Development Commands

```sh
pnpm run format
pnpm run lint
pnpm run build
pnpm test
```
