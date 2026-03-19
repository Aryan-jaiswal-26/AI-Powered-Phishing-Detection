# AI-Powered Phishing Detection (Full Stack)

This repository is now split into separate frontend and backend applications.

## Stack Selection

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- Three.js (`@react-three/fiber`, `@react-three/drei`)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- `helmet` for secure HTTP headers
- `cors` for cross-origin access
- `morgan` for request logging

This stack was chosen to keep one language (JavaScript) across the full stack and integrate quickly with your existing Vite React app.

## Folder Structure

- `frontend/`: Vite React UI
- `backend/`: Express API server
- `package.json` (root): convenience scripts to run frontend/backend

## Backend API Endpoints

- `GET /api/health`
- `POST /api/analyze`
- `GET /api/history`
- `DELETE /api/history`
- `GET /api/system-health`
- `GET /api/vault`
- `POST /api/vault`
- `DELETE /api/vault`

## MongoDB Setup

1. Ensure Docker Desktop is running.

2. Create backend env file from example (optional because this repo now includes `backend/.env` default):

```bash
copy backend/.env.example backend/.env
```

3. Start MongoDB container:

```bash
npm run db:up
```

4. If using local Mongo or Atlas, set:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ics
```

Important:
- The current backend uses Mongoose and requires `MONGO_URI`.
- A MongoDB Atlas API key alone is not enough for Mongoose DB connection.
- If you want Atlas Data API routes, use `MONGODB_DATA_API_KEY` + `MONGODB_DATA_API_URL` and call HTTP endpoints instead of direct Mongoose queries.
 Atlas Data API mode is supported:

```env
USE_ATLAS_DATA_API=true
MONGODB_DATA_API_KEY=your_key
MONGODB_DATA_API_URL=https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1/action
MONGODB_DATA_SOURCE=Cluster0
MONGODB_DATABASE=ics
```

When `USE_ATLAS_DATA_API=true`, backend persistence uses Atlas Data API for history and vault collections instead of direct Mongoose connection.

5. Start backend:

```bash
npm run dev:backend
```

## Run Instructions

Install dependencies:

```bash
npm install --prefix frontend
npm install --prefix backend
```

Run frontend:

```bash
npm run dev:frontend
```

Run backend:

```bash
npm run dev:backend
```

Or use root shortcuts:

```bash
npm run dev
npm run build
```

Run everything with one command (Mongo + frontend + backend):

```bash
npm run start:all
```

## Notes

- Frontend uses Vite proxy (`/api`) to backend at `http://localhost:8787` in local dev.
- History and vault are persisted in MongoDB.
- Frontend still has local analyze fallback if backend is unreachable.
