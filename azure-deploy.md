# Azure Static Web Apps Deployment Guide

## Prerequisites
1. Azure subscription
2. Azure CLI installed locally (optional)
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

### Option A: GitHub (Recommended)
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
   - **Region**: Choose closest to your users (e.g., Central India)
   - **Source**: GitHub/Azure DevOps/GitLab
   - **Organization**: Your GitHub/DevOps organization
   - **Repository**: Select your repository
   - **Branch**: main
   - **Build Presets**: React
   - **App location**: `/` (root)
   - **Api location**: `api` (for the save function)
   - **Output location**: `dist`

5. **Click "Review + Create"** then **"Create"**

### Method 2: Azure CLI
```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name yahavi-rsvp-rg --location "Central India"

# Create static web app
az staticwebapp create \
  --name yahavi-agm-rsvp \
  --resource-group yahavi-rsvp-rg \
  --source https://github.com/yourusername/yahavi-agm-rsvp \
  --location "Central India" \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist" \
  --login-with-github
```

## Step 4: Data Storage Solution

### Current Implementation
The application uses a hybrid storage approach:
1. **Primary**: JSON file in the repository (`public/api/responses.json`)
2. **Backup**: Browser localStorage for offline functionality
3. **API**: Azure Functions for data persistence

### For Production (Recommended Upgrade)
For a production environment, consider upgrading to:
1. **Azure Cosmos DB** (NoSQL database)
2. **Azure SQL Database** (Relational database)
3. **Azure Table Storage** (Simple key-value storage)

## Step 5: Configure Build Settings

Azure will automatically detect your React app and configure the build. The build process will:
1. Run `npm install`
2. Run `npm run build`
3. Deploy the `dist` folder contents
4. Deploy API functions from the `api` folder

## Step 6: Custom Domain (Optional)

1. **In Azure Portal**, go to your Static Web App
2. **Navigate to "Custom domains"**
3. **Add custom domain** (requires domain ownership verification)
4. **Configure DNS** with your domain provider

## Step 7: Environment Variables (If Needed)

1. **In Azure Portal**, go to your Static Web App
2. **Navigate to "Configuration"**
3. **Add application settings** for any environment variables

## Step 8: Monitor and Manage

- **View deployment logs** in the Azure Portal
- **Monitor usage** and performance
- **Set up alerts** for availability monitoring

## Security Features

### Admin Access
- **Password**: `yahavi2025` (change this in production)
- **Features**: View all responses, export data, filter and sort
- **Security**: Client-side authentication (upgrade to server-side for production)

### Data Protection
- **HTTPS by default**
- **Global CDN**
- **DDoS protection**
- **CORS configured**

## Cost Estimation
- **Free Tier**: 100GB bandwidth, 0.5GB storage, 2 custom domains
- **Standard Tier**: ₹750/month (~$9) for additional features if needed
- **Expected monthly cost**: ₹0 (within free limits for typical society usage)

## Automatic Deployments
Once configured, any push to your main branch will automatically trigger a new deployment.

## Data Management

### Viewing Responses
1. Access the admin panel with password: `yahavi2025`
2. View all responses with sorting and filtering
3. Export data to CSV for external analysis

### Data Backup
- Responses are stored in the repository's JSON file
- Automatic backup to localStorage
- Export CSV functionality for external backup

## Troubleshooting

### Common Issues
1. **Build failures**: Check build logs in Azure Portal
2. **API not working**: Verify `api` folder is properly configured
3. **Data not persisting**: Check API function logs

### Build Configuration
- Ensure `staticwebapp.config.json` is in your root directory
- Verify build output location is set to `dist`
- Check that API location is set to `api`

## Production Recommendations

### Security Enhancements
1. **Move admin authentication to server-side**
2. **Use Azure Active Directory** for admin access
3. **Implement rate limiting** for form submissions
4. **Add CAPTCHA** to prevent spam

### Data Storage Upgrades
1. **Azure Cosmos DB**: For scalable NoSQL storage
2. **Azure SQL Database**: For relational data with complex queries
3. **Azure Blob Storage**: For file attachments if needed

### Monitoring
1. **Application Insights**: For performance monitoring
2. **Azure Monitor**: For uptime and availability
3. **Custom alerts**: For form submission monitoring

Your application will be available at: `https://your-app-name.azurestaticapps.net`

## Support
For technical support with this RSVP system, contact your IT administrator or refer to the Azure Static Web Apps documentation.