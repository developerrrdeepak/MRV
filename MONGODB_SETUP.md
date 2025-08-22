# MongoDB Setup for CarbonMRV

This document explains how to set up and use the local MongoDB instance for the CarbonMRV system.

## Prerequisites

- Docker and Docker Compose installed on your system
- Port 27017 (MongoDB) and 8081 (Mongo Express) available

## Quick Start

### 1. Start MongoDB with Docker Compose

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Check if containers are running
docker-compose ps
```

### 2. Connection Details

**MongoDB Connection:**
- Host: `localhost`
- Port: `27017`
- Database: `carbonmrv`
- Username: `carbonmrv_user`
- Password: `carbonmrv_password`
- Connection String: `mongodb://carbonmrv_user:carbonmrv_password@localhost:27017/carbonmrv`

**Admin Connection (for management):**
- Username: `admin`
- Password: `password123`
- Connection String: `mongodb://admin:password123@localhost:27017/carbonmrv`

**Mongo Express (Web UI):**
- URL: http://localhost:8081
- No authentication required (disabled for local development)

### 3. Environment Variables

Update your `.env` file with the connection string:

```env
MONGODB_URI=mongodb://carbonmrv_user:carbonmrv_password@localhost:27017/carbonmrv
```

### 4. Start the Application

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## Database Structure

The MongoDB database includes the following collections:

### Collections

1. **farmers** - Farmer registration and profile data
2. **carbonprojects** - Carbon offset project information
3. **fieldmeasurements** - Field data collection and measurements
4. **verifications** - Third-party verification records

### Sample Data

The database is initialized with sample data:
- 2 sample farmers (Punjab and Haryana)
- 1 sample agroforestry project
- Proper indexes for performance

## API Endpoints

### Farmer Endpoints

```
GET    /api/farmers              # List all farmers
GET    /api/farmers/stats        # Farmer statistics
GET    /api/farmers/:id          # Get farmer by MongoDB ID
GET    /api/farmers/id/:farmerId # Get farmer by farmer ID
POST   /api/farmers              # Create new farmer
PUT    /api/farmers/:id          # Update farmer
DELETE /api/farmers/:id          # Deactivate farmer
```

### Carbon Project Endpoints

```
GET    /api/projects              # List all projects
GET    /api/projects/stats        # Project statistics
GET    /api/projects/:id          # Get project by MongoDB ID
GET    /api/projects/id/:projectId # Get project by project ID
GET    /api/projects/:id/metrics  # Get project metrics
POST   /api/projects              # Create new project
PUT    /api/projects/:id          # Update project
DELETE /api/projects/:id          # Deactivate project
```

## Management Commands

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs mongodb
docker-compose logs mongo-express

# Restart services
docker-compose restart

# Remove everything (including data)
docker-compose down -v
```

### MongoDB Commands

```bash
# Connect to MongoDB shell
docker exec -it carbonmrv_mongodb mongosh

# Connect with authentication
docker exec -it carbonmrv_mongodb mongosh -u admin -p password123

# Backup database
docker exec carbonmrv_mongodb mongodump --db carbonmrv --out /backup

# Restore database
docker exec carbonmrv_mongodb mongorestore --db carbonmrv /backup/carbonmrv
```

## Development Tips

### 1. Database Reset

To reset the database with fresh sample data:

```bash
docker-compose down -v
docker-compose up -d
```

### 2. Adding More Sample Data

You can add more sample data by:
1. Using the API endpoints
2. Using Mongo Express web interface
3. Modifying `mongo-init/init-carbonmrv.js`

### 3. Performance Monitoring

Use Mongo Express to:
- View collection statistics
- Monitor query performance
- Manage indexes
- Export/import data

### 4. Production Considerations

For production deployment:
1. Change default passwords
2. Enable authentication for Mongo Express
3. Use MongoDB Atlas or proper MongoDB cluster
4. Set up proper backup strategy
5. Configure SSL/TLS

## Troubleshooting

### Common Issues

1. **Port 27017 already in use**
   ```bash
   # Check what's using the port
   lsof -i :27017
   # Stop local MongoDB if running
   brew services stop mongodb-community
   ```

2. **Docker permission issues**
   ```bash
   # Run with sudo or add user to docker group
   sudo docker-compose up -d
   ```

3. **Connection refused**
   - Check if Docker containers are running
   - Verify port mapping in docker-compose.yml
   - Check firewall settings

4. **Authentication failed**
   - Verify connection string credentials
   - Check if user was created properly

### Logs and Debugging

```bash
# View MongoDB logs
docker-compose logs -f mongodb

# Check container status
docker-compose ps

# Enter MongoDB container
docker exec -it carbonmrv_mongodb bash
```

## Security Notes

⚠️ **Important**: This setup is for local development only. The default passwords and configurations are not secure for production use.

For production:
- Use strong passwords
- Enable SSL/TLS
- Configure proper firewall rules
- Use MongoDB Atlas or managed MongoDB service
- Enable authentication for all admin interfaces
