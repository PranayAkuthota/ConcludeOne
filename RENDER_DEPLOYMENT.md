# Deploying ConcludeOne on Render

This guide provides step-by-step instructions for deploying **ConcludeOne** on [Render](https://render.com).

---

## 🎯 Recommended Method: Single Unified Web Service

By serving both the React frontend and Express backend from a single Render Web Service:
- You only need **1 free/starter service** on Render.
- No CORS errors or domain mismatch issues.
- Fast deployment from the root directory.

### Step 1: Push Changes to GitHub
Make sure all updated files (including root `package.json`, `client/src/lib/api.js`, and `server/index.js`) are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure project for Render deployment"
git push origin main
```

### Step 2: Create a Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`ConcludeOne`).
4. Configure the service settings:
   - **Name**: `conclude-one` (or your choice)
   - **Language / Environment**: `Node`
   - **Branch**: `main`
   - **Region**: Nearest to your users / database
   - **Root Directory**: *(Leave empty to build from repo root)*
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: `Free` or `Starter`

### Step 3: Add Environment Variables in Render
In the **Environment** tab of your Render service, add the following variables:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations and frontend static serving |
| `MONGO_URI` | `mongodb+srv://...` | Your [MongoDB Atlas](https://www.mongodb.com/atlas) connection string |
| `JWT_SECRET` | `your_secret_key_here` | Secure string used to sign JWT auth tokens |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key |
| `AI_PROVIDER` | `gemini` | Primary AI provider (`gemini`, `groq`, or `openrouter`) |
| `OPENROUTER_API_KEY` | *(Optional)* | Failover provider key |
| `GROQ_API_KEY` | *(Optional)* | Failover provider key |

> **Note**: Render automatically provides and manages the `PORT` environment variable.

### Step 4: Deploy & Verify
1. Click **Create Web Service** (or **Deploy latest commit**).
2. Monitor the deployment logs. Render will:
   - Install backend dependencies (`server/`)
   - Install frontend dependencies (`client/`)
   - Build the frontend bundle (`client/dist`)
   - Start the Express server (`node server/index.js`)
3. Once deployed, open your Render URL (e.g., `https://conclude-one.onrender.com`).

---

## 🌐 Alternative Method: Split Deployment (Backend + Frontend)

If you prefer deploying the Backend and Frontend as two independent services:

### 1. Backend Service (Render Web Service)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Same backend variables as above.

### 2. Frontend Site (Render Static Site)
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: URL of your backend web service (e.g., `https://concludeone-api.onrender.com`)
