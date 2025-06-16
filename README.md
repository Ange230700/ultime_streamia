<!-- README.md -->

# Ultime Streamia

<!-- ![Ultime Streamia Logo](public/logo.png) Replace with your logo if available -->

**Ultime Streamia** is a full-stack streaming platform demo built with **Next.js (App Router)**, **Prisma ORM**, and **MySQL**.
It features user authentication, video browsing, commenting, theming, and a modern UI powered by PrimeReact and TailwindCSS.

---

## Table of Contents

<!-- * [Demo](#demo) -->

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
<!-- * [License](#license)
- [Acknowledgements](#acknowledgements) -->
- [Contact](#contact)

<!-- ---

## Demo

Live demo: \[coming soon]
Or run locally at [http://localhost:3000](http://localhost:3000)

![Screenshot](public/screenshot.png) Replace with a real screenshot or remove if not available -->

---

## Tech Stack

**Frontend:**

- Next.js 15 (React 19, App Router)
- PrimeReact
- Tailwind CSS
- Axios

**Backend:**

- Next.js API routes (Edge & serverless functions)
- Prisma ORM

**Database:**

- MySQL

**Tools:**

<!-- * Docker (for local DB/dev, optional) -->
<!-- * GitHub Actions (CI/CD, optional) -->

- Husky, lint-staged, Prettier, ESLint (for code quality)

---

## Getting Started

### Prerequisites

- Node.js (>=20.x)
- MySQL database (local, Docker, or managed)
- Docker (optional)

### Installation

```bash
git clone https://github.com/Ange230700/ultime_streamia.git
cd ultime_streamia
npm install
```

---

## Running the Project

### 1. Setup Environment Variables

Copy `.env.sample` to `.env` and fill in your values:

```env
DATABASE_URL="mysql://user:password@host:port/db_name"
DATABASE_URL_PROD="mysql://user:password@host:port/db_name?sslmode=require"
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=10
SUPERUSER_USERNAME=your_superuser_username
SUPERUSER_EMAIL=your_superuser_email
SUPERUSER_PASSWORD=your_superuser_password
```

### 2. Run Prisma Migrations & Seed Database

```bash
npm run prisma:migrate:dev
npm run prisma:db:seed
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── src/
│   ├── app/               # Next.js App Router pages, layouts, providers
│   ├── api/               # API routes for videos, users, auth, comments, categories
│   ├── components/        # Reusable React components (Navbar, Footer, VideoCard, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React context providers
│   ├── lib/               # Utility libraries (Prisma client, validation, etc.)
│   ├── schemas/           # Zod validation schemas
│   ├── types/             # TypeScript types/interfaces
│   └── utils/             # Utility helpers
├── prisma/
│   ├── schema.prisma      # Prisma DB schema
│   └── seed.ts            # Seed script for database
├── public/                # Static assets (logo, themes, screenshot, etc.)
├── .env.sample            # Sample environment config
├── package.json
├── tsconfig.json
└── ...
```

---

## API Documentation

The app exposes RESTful and RPC-like endpoints under `/api`:

- `/api/videos` – List, create videos
- `/api/videos/[videoId]` – Get/update/delete a video
- `/api/users/register` – User registration
- `/api/users/login` – User login (JWT)
- `/api/users/me` – Authenticated user info
- `/api/users/logout`, `/api/users/logout-all` – Session/logout
- `/api/comments` – Comments on videos
- `/api/categories` – List/create categories
- `/api/categories/[categoryId]/videos` – Videos in category
- `/api/auth/refresh` – Refresh JWT access token

All endpoints accept/return JSON.

> _For detailed request/response shapes, see Zod schemas in `src/schemas/` or source code in `src/app/api/`._

---

## Testing

To run tests:

```bash
npm test
```

_Note: Testing setup is not included by default. One can add [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/) for unit/integration tests if desired._

---

## Deployment

1. Ensure environment variables are set (`.env` or cloud secrets)
2. Build the app:

   ```bash
   npm run build
   ```

3. Start in production:

   ```bash
   npm start
   ```

4. Deployed to [Vercel](https://ultime-streamia.vercel.app/)

<!-- > **Vercel:**
> [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) -->

---

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=
DATABASE_URL_PROD=
JWT_SECRET=
SALT_ROUNDS=
SUPERUSER_USERNAME=
SUPERUSER_EMAIL=
SUPERUSER_PASSWORD=
```

See `.env.sample` for examples and required fields.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

_Pre-commit hooks, linting, and formatting are enforced via Husky, lint-staged, Prettier, and ESLint._

<!-- ---

## License

MIT License

---

## Acknowledgements

Special thanks to the following libraries, frameworks, and contributors:

* [Next.js](https://nextjs.org/)
* [PrimeReact](https://primereact.org/)
* [Prisma](https://www.prisma.io/)
* [MySQL](https://www.mysql.com/)
* [Tailwind CSS](https://tailwindcss.com/) -->

---

## Contact

Ange KOUAKOU – [kouakouangeericstephane@gmail.com](mailto:kouakouangeericstephane@gmail.com)

[Project Link](https://github.com/Ange230700/ultime_streamia)
