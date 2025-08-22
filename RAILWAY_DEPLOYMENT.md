# Railway Deployment Guide for CarbonMRV

Complete guide to deploy your MRV system to Railway with MongoDB.

## Prerequisites

1. **GitHub Repository**: Your code is already on GitHub
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **Database**: Choose MongoDB option (Railway plugin or Atlas)

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `developerrrdeepak/MRV`
5. Select branch: `glow-home`

### 2. Add MongoDB Database

**Option A: Railway MongoDB Plugin (Recommended)**

1. In your Railway project dashboard
2. Click **"+ New Service"**
3. Select **"Database" → "MongoDB"**
4. Railway will create a MongoDB instance
5. Get the connection string from the MongoDB service

**Option B: MongoDB Atlas (External)**

1. Create free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Get the connection string
4. Whitelist Railway IPs: `0.0.0.0/0` (for simplicity)

### 3. Configure Environment Variables

In your Railway project settings, add these environment variables:

```env
# Required Variables
MONGODB_URI=mongodb://mongodb:mongodb@mongodb.railway.internal:27017/carbonmrv
PORT=8080
NODE_ENV=production

# Optional Variables
PING_MESSAGE=ping pong from railway
VITE_PUBLIC_BUILDER_KEY=__BUILDER_PUBLIC_KEY__
```

**For MongoDB Atlas (if using):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonmrv
```

### 4. Deploy Settings

Railway will automatically:
- ✅ Detect Node.js project
- ✅ Install dependencies with `pnpm install`
- ✅ Build with `npm run build`
- ✅ Start with `npm run start`

### 5. Domain Setup

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** for a free railway.app subdomain
3. Or add your custom domain

## Expected Deployment URL

Your app will be available at:
```
https://your-project-name.up.railway.app
```

## API Endpoints

After deployment, your API will be available:

```bash
# Test basic endpoint
curl https://your-app.railway.app/api/ping

# Test farmer API
curl https://your-app.railway.app/api/farmers

# Test projects API  
curl https://your-app.railway.app/api/projects
```

## Railway Configuration Files

The project includes:

1. **`railway.json`** - Railway-specific configuration
2. **`.env.example`** - Environment variables template
3. **`package.json`** - Already configured for Railway

## Database Connection

### Railway MongoDB Plugin Connection

If using Railway's MongoDB plugin:

```javascript
// Automatic connection from environment
const MONGODB_URI = process.env.MONGODB_URI;
// Will be: mongodb://mongodb:mongodb@mongodb.railway.internal:27017/carbonmrv
```

### MongoDB Atlas Connection

If using MongoDB Atlas:

```javascript
const MONGODB_URI = process.env.MONGODB_URI;
// Will be: mongodb+srv://user:pass@cluster.mongodb.net/carbonmrv
```

## Monitoring & Logs

### View Logs
1. Go to your Railway project
2. Click on your service
3. View **"Deployments"** tab for build logs
4. View **"Logs"** tab for runtime logs

### Health Check
```bash
# Check if app is running
curl https://your-app.railway.app/api/ping

# Should return: {"message":"ping pong from railway"}
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check if all dependencies are in package.json
   # Railway logs will show exact error
   ```

2. **MongoDB Connection Error**
   ```bash
   # Verify MONGODB_URI environment variable
   # Check MongoDB service is running
   # For Atlas: verify IP whitelist and credentials
   ```

3. **Port Issues**
   ```bash
   # Railway automatically sets PORT environment variable
   # Your app listens on process.env.PORT || 3000
   ```

4. **Static Files Not Served**
   ```bash
   # Ensure build process creates dist/spa folder
   # Check vite.config.ts output directory
   ```

### Debug Commands

```bash
# View Railway CLI logs
railway logs

# Connect to Railway database
railway connect mongodb

# Check environment variables
railway variables
```

## Performance Optimization

### Railway-Specific Optimizations

1. **Memory Usage**: Railway provides 512MB RAM on free tier
2. **Build Time**: ~2-3 minutes for this project
3. **Cold Starts**: ~1-2 seconds for first request

### Scaling Options

- **Hobby Plan**: $5/month, more resources
- **Pro Plan**: $20/month, autoscaling
- **Custom**: Enterprise plans available

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **Database**: Use strong passwords for MongoDB
3. **CORS**: Configure for your domain only
4. **Rate Limiting**: Add for production use

## Backup Strategy

### Database Backups

**Railway MongoDB Plugin:**
```bash
# Railway handles automatic backups
# Manual backup via CLI
railway connect mongodb
mongodump --db carbonmrv
```

**MongoDB Atlas:**
- Automatic backups included
- Point-in-time recovery available

## Cost Estimation

### Railway Pricing

- **Starter**: Free ($5 credit monthly)
- **Hobby**: $5/month per service
- **Pro**: $20/month per service

### Database Costs

- **Railway MongoDB**: ~$5/month
- **MongoDB Atlas**: Free 512MB tier

**Total Monthly Cost**: $0-10 for development, $10-25 for production

## Next Steps After Deployment

1. **Test all API endpoints**
2. **Add sample data** via API
3. **Set up monitoring** alerts
4. **Configure backups**
5. **Add custom domain**
6. **Set up CI/CD** for automatic deployments

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: Community support
- **MongoDB Support**: Atlas documentation

---

Your MRV system will be live and scalable on Railway! 🚀
