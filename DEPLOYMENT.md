# Deploying Civi to Netlify

This guide will walk you through deploying your Next.js application to Netlify.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. All required API keys and environment variables

## Required Environment Variables

Before deploying, make sure you have the following environment variables ready:

### 1. Clerk Authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Usually `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Usually `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Usually `/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Usually `/dashboard`

### 2. MongoDB Database
- `MONGODB_URL` - Your MongoDB connection string

### 3. Gemini AI
- `GEMINI_API_KEY` - Your Google Gemini API key

### 4. Base URL (for production)
- `BASE_URL` - Your Netlify site URL (e.g., `https://your-site.netlify.app`)

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended for first-time deployment)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select your repository

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` (Netlify will handle this automatically with the plugin)
   - **Node version:** `20` (or the version you're using)

4. **Add Environment Variables**
   - In the site settings, go to "Environment variables"
   - Add all the required environment variables listed above
   - Make sure to add them for "Production" environment

5. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically install dependencies and build your site

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize your site**
   ```bash
   netlify init
   ```
   - Follow the prompts to link your site
   - Choose "Create & configure a new site"

4. **Set Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY "your-key"
   netlify env:set CLERK_SECRET_KEY "your-secret"
   netlify env:set MONGODB_URL "your-mongodb-url"
   netlify env:set GEMINI_API_KEY "your-gemini-key"
   netlify env:set BASE_URL "https://your-site.netlify.app"
   # Add all other Clerk environment variables
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Post-Deployment Configuration

### 1. Update Clerk Settings
   - Go to your [Clerk Dashboard](https://dashboard.clerk.com)
   - Navigate to your application settings
   - Add your Netlify URL to "Allowed Origins" and "Redirect URLs"
   - Update the frontend API URL to your Netlify domain

### 2. Update BASE_URL
   - After your first deployment, Netlify will provide you with a URL
   - Update the `BASE_URL` environment variable in Netlify with your actual site URL
   - Redeploy if necessary

### 3. Custom Domain (Optional)
   - In Netlify, go to "Domain settings"
   - Add your custom domain
   - Update `BASE_URL` environment variable with your custom domain
   - Update Clerk settings with your custom domain

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all environment variables are set correctly
- Verify Node.js version matches your local development version

### API Routes Not Working
- Ensure `@netlify/plugin-nextjs` is installed (it's configured in `netlify.toml`)
- Check that server-side functions are properly exported
- Verify environment variables are accessible in server-side code

### Authentication Issues
- Double-check Clerk environment variables
- Ensure Clerk URLs are correctly configured
- Verify that your Netlify URL is added to Clerk's allowed origins

### Database Connection Issues
- Verify MongoDB connection string is correct
- Check if your MongoDB instance allows connections from Netlify's IP addresses
- Consider using MongoDB Atlas with proper IP whitelist settings

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy when you push to your main branch
- Create preview deployments for pull requests
- Run builds automatically

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/integrations/frameworks/nextjs/)
- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

