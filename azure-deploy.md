# Azure Static Web Apps Deployment Guide

## Prerequisites
1. Azure subscription
2. Azure CLI installed locally
3. Git repository (GitHub, Azure DevOps, or GitLab)

## Step 1: Download Your Project Files

1. **Download all project files** from this Bolt environment to your local machine
2. **Create a new Git repository** locally:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Yahavi AGM RSVP System"
   ```

## Step 2: Push to Your Git Repository

### Option A: GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/yahavi-agm-rsvp.git
   git branch -M main
   git push -u origin main
   ```

### Option B: Azure DevOps
1. Create a new project in Azure DevOps
2. Create a new repository
3. Push your code following Azure DevOps instructions

## Step 3: Create Azure Static Web App

### Method 1: Azure Portal (Recommended)
1. **Login to Azure Portal**: https://portal.azure.com
2. **Create Resource** → Search for "Static Web Apps"
3. **Click "Create"**
4. **Fill in details**:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `yahavi-agm-rsvp` (or your preferred name)
   - **Plan Type**: Free (sufficient for this application)
   - **Region**: Choose closest to your users
   - **Source**: GitHub/Azure DevOps/GitLab
   - **Organization**: Your GitHub/DevOps organization
   - **Repository**: Select your repository
   - **Branch**: main
   - **Build Presets**: React
   - **App location**: `/` (root)
   - **Output location**: `dist`

5. **Click "Review + Create"** then **"Create"**

### Method 2: Azure CLI
```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name yahavi-rsvp-rg --location "East US"

# Create static web app
az staticwebapp create \
  --name yahavi-agm-rsvp \
  --resource-group yahavi-rsvp-rg \
  --source https://github.com/yourusername/yahavi-agm-rsvp \
  --location "East US" \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

## Step 4: Configure Build Settings

Azure will automatically detect your React app and configure the build. The build process will:
1. Run `npm install`
2. Run `npm run build`
3. Deploy the `dist` folder contents

## Step 5: Custom Domain (Optional)

1. **In Azure Portal**, go to your Static Web App
2. **Navigate to "Custom domains"**
3. **Add custom domain** (requires domain ownership verification)
4. **Configure DNS** with your domain provider

## Step 6: Environment Variables (If Needed)

1. **In Azure Portal**, go to your Static Web App
2. **Navigate to "Configuration"**
3. **Add application settings** for any environment variables

## Step 7: Monitor and Manage

- **View deployment logs** in the Azure Portal
- **Monitor usage** and performance
- **Set up alerts** for availability monitoring

## Cost Estimation
- **Free Tier**: 100GB bandwidth, 0.5GB storage (sufficient for this app)
- **Standard Tier**: $9/month for additional features if needed

## Security Features Included
- **HTTPS by default**
- **Global CDN**
- **DDoS protection**
- **Authentication integration** (if needed later)

## Automatic Deployments
Once configured, any push to your main branch will automatically trigger a new deployment.

## Troubleshooting
- Check build logs in Azure Portal under "Functions" → "GitHub Actions"
- Ensure `staticwebapp.config.json` is in your root directory
- Verify build output location is set to `dist`

Your application will be available at: `https://your-app-name.azurestaticapps.net`