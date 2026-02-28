# Render.com Deployment Guide

## Prerequisites
- GitHub repository with your code pushed
- Neon PostgreSQL database (free tier available)
- Render.com account

## Step 1: Prepare Your Database

### Create a Neon PostgreSQL Database
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:password@host/database`)
4. Keep this handy for Render

### Push Database Schema
```bash
npm run db:push
```
This runs migrations to set up your schema before deploying.

## Step 2: Create Render Web Service

1. **Go to [render.com](https://render.com)**
2. Click **"New +"** → **"Web Service"**
3. **Connect your GitHub repository**
   - Choose the repo with your code
   - Select the branch (typically `main`)

4. **Configure the Service**
   - **Name**: `ehs-safety-tool` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: Leave blank (Render will use `render.json`)
   - **Start Command**: Leave blank (Render will use `render.json`)
   - **Plan**: Free tier is fine for testing

5. **Add Environment Variables**
   Click **"Add Environment Variable"** and add:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | *Paste your Neon connection string here* |

6. **Click "Create Web Service"**

Wait 5-10 minutes for the build to complete.

## Step 3: Verify Deployment

Once deployed:
- Render will give you a URL (e.g., `https://ehs-safety-tool.onrender.com`)
- Visit that URL to test
- Check logs in Render dashboard if issues occur

## Step 4: Custom Domain (Optional)

1. In your Render service, go to **Settings** → **Custom Domains**
2. Add your domain and follow DNS instructions

## Troubleshooting

### Build Fails
- Check **Logs** tab in Render dashboard
- Common causes:
  - Missing environment variables
  - Database connection issues
  - Node/npm version incompatibility

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure IP allowlist includes Render IPs (usually auto-allowed)

### Cold Start / Slow Initial Load
- Free Render instances sleep after 15 min of inactivity
- Upgrade to Paid plan for always-on service

## Tips

✅ **Auto-Deploy**: Push to GitHub → Render auto-rebuilds  
✅ **Logs**: View real-time logs in Render dashboard  
✅ **Rollback**: Manually select previous deployments if needed  

## Files Created for Render

- `render.json` - Build/start commands
- `.env.example` - Environment variable template
- Ensure `dist/` and `node_modules/` are git-ignored (already configured)

Ready to deploy? Push your code and connect Render! 🚀
