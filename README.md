# English Platform Hazaribagh — Full Stack Application with Sanity Studio

This project is a complete full-stack web application for **English Platform Hazaribagh** (R. K. Verma Sir), integrated with **Sanity CMS Content Lake**, **MongoDB Atlas**, **Express.js**, and **React 19 + Vite**.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
cd studio && npm install && cd ..
```

### 2. Run Main Web Application (Port 3000)
```bash
npm run dev
```
The web application will launch at `http://localhost:3000`.

### 3. Run Sanity Studio (Port 3333)
```bash
npm run studio
```
The Sanity Studio CMS dashboard will launch at `http://localhost:3333`.

---

## 📁 Project Architecture

```
├── server.ts             # Express Backend Server (API & MongoDB)
├── src/                  # React + Vite Frontend
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application Page Views
│   ├── context/          # React Auth & State Contexts
│   ├── lib/
│   │   ├── db/           # MongoDB Connection & Mongoose Models
│   │   └── sanity/       # Sanity Client, Image Builder & GROQ Queries
│   │       ├── client.ts
│   │       ├── image.ts
│   │       ├── live.ts
│   │       └── queries.ts
│   └── types.ts          # Global TypeScript interfaces
└── studio/               # Sanity Studio v4 CMS
    ├── package.json
    ├── sanity.config.ts  # Sanity Studio configuration
    ├── sanity.cli.ts     # Sanity CLI configuration
    ├── .env.example
    ├── schemaTypes/      # All 20 Sanity Schemas
    └── structure/
        └── deskStructure.ts # Custom Sanity Desk Layout & Singletons
```

---

## 📄 Documentation Links
- [Studio Setup Guide](./STUDIO_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Guide](./ENVIRONMENT.md)
