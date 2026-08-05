# Environment Variables Configuration Guide

Here is the list of all environment variables supported across the application and Sanity Studio.

## 🛠️ Main App Variables (`.env`)

```env
# Server Port
PORT=3000

# Gemini API Key for AI Features
GEMINI_API_KEY="your_gemini_api_key"

# MongoDB Atlas Connection String
MONGODB_URI="mongodb+srv://user:password@cluster0.mongodb.net/dbname?retryWrites=true&w=majority"

# Sanity Credentials (Frontend & Server)
SANITY_PROJECT_ID="yy1yyjmy"
SANITY_DATASET="production"
SANITY_API_VERSION="2024-01-01"
SANITY_TOKEN="optional_write_token"

VITE_SANITY_PROJECT_ID="yy1yyjmy"
VITE_SANITY_DATASET="production"
VITE_SANITY_API_VERSION="2024-01-01"
```

## 🎨 Studio Variables (`studio/.env.example`)

```env
SANITY_PROJECT_ID="yy1yyjmy"
SANITY_DATASET="production"
SANITY_API_VERSION="2024-01-01"
SANITY_TOKEN=""
```
